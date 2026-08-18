import { NextResponse } from 'next/server';
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  created_at: string;
}

export const revalidate = 600;
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

const ALLOWED_FOLDERS = new Set([
  'hector/galerie', 'hector/moments',
  'galerie', 'moments',
]);

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

async function searchFolder(folder: string, cursor?: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // ⭐ Syntaxe correcte : folder:value (avec deux-points + guillemets pour valeur)
    // resource_type:image OR resource_type:video pour filtrer les deux types
    const expression = `folder:"${folder}" AND (resource_type:image OR resource_type:video)`;
    
    const body = JSON.stringify({
      expression,
      max_results: 20,
      sort_by: [{ created_at: 'desc' }],
      ...(cursor ? { next_cursor: cursor } : {}),
    });

    // ⭐ Search API utilise POST, pas GET
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${KEY}:${SECRET}`)}`,
        'Content-Type': 'application/json',
      },
      body,
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error(`[media] Search failed: ${r.status}`, errText);
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

  const result = await searchFolder(folder, cursor);

  
const items = (result.resources ?? []).map((r: CloudinaryResource) => ({
  id: r.public_id,
  url: r.secure_url,
  type: r.resource_type === 'video' ? 'video' : (r.format === 'gif' ? 'gif' : 'image'),
  created: r.created_at,
}));
  const next = result.next_cursor ? { cursor: result.next_cursor } : null;

  return NextResponse.json({ items, next });
}


