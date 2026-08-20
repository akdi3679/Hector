// app/api/media-kit/route.ts
import { NextResponse } from 'next/server';
import { cloudinaryConfig } from '@/lib/cloudinary-config';

export const revalidate = 3600;

const CLOUD = cloudinaryConfig.cloudName;
const { folder, filename, downloadName } = cloudinaryConfig.mediaKit;

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

// ⭐ Rate limit spécifique (5/min)
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'too_many_requests' },
      { status: 429 }
    );
  }

  if (!CLOUD) {
    return NextResponse.json({ error: 'config_error' }, { status: 500 });
  }

  if (!SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'config_error' }, { status: 500 });
  }

  // ⭐ /image/upload/ sert les PDFs correctement (Cloudinary gère auto)
  const publicId = `${folder}/${filename}`;
  const pdfUrl = `https://res.cloudinary.com/${CLOUD}/image/upload/${publicId}`;

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`[media-kit] Download failed: ${res.status}`);
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${downloadName}"`);
    headers.set('Content-Length', buffer.byteLength.toString());
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('X-Content-Type-Options', 'nosniff');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (err) {
    console.error('[media-kit] Error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}