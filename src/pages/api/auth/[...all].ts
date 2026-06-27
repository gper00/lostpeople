import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';

export const ALL: APIRoute = async (ctx) => {
  try {
    return await auth.handler(ctx.request);
  } catch (err: any) {
    console.error('[auth handler]', err?.message || err);
    return new Response(
      JSON.stringify({ error: 'Authentication service error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
