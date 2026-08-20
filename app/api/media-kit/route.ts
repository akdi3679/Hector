// app/api/media-kit/route.ts
import { NextResponse } from 'next/server';
import { cloudinaryConfig } from '@/lib/cloudinary-config';
import { mediaKitConfig } from '@/data/media';
import { z } from 'zod';
import { withRateLimitRedis } from '@/lib/rate-limit-redis';

export const revalidate = 3600;

const CLOUD = cloudinaryConfig.cloudName;
const { filename, downloadName } = mediaKitConfig;
const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;
const FILENAME_SCHEMA = z.string()
  .regex(/^[a-zA-Z0-9._-]{1,100}$/, 'Invalid filename')
  .max(100);


export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
 const blocked = await withRateLimitRedis('media-kit', ip);
if (blocked) return blocked;
  if (!CLOUD) {
    return NextResponse.json({ error: 'config_error' }, { status: 500 });
  }
  try {
  FILENAME_SCHEMA.parse(filename);
} catch {
  return NextResponse.json({ error: 'config_error' }, { status: 500 });
}

  if (!SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'config_error' }, { status: 500 });
  }

  // ⭐⭐⭐ DYNAMIC FOLDER MODE : filename SEUL (pas de folder dans l'URL)
  const pdfUrl = `https://res.cloudinary.com/${CLOUD}/image/upload/${filename}`;

  console.log('[media-kit] Fetching:', pdfUrl);

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`[media-kit] Failed: ${res.status}`, { url: pdfUrl });
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