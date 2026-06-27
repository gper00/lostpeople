import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Comment from '@/models/Comment';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Delete a comment. Allowed for admins (any comment) or the comment's author.
export const DELETE: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  const viewer = ctx.locals.user;
  if (!viewer) return json({ error: 'Unauthorized' }, 401);

  try {
    await connectDB();
    const comment = await Comment.findById(id);
    if (!comment) return json({ error: 'Comment not found' }, 404);

    const isAdmin = (viewer as any).role === 'admin';
    const isOwner = comment.userId?.toString() === viewer.id;
    if (!isAdmin && !isOwner) return json({ error: 'Forbidden' }, 403);

    await Comment.findByIdAndDelete(id);
    return json({ success: true });
  } catch {
    return json({ error: 'Failed to delete comment' }, 500);
  }
};

// Toggle a comment's hidden flag. Admin only.
export const PATCH: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  const viewer = ctx.locals.user;
  if (!viewer) return json({ error: 'Unauthorized' }, 401);
  if ((viewer as any).role !== 'admin') return json({ error: 'Forbidden' }, 403);

  try {
    const body = await ctx.request.json().catch(() => ({}));
    const hidden = !!body?.hidden;

    await connectDB();
    const updated = await Comment.findByIdAndUpdate(
      id,
      { hidden },
      { new: true, projection: { hidden: 1 } }
    ).lean();
    if (!updated) return json({ error: 'Comment not found' }, 404);

    return json({ hidden: updated.hidden });
  } catch {
    return json({ error: 'Failed to update comment' }, 500);
  }
};
