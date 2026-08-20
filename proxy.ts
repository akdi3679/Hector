// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⭐ Rate limit global
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = {
  windowMs: 60_000, // 1 minute
  maxRequests: 60, // 60 req/min (site a beaucoup d'assets)
};

// ⭐ Rate limit STRICT pour les endpoints sensibles
const SENSITIVE_PATHS = ['/api/media-kit', '/api/youtube'];
const SENSITIVE_LIMIT = {
  windowMs: 60_000,
  maxRequests: 10,
};

const sensitiveMap = new Map<string, { count: number; reset: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkLimit(
  map: Map<string, { count: number; reset: number }>,
  key: string,
  limit: { windowMs: number; maxRequests: number }
): boolean {
  const now = Date.now();
  const entry = map.get(key);

  if (!entry || entry.reset < now) {
    map.set(key, { count: 1, reset: now + limit.windowMs });
    return true;
  }

  if (entry.count >= limit.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// ⭐ Nettoyage périodique des Maps (évite fuite mémoire)
function cleanupMaps() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (entry.reset < now) rateLimitMap.delete(key);
  }
  for (const [key, entry] of sensitiveMap) {
    if (entry.reset < now) sensitiveMap.delete(key);
  }
}
// Nettoyage toutes les 5 minutes
setInterval(cleanupMaps, 5 * 60_000);

function addSecurityHeaders(response: NextResponse): NextResponse {
  // ⭐ Headers de base
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // ⭐ HSTS — force HTTPS pendant 1 an
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // ⭐ CSP — Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      // ⭐ Cloudinary pour les images
      "img-src 'self' data: https://res.cloudinary.com https://i.ytimg.com https://yt3.ggpht.com",
      // ⭐ YouTube pour les iframes (si utilisé)
      "frame-src 'self' https://www.youtube.com",
      "connect-src 'self' https://res.cloudinary.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  return response;
}

// ⭐⭐⭐ NOM CORRECT : middleware (pas proxy !)
export function proxy(request: NextRequest) {
  const ip = getClientIp(request);
  const path = request.nextUrl.pathname;

  // ⭐ Rate limit STRICT pour endpoints sensibles
  const isSensitive = SENSITIVE_PATHS.some((p) => path.startsWith(p));
  if (isSensitive) {
    const key = `${ip}:${path}`;
    if (!checkLimit(sensitiveMap, key, SENSITIVE_LIMIT)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }

  // ⭐ Rate limit global
  if (!checkLimit(rateLimitMap, ip, RATE_LIMIT)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes SAUF :
     * - _next/static (assets)
     * - _next/image (optimisation)
     * - favicon.ico
     * - images (png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};