import type { APIRoute } from 'astro';
import { auth } from '@/lib/auth';

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
    const formData = await ctx.request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return new Response(JSON.stringify({ error: 'Cloudinary not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: result.error?.message || 'Upload failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: result.secure_url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
