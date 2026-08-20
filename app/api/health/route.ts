// app/api/health/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Pas de cache

export async function GET() {
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