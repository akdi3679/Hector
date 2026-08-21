// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CLIENT_API_HEADER, isAllowedOrigin, isValidClientKey } from '@/lib/security-config';

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

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith('/api/');

  // ⭐ Only protection: custom header on API requests
  if (isApi) {
    const origin = request.headers.get('origin');
    const clientKey = request.headers.get(CLIENT_API_HEADER);

    if (!isAllowedOrigin(origin) || !isValidClientKey(clientKey)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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