// lib/rate-limit-redis.ts
import { Redis } from '@upstash/redis';

// ⭐ Initialisation Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ⭐ Configuration des rate limits
export const RATE_LIMIT_CONFIGS: Record<string, { limit: number; windowSeconds: number }> = {
  'media-kit': { limit: 5, windowSeconds: 60 },
  'youtube': { limit: 5, windowSeconds: 60 },
  'media': { limit: 20, windowSeconds: 60 },
  'health': { limit: 30, windowSeconds: 60 },
  'global': { limit: 60, windowSeconds: 60 },
  'sensitive': { limit: 10, windowSeconds: 60 },
};

/**
 * Vérifie le rate limit via Redis
 */
export async function checkRateLimitRedis(
  endpoint: string,
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetMs: number }> {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.global;
  const key = `rl:${endpoint}:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  try {
    // Pipeline pour performance (1 seul appel Redis)
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart); // Supprime anciennes entrées
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` }); // Ajoute nouvelle
    pipeline.zcard(key); // Compte total
    pipeline.expire(key, config.windowSeconds); // Expire automatiquement

    const results = await pipeline.exec();
    const count = (results?.[2] as number) || 0;

    return {
      allowed: count <= config.limit,
      remaining: Math.max(0, config.limit - count),
      resetMs: config.windowSeconds * 1000,
    };
  } catch (err) {
    // ⚠️ Fail-open : si Redis tombe, on autorise la requête
    console.error('[rate-limit-redis] Error:', err);
    return {
      allowed: true,
      remaining: config.limit,
      resetMs: config.windowSeconds * 1000,
    };
  }
}

/**
 * Helper pour API routes - retourne Response 429 si bloqué
 */
export async function withRateLimitRedis(
  endpoint: string,
  ip: string
): Promise<Response | null> {
  const { allowed, remaining, resetMs } = await checkRateLimitRedis(endpoint, ip);

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(resetMs / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null;
}