import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import '@/models/User';
import type { CommentView } from '@/types/comment';
import { commentLimiter, getClientIp } from '@/lib/rate-limit';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function toView(c: any, viewer: { id: string; role?: string } | null): CommentView {
  const author = c.userId && typeof c.userId === 'object' ? c.userId : null;
  const isAdmin = viewer?.role === 'admin';
  const isOwner = !!author && !!viewer && author._id?.toString() === viewer.id;
  return {
    _id: c._id.toString(),
    authorName: author
      ? author.fullname || author.username || 'User'
      : c.guestName || 'Guest',
    authorImage: author?.image || null,
    isRegistered: !!author,
    content: c.content,
    hidden: !!c.hidden,
    canDelete: isAdmin || isOwner,
    createdAt: new Date(c.createdAt).toISOString(),
  };
}

// List comments for a post.
// Public viewers get only visible comments; admins also get hidden ones
// (flagged so the UI can show an "unhide" control).
export const GET: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  const viewer = ctx.locals.user
    ? { id: ctx.locals.user.id, role: (ctx.locals.user as any).role }
    : null;
  const isAdmin = viewer?.role === 'admin';

  try {
    await connectDB();
    const query: Record<string, unknown> = { postId: id };
    if (!isAdmin) query.hidden = false;

    const comments = await Comment.find(query)
      .populate('userId', 'fullname username image')
      .sort({ createdAt: -1 })
      .lean();

    return json({ comments: comments.map((c) => toView(c, viewer)) });
  } catch {
    return json({ error: 'Failed to load comments' }, 500);
  }
};

// Create a comment. Logged-in users are attached via session; guests must
// supply a name. No moderation — comments appear immediately.
export const POST: APIRoute = async (ctx) => {
  const { id } = ctx.params;
  const viewer = ctx.locals.user;

  const ip = getClientIp(ctx.request);
  const rl = commentLimiter.check(ip);
  if (!rl.allowed) {
    return json({ error: 'Too many comments. Please wait before posting again.' }, 429);
  }

  try {
    const body = await ctx.request.json().catch(() => ({}));
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const guestName = typeof body?.guestName === 'string' ? body.guestName.trim() : '';

    if (!content) return json({ error: 'Comment cannot be empty' }, 400);
    if (content.length > 2000) return json({ error: 'Comment is too long' }, 400);
    if (!viewer && !guestName) return json({ error: 'Name is required' }, 400);
    if (!viewer && guestName.length > 60) return json({ error: 'Name must not exceed 60 characters' }, 400);

    // Anti-bot: timestamp must be present, at least 3s old, and not from the future
    const elapsed = typeof body._t === 'number' ? Date.now() - body._t : -1;
    if (elapsed < 3000) return json({ error: 'Comment posted too quickly. Please wait a moment.' }, 400);
    if (elapsed > 3_600_000) return json({ error: 'Comment form expired. Please refresh and try again.' }, 400);

    await connectDB();
    const post = await Post.findById(id).select('_id').lean();
    if (!post) return json({ error: 'Post not found' }, 404);

    const created = await Comment.create({
      postId: id,
      userId: viewer ? viewer.id : null,
      guestName: viewer ? null : guestName,
      content,
    });

    const populated = await Comment.findById(created._id)
      .populate('userId', 'fullname username image')
      .lean();

    const v = viewer ? { id: viewer.id, role: (viewer as any).role } : null;
    return json({ comment: toView(populated, v) }, 201);
  } catch {
    return json({ error: 'Failed to post comment' }, 500);
  }
};
