import type { APIContext } from 'astro';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Page guard: returns a redirect Response if the visitor is not an admin
 * (null when allowed). Usage:
 *   const denied = requireAdminPage(Astro);
 *   if (denied) return denied;
 */
export function requireAdminPage(ctx: APIContext): Response | null {
  const user = ctx.locals.user;
  if (!user) return ctx.redirect('/login');
  if (user.role !== 'admin') return ctx.redirect('/dashboard');
  return null;
}

/**
 * API guard: returns a JSON 401/403 Response if the caller is not an admin
 * (null when allowed).
 */
export function requireAdminApi(ctx: APIContext): Response | null {
  const user = ctx.locals.user;
  if (!user) return json({ error: 'Unauthorized' }, 401);
  if (user.role !== 'admin') return json({ error: 'Forbidden' }, 403);
  return null;
}
