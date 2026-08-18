import { NextResponse } from 'next/server';

export const revalidate = 600;
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

// ⭐ Whitelist étendue (accepte les 2 formes)
const ALLOWED_FOLDERS = new Set([
  'hector/galerie', 'hector/moments',
  'galerie', 'moments',
]);

// ⭐ Rate limiting
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

/**
 * Utilise Cloudinary SEARCH API (pas la liste par prefix)
 * Fonctionne avec dynamic folder mode ✅
 */
async function searchFolder(folder: string, cursor?: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // Expression : folder=galerie (marche en dynamic folder mode)
    const expression = `folder=${folder}`;
    const p = new URLSearchParams({
      expression,
      max_results: '20',
      sort_by: 'created_at:desc',
    });
    if (cursor) p.set('next_cursor', cursor);

    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search?${p}`, {
      headers: { Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (!r.ok) {
      console.error('[media] Search failed:', r.status);
      return { resources: [], next_cursor: undefined };
    }
    return r.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error('[media] Search error:', err);
    return { resources: [], next_cursor: undefined };
  }
}

export async function GET(req: Request) {
  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!CLOUD || !KEY || !SECRET) {
    console.error('[media] Missing credentials');
    return NextResponse.json({ items: [], next: null });
  }
  
  const q = new URL(req.url).searchParams;
  const folder = q.get('folder') ?? 'galerie';
  const cursor = q.get('cursor') ?? '';

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  if (cursor && !/^[\w-]*$/.test(cursor)) {
    return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 });
  }

  // ⭐ Un seul appel (Search API retourne images + vidéos mélangées)
  const result = await searchFolder(folder, cursor);

  const items = (result.resources ?? []).map((r: any) => ({
    id: r.public_id,
    url: r.secure_url,
    type: r.resource_type === 'video' ? 'video' : (r.format === 'gif' ? 'gif' : 'image'),
    created: r.created_at,
  }));

  const next = result.next_cursor ? { cursor: result.next_cursor } : null;

  return NextResponse.json({ items, next });
}