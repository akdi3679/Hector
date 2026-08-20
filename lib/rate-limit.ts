// lib/rate-limit-local.ts

interface RateLimitEntry {
  count: number;
  reset: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

// ⭐ Configuration centralisée de tous les rate limits
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // APIs
  'media-kit': { limit: 5, windowMs: 60_000 },
  'youtube': { limit: 5, windowMs: 60_000 },
  'media': { limit: 20, windowMs: 60_000 },
  'health': { limit: 30, windowMs: 60_000 },
  
  // Site global (par IP)
  'global': { limit: 60, windowMs: 60_000 },
  
  // Endpoints sensibles (middleware)
  'sensitive': { limit: 10, windowMs: 60_000 },
};

// ⭐ Cache global : une Map par endpoint
const rateLimitMaps = new Map<string, Map<string, RateLimitEntry>>();

// ⭐ Nettoyage intelligent (ne pas boucler sur toutes les entrées à chaque fois)
function cleanupMap(map: Map<string, RateLimitEntry>): void {
  const now = Date.now();
  if (map.size > 1000) {
    // Nettoyage complet seulement si beaucoup d'entrées
    for (const [key, entry] of map) {
      if (entry.reset < now) map.delete(key);
    }
  }
}

/**
 * Vérifie le rate limit pour un endpoint donné
 * @returns { allowed: boolean, remaining: number, resetMs: number }
 */
export function checkRateLimit(
  endpoint: keyof typeof RATE_LIMIT_CONFIGS | string,
  ip: string
): { allowed: boolean; remaining: number; resetMs: number } {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.global;
  
  // Récupérer ou créer la Map pour cet endpoint
  if (!rateLimitMaps.has(endpoint)) {
    rateLimitMaps.set(endpoint, new Map());
  }
  const map = rateLimitMaps.get(endpoint)!;
  
  // Nettoyage si besoin
  cleanupMap(map);
  
  const now = Date.now();
  const entry = map.get(ip);
  
  // Première requête ou fenêtre expirée
  if (!entry || entry.reset < now) {
    map.set(ip, { count: 1, reset: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetMs: config.windowMs,
    };
  }
  
  // Limite atteinte
  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: entry.reset - now,
    };
  }
  
  // Incrémenter
  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetMs: entry.reset - now,
  };
}

/**
 * Helper pour API routes - retourne Response 429 si bloqué
 */
export function withRateLimit(
  endpoint: string,
  ip: string
): Response | null {
  const { allowed, remaining, resetMs } = checkRateLimit(endpoint, ip);
  
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(resetMs / 1000)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor((Date.now() + resetMs) / 1000)),
        },
      }
    );
  }
  
  return null; // Pas de blocage
}