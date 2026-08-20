// app/api/media-kit/route.ts
import { NextResponse } from 'next/server';
import { cloudinaryConfig, rawUrl } from '@/lib/cloudinary-config';

export const revalidate = 3600;

const CLOUD = cloudinaryConfig.cloudName;
const { folder, filename, downloadName } = cloudinaryConfig.mediaKit;

// ⭐ Validation du filename
const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

// ⭐ Rate limit spécifique pour media kit (plus strict)
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  // Max 5 téléchargements par minute
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many downloads. Try again in 1 minute.' },
      { status: 429 }
    );
  }

  if (!CLOUD) {
    console.error('[media-kit] CLOUD_NAME manquant');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  if (!SAFE_FILENAME.test(filename)) {
    console.error('[media-kit] Filename invalide');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const publicId = `${folder}/${filename}`;
  const pdfUrl = rawUrl(publicId);

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`[media-kit] Download failed: ${res.status}`);
      return NextResponse.json(
        { error: 'Media kit temporarily unavailable' },
        { status: 404 }
      );
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
    console.error('[media-kit] Erreur:', err);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}