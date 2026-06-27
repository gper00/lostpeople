import type { APIRoute } from 'astro';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return new Response(JSON.stringify({ error: 'Email/username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    let email: string;

    if (identifier.includes('@')) {
      // Looks like an email — use directly
      email = identifier;
    } else {
      // Treat as username — look up the email
      const user = await User.findOne({ username: identifier }).lean();
      if (!user) {
        return new Response(JSON.stringify({ error: 'Invalid email/username or password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      email = user.email;
    }

    // Build a request that better-auth understands (POST /api/auth/sign-in/email)
    const signInURL = new URL('/api/auth/sign-in/email', request.url);
    const signInRequest = new Request(signInURL.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': request.headers.get('origin') || new URL(request.url).origin,
        'Host': new URL(request.url).host,
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ email, password, callbackURL: '/dashboard' }),
    });

    return auth.handler(signInRequest);
  } catch (err: any) {
    const message = err?.message || 'Login failed';
    // Better-auth throws for invalid credentials
    if (message.includes('Invalid') || message.includes('password') || message.includes('credentials')) {
      return new Response(JSON.stringify({ error: 'Invalid email/username or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
