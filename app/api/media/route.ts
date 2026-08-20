// app/api/media/route.ts
import { NextResponse } from 'next/server';
import { cloudinaryConfig } from '@/lib/cloudinary-config';

export const revalidate = 3600;

const CLOUD = cloudinaryConfig.cloudName;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐ Whitelist des clés autorisées (source unique de vérité)
const MEDIA_KEYS = cloudinaryConfig.mediaKeys;

// Rate limit
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!KEY || !SECRET) {
    console.error('[media] Missing Cloudinary credentials');
    return NextResponse.json({ images: {} });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  // ⭐ Validation stricte de la clé
  if (!key || !(key in MEDIA_KEYS)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  const config = MEDIA_KEYS[key as keyof typeof MEDIA_KEYS];
  const { folder, name } = config;

  try {
    // ⭐ Construction de l'expression Cloudinary
    let expression = `folder:"${folder}" AND resource_type:image`;
    if (name) {
      expression += ` AND filename:"${name}"`;
    }

    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression, max_results: 100 }),
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error(`[media] Search failed: ${r.status}`, errText);
      return NextResponse.json({ images: {} });
    }

    const data = await r.json();
    const images: Record<string, string> = {};

    for (const res of data.resources ?? []) {
      const imageName = res.filename || res.public_id;
      images[imageName] = res.secure_url;
    }

    return NextResponse.json({ images });
  } catch (err) {
    console.error('[media] Search error:', err);
    return NextResponse.json({ images: {} });
  }
}