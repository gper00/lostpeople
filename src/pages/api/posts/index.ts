import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';

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

  try {
    const body = await ctx.request.json();
    const { title, content, excerpt, category, tags, thumbnail, status } = body;

    if (!title || !content || !excerpt) {
      return new Response(JSON.stringify({ error: 'Title, content, and excerpt are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();
    const slug = await generateUniqueSlug(title);

    const post = await Post.create({
      title,
      slug,
      userId: session.user.id,
      content,
      excerpt,
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
