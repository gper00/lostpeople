import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';

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

    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = await generateUniqueSlug(title);
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        slug,
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        category: category !== undefined ? category : existingPost.category,
        tags: tags || existingPost.tags,
        thumbnail: thumbnail !== undefined ? thumbnail : existingPost.thumbnail,
        status: status || existingPost.status,
      },
      { new: true }
    ).lean();

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
