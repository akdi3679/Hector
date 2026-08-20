// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

// ⭐ Configuration depuis .env (via security-config)
import { isAllowedOrigin, isValidClientKey, CLIENT_API_HEADER } from '@/lib/security-config';

// ⭐ Endpoints sensibles (rate limit strict)
const SENSITIVE_PATHS = ['/api/media-kit', '/api/youtube', '/api/health'];

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (!origin && !referer) return true;
  if (origin && isAllowedOrigin(origin)) return true;

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (isAllowedOrigin(refererUrl.origin)) return true;
    } catch {
      return false;
    }
  }

  return false;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://res.cloudinary.com https://i.ytimg.com https://yt3.ggpht.com",
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

// ⭐⭐⭐ NOM CORRECT : middleware (PAS proxy !)
export function proxy(request: NextRequest) {
  const ip = getClientIp(request);
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith('/api/');

  // ⭐ 1. Vérification de sécurité pour les APIs (UNE SEULE FOIS)
  if (isApi) {
    const origin = request.headers.get('origin');
    const clientKey = request.headers.get(CLIENT_API_HEADER);

    if (!isValidOrigin(request) || !isValidClientKey(clientKey)) {
      console.warn('[security] Request blocked', {
        ip,
        path,
        origin,
        userAgent: request.headers.get('user-agent')?.slice(0, 100),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  }

  // ⭐ 2. Rate limit (utilise la config centralisée)
  if (isApi) {
    const isSensitive = SENSITIVE_PATHS.some((p) => path.startsWith(p));
    const endpoint = isSensitive ? 'sensitive' : 'global';
    const { allowed, remaining, resetMs } = checkRateLimit(endpoint, ip);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(resetMs / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  } else {
    // Rate limit global pour le site (pages HTML)
    const { allowed } = checkRateLimit('global', ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};