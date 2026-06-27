import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

let _client: MongoClient | null = null;
let _auth: ReturnType<typeof betterAuth> | null = null;

function getClient() {
  if (!_client) {
    const uri = import.meta.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI is not set');
    _client = new MongoClient(uri);
  }
  return _client;
}

function getAuth() {
  if (!_auth) {
    if (!import.meta.env.BETTER_AUTH_SECRET) {
      throw new Error('BETTER_AUTH_SECRET env var is not set');
    }
    const client = getClient();
    const db = client.db();
    _auth = betterAuth({
      appName: 'Lostpeople',
      secret: import.meta.env.BETTER_AUTH_SECRET,
      baseURL:
        import.meta.env.BETTER_AUTH_URL ||
        (import.meta.env.VERCEL_URL && `https://${import.meta.env.VERCEL_URL}`) ||
        undefined,
      trustedOrigins: [
        'https://nyobanulis.vercel.app',
        'https://*.vercel.app',
        'http://localhost:*',
      ],
      database: mongodbAdapter(db, { client }),
      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60,
        },
        modelName: 'sessions',
      },
      user: {
        modelName: 'users',
        // Profile fields kept on the same user doc so Post.populate() reads them.
        // socialMedia (nested) is handled via the Mongoose profile API, not here.
        additionalFields: {
          fullname: { type: 'string', required: false, input: true },
          username: { type: 'string', required: false, input: true },
          bio: { type: 'string', required: false, input: true },
        },
      },
      plugins: [
        admin({
          defaultRole: 'user',
          adminRoles: ['admin'],
        }),
      ],
    });
  }
  return _auth;
}

// Proxy so `auth.api.getSession(...)` works without explicit getAuth() call
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_target, prop, receiver) {
    const instance = getAuth();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});
