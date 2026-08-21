// app/api/media/route.ts — En haut du fichier
import { NextResponse } from 'next/server';
import { cloudinaryConfig } from '@/lib/cloudinary-config';
import { mediaKeys } from '@/data/media';
import { z } from 'zod';
import { withRateLimitRedis } from '@/lib/rate-limit-redis';

// ⭐ Retry helper pour résilience
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 2
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // Réessayer seulement sur erreurs 5xx (serveur)
      if (response.ok || response.status < 500) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err as Error;
    }
    
    if (attempt < maxRetries) {
      // Backoff exponentiel : 500ms, 1000ms
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  
  throw lastError || new Error('Fetch failed');
}

export const revalidate = 3600;

const CLOUD = cloudinaryConfig.cloudName;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐ Whitelist des clés autorisées (source unique de vérité)
const MEDIA_KEYS = mediaKeys;
const MEDIA_KEY_SCHEMA = z.string()
  .regex(/^[a-zA-Z0-9_-]{1,50}$/, 'Invalid key format')
  .max(50);


export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  
  
  if (!KEY || !SECRET) {
    console.error('[media] Missing Cloudinary credentials');
    return NextResponse.json({ images: {} });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
try {
  MEDIA_KEY_SCHEMA.parse(key);
} catch {
  return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
}
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

    // ⭐ Compatible Edge + Node runtimes
const authHeader = 'Basic ' + Buffer.from(`${KEY}:${SECRET}`).toString('base64');

const r = await fetchWithRetry(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
  method: 'POST',
  headers: {
    Authorization: authHeader,
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


    const response = NextResponse.json({ images });
response.headers.set('Cache-Control', 'public, max-age=3600');
return response;
  } catch (err) {
    console.error('[media] Search error:', err);
    return NextResponse.json({ images: {} });
  }
}