/**
 * Simple in-memory sliding-window rate limiter.
 * Works per Node process (local, Docker, single-instance hosts).
 * On multi-instance serverless, pair with edge/WAF limits for full coverage.
 */

type Bucket = {
  hits: number[];
};

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(options.key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < options.windowMs);

  if (bucket.hits.length >= options.limit) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((options.windowMs - (now - oldest)) / 1000),
    );
    buckets.set(options.key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.hits.push(now);
  buckets.set(options.key, bucket);

  if (buckets.size > MAX_KEYS) {
    const overflow = buckets.size - MAX_KEYS;
    const keys = buckets.keys();
    for (let i = 0; i < overflow; i++) {
      const next = keys.next();
      if (next.done) break;
      buckets.delete(next.value);
    }
  }

  return { ok: true };
}

export function rateLimitMessage(retryAfterSec: number) {
  return `Too many attempts. Please wait ${retryAfterSec}s and try again.`;
}
