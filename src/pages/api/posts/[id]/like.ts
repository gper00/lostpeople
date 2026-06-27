import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Toggle a like. Public — the client tracks whether *this* browser already
// liked the post via localStorage and sends delta +1 (like) or -1 (unlike).
export const POST: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  try {
    const body = await ctx.request.json().catch(() => ({}));
    const delta = body?.delta === -1 ? -1 : 1;

    await connectDB();
    const post = await Post.findById(id).select('likesCount').lean();
    if (!post) return json({ error: 'Post not found' }, 404);

    // Clamp so the counter never goes negative.
    const current = post.likesCount ?? 0;
    const next = Math.max(0, current + delta);

    const updated = await Post.findByIdAndUpdate(
      id,
      { likesCount: next },
      { new: true, projection: { likesCount: 1 } }
    ).lean();

    return json({ likesCount: updated?.likesCount ?? next });
  } catch {
    return json({ error: 'Failed to update like' }, 500);
  }
};
