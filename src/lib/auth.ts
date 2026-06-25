import { betterAuth } from 'better-auth';
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
    const client = getClient();
    const db = client.db();
    _auth = betterAuth({
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
      },
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
