
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // ⭐ NOUVEAU : Rate limit (30/min)
  const blocked = withRateLimit('health', ip);
  if (blocked) return blocked;

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    environment: process.env.VERCEL_ENV || 'development',
    checks: {
      cloudinary: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      youtube: !!process.env.YOUTUBE_API_KEY,
    },
  });
}