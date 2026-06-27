import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Increment a post's view counter. Public — the client dedupes per browser
// via localStorage so this is only called once per reader per post.
export const POST: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  try {
    await connectDB();
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true, projection: { viewsCount: 1 } }
    ).lean();
    if (!post) return json({ error: 'Post not found' }, 404);
    return json({ viewsCount: post.viewsCount });
  } catch {
    return json({ error: 'Failed to record view' }, 500);
  }
};
