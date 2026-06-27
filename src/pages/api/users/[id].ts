import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireAdminApi } from '@/lib/require-admin';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Update a user's rich profile fields (kept on the same `users` doc Better Auth
 * owns, so Post.populate() reads them). Identity/role/ban are handled by the
 * Better Auth admin API from the client; this only touches profile data.
 */
export const PUT: APIRoute = async (ctx) => {
  const denied = requireAdminApi(ctx);
  if (denied) return denied;

  try {
    const { id } = ctx.params;
    const body = await ctx.request.json();
    const { fullname, username, bio, image, socialMedia } = body;

    await connectDB();

    const update: Record<string, unknown> = {};
    if (fullname !== undefined) {
      update.fullname = fullname;
      update.name = fullname; // keep Better Auth's `name` in sync
    }
    if (username !== undefined) update.username = username || null;
    if (bio !== undefined) update.bio = bio || null;
    if (image !== undefined) update.image = image || null;
    if (socialMedia !== undefined) update.socialMedia = socialMedia;

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return json({ error: 'User not found' }, 404);
    return json(updated, 200);
  } catch (e: any) {
    if (e?.code === 11000) return json({ error: 'Username already taken' }, 409);
    return json({ error: e?.message || 'Failed to update user' }, 500);
  }
};
