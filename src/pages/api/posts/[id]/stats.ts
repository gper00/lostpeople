import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Live engagement counters for a post. Public.
export const GET: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  try {
    await connectDB();
    const post = await Post.findById(id).select('viewsCount likesCount').lean();
    if (!post) return json({ error: 'Post not found' }, 404);
    const commentsCount = await Comment.countDocuments({ postId: id, hidden: false });
    return json({
      viewsCount: post.viewsCount ?? 0,
      likesCount: post.likesCount ?? 0,
      commentsCount,
    });
  } catch {
    return json({ error: 'Failed to load stats' }, 500);
  }
};
