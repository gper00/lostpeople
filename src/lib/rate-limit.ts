interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, Entry>>();
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function getStore(name: string): Map<string, Entry> {
  let store = stores.get(name);
  if (store) return store;

  store = new Map();
  stores.set(name, store);

  // Single cleanup interval for all stores
  if (!cleanupTimer) {
    cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [, s] of stores) {
        for (const [key, entry] of s) {
          if (entry.resetAt <= now) s.delete(key);
        }
      }
    }, 60_000);
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
      cleanupTimer.unref();
    }
  }

  return store;
}

export function createRateLimiter(config: RateLimitConfig & { name: string }) {
  const store = getStore(config.name);

  return {
    check(key: string): { allowed: boolean; retryAfter?: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || entry.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + config.windowMs });
        return { allowed: true };
      }

      if (entry.count >= config.max) {
        return {
          allowed: false,
          retryAfter: Math.ceil((entry.resetAt - now) / 1000),
        };
      }

      entry.count++;
      return { allowed: true };
    },
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

// Pre-built limiters
export const loginLimiter = createRateLimiter({
  name: 'login',
  windowMs: 60_000,
  max: 5,
});

export const commentLimiter = createRateLimiter({
  name: 'comment',
  windowMs: 60_000,
  max: 10,
});

export const postLimiter = createRateLimiter({
  name: 'post',
  windowMs: 60_000,
  max: 10,
});
