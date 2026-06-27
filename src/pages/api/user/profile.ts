import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const PATCH: APIRoute = async (ctx) => {
  const viewer = ctx.locals.user;
  if (!viewer) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await ctx.request.json();
    const { fullname, username, bio, image, socialMedia } = body;

    await connectDB();

    const update: Record<string, unknown> = {};
    if (fullname !== undefined) {
      if (typeof fullname !== 'string' || fullname.trim().length < 5) {
        return json({ error: 'Fullname must be at least 5 characters' }, 400);
      }
      update.fullname = fullname.trim();
      update.name = fullname.trim();
    }
    if (username !== undefined) {
      const u = typeof username === 'string' ? username.trim() : '';
      if (u && (u.length > 25 || !/^[a-zA-Z0-9_-]+$/.test(u))) {
        return json({ error: 'Username must be 1-25 characters (letters, numbers, hyphens, underscores)' }, 400);
      }
      update.username = u || null;
    }
    if (bio !== undefined) {
      const b = typeof bio === 'string' ? bio.trim() : '';
      if (b.length > 400) return json({ error: 'Bio must not exceed 400 characters' }, 400);
      update.bio = b || null;
    }
    if (image !== undefined) {
      if (image && typeof image === 'string') {
        try { new URL(image); } catch { return json({ error: 'Avatar must be a valid URL' }, 400); }
      }
      update.image = image || null;
    }
    if (socialMedia !== undefined) {
      if (typeof socialMedia !== 'object' || Array.isArray(socialMedia)) {
        return json({ error: 'Invalid social media data' }, 400);
      }
      const sm: Record<string, string | null> = {};
      for (const key of ['facebook', 'instagram', 'twitter', 'whatsapp', 'telegram']) {
        const val = socialMedia[key];
        const trimmed = typeof val === 'string' ? val.trim() : '';
        if (trimmed) {
          try { new URL(trimmed); } catch { return json({ error: `${key} must be a valid URL` }, 400); }
        }
        sm[key] = trimmed.slice(0, 150) || null;
      }
      update.socialMedia = sm;
    }

    if (Object.keys(update).length === 0) {
      return json({ error: 'No valid fields to update' }, 400);
    }

    const updated = await User.findByIdAndUpdate(
      viewer.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return json({ error: 'User not found' }, 404);

    // Strip sensitive fields
    const { password, ...safe } = updated;
    return json(safe);
  } catch (e: any) {
    if (e?.code === 11000) return json({ error: 'Username already taken' }, 409);
    return json({ error: e?.message || 'Failed to update profile' }, 500);
  }
};
