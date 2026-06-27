import { defineMiddleware } from 'astro:middleware';
import { loginLimiter, getClientIp } from '@/lib/rate-limit';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function applySecurityHeaders(response: Response): Response {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // ---- Auth session ----
  try {
    const { auth } = await import('@/lib/auth');
    const isAuthed = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (isAuthed) {
      context.locals.user = isAuthed.user;
      context.locals.session = isAuthed.session;
    } else {
      context.locals.user = null;
      context.locals.session = null;
    }
  } catch {
    context.locals.user = null;
    context.locals.session = null;
  }

  // ---- Rate limit: login ----
  const url = new URL(context.request.url);
  if (
    context.request.method === 'POST' &&
    (url.pathname === '/api/auth/login-identifier' || url.pathname === '/api/auth/sign-in/email')
  ) {
    const ip = getClientIp(context.request);
    const result = loginLimiter.check(ip);
    if (!result.allowed) {
      return applySecurityHeaders(
        new Response(
          JSON.stringify({ error: 'Too many login attempts. Try again later.' }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': String(result.retryAfter ?? 60) },
          },
        ),
      );
    }
  }

  // ---- Proceed ----
  const response = await next();
  return applySecurityHeaders(response);
});
