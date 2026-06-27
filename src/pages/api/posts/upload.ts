import type { APIRoute } from 'astro';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { postLimiter, getClientIp } from '@/lib/rate-limit';

const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async (ctx) => {
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session) return json({ error: 'Unauthorized' }, 401);

  const rl = postLimiter.check(getClientIp(ctx.request));
  if (!rl.allowed) {
    return json({ error: 'Too many uploads. Please wait.' }, 429);
  }

  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return json({ error: 'Cloudinary not configured' }, 500);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const formData = await ctx.request.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) return json({ error: 'No file provided' }, 400);

    // --- Validate image type ---
    if (!ALLOWED_MIMES.includes(file.type)) {
      const allowed = ALLOWED_MIMES.map((m) => m.split('/')[1].toUpperCase()).join(', ');
      return json({ error: `Invalid file type. Allowed: ${allowed}` }, 400);
    }

    // --- Validate file size ---
    if (file.size > MAX_SIZE) {
      const mb = (MAX_SIZE / (1024 * 1024)).toFixed(0);
      return json({ error: `File too large. Maximum size: ${mb} MB` }, 400);
    }

    // Signed server-side upload — no upload preset required.
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'lostpeople',
      resource_type: 'image',
    });

    return json({ url: result.secure_url });
  } catch (error: any) {
    return json({ error: error?.message || 'Upload failed' }, 500);
  }
};
