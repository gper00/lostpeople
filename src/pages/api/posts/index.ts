import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';
import { postLimiter, getClientIp } from '@/lib/rate-limit';

export const GET: APIRoute = async () => {
  try {
    await connectDB();
    const posts = await Post.find({ status: 'published' })
      .populate('userId', 'fullname username image')
      .sort({ createdAt: -1 })
      .lean();
    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async (ctx) => {
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
      JSON.stringify({ error: 'Too many requests. Please wait before creating another post.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = await ctx.request.json();
    const { title, content, excerpt, category, tags, thumbnail, status } = body;

    // --- Validation ---
    const errors: string[] = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('Title is required');
    } else if (title.trim().length < 10) {
      errors.push('Title must be at least 10 characters');
    } else if (title.trim().length > 255) {
      errors.push('Title must not exceed 255 characters');
    }

    if (!excerpt || typeof excerpt !== 'string' || !excerpt.trim()) {
      errors.push('Excerpt is required');
    } else if (excerpt.trim().length < 30) {
      errors.push('Excerpt must be at least 30 characters');
    } else if (excerpt.trim().length > 500) {
      errors.push('Excerpt must not exceed 500 characters');
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      errors.push('Content is required');
    } else if (content.trim().length < 100) {
      errors.push('Content must be at least 100 characters');
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

    // --- Create ---
    await connectDB();
    const slug = await generateUniqueSlug(title.trim());

    const post = await Post.create({
      title: title.trim(),
      slug,
      userId: session.user.id,
      content: content.trim(),
      excerpt: excerpt.trim(),
      category: category || null,
      tags: tags || [],
      thumbnail: thumbnail || null,
      status: status || 'draft',
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
