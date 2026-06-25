import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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

  return next();
});
