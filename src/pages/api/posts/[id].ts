import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';
import { postLimiter, getClientIp } from '@/lib/rate-limit';

export const GET: APIRoute = async (ctx) => {
  const { id } = ctx.params;

  try {
    await connectDB();
    const post = await Post.findById(id)
      .populate('userId', 'fullname username image')
      .lean();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async (ctx) => {
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rl = postLimiter.check(getClientIp(ctx.request));
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait before updating.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { id } = ctx.params;

  try {
    const body = await ctx.request.json();
    const { title, content, excerpt, category, tags, thumbnail, status } = body;

    await connectDB();

    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existingPost.userId.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- Validation ---
    const errors: string[] = [];

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        errors.push('Title cannot be empty');
      } else if (title.trim().length < 10) {
        errors.push('Title must be at least 10 characters');
      } else if (title.trim().length > 255) {
        errors.push('Title must not exceed 255 characters');
      }
    }

    if (excerpt !== undefined) {
      if (typeof excerpt !== 'string' || !excerpt.trim()) {
        errors.push('Excerpt cannot be empty');
      } else if (excerpt.trim().length < 30) {
        errors.push('Excerpt must be at least 30 characters');
      } else if (excerpt.trim().length > 500) {
        errors.push('Excerpt must not exceed 500 characters');
      }
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || !content.trim()) {
        errors.push('Content cannot be empty');
      } else if (content.trim().length < 100) {
        errors.push('Content must be at least 100 characters');
      }
    }

    if (category !== undefined && category !== null && category !== '') {
      if (typeof category !== 'string' || category.trim().length > 25) {
        errors.push('Category must not exceed 25 characters');
      }
    }

    if (tags !== undefined && Array.isArray(tags)) {
      for (let i = 0; i < tags.length; i++) {
        if (typeof tags[i] !== 'string' || tags[i].trim().length > 25) {
          errors.push('Each tag must not exceed 25 characters');
          break;
        }
      }
    }

    if (thumbnail !== undefined && thumbnail !== null && thumbnail !== '') {
      if (typeof thumbnail !== 'string') {
        errors.push('Invalid thumbnail URL');
      } else {
        try { new URL(thumbnail); } catch { errors.push('Thumbnail must be a valid URL'); }
      }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join('. ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- Update ---
    let slug = existingPost.slug;
    if (title && title.trim() && title.trim() !== existingPost.title) {
      slug = await generateUniqueSlug(title.trim());
    }

    const updateFields: Record<string, unknown> = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content.trim();
    if (excerpt !== undefined) updateFields.excerpt = excerpt.trim();
    updateFields.slug = slug;
    updateFields.category = category !== undefined && category !== null ? category : existingPost.category;
    updateFields.tags = tags !== undefined ? tags : existingPost.tags;
    updateFields.thumbnail = thumbnail !== undefined ? thumbnail : existingPost.thumbnail;
    updateFields.status = status || existingPost.status;

    const updated = await Post.findByIdAndUpdate(id, updateFields, { new: true }).lean();

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (ctx) => {
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = ctx.params;

  try {
    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (post.userId.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await Post.findByIdAndDelete(id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
