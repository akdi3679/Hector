import { NextResponse } from 'next/server';

export const revalidate = 600;
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

async function list(type: 'image' | 'video', prefix: string, cursor: string) {
  const p = new URLSearchParams({ prefix, max_results: '20' });
  if (cursor) p.set('next_cursor', cursor);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/${type}/upload?${p}`, {
    headers: { Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}` },
    next: { revalidate: 600 },
  });
  if (!r.ok) return { resources: [], next_cursor: undefined };
  return r.json();
}

export async function GET(req: Request) {
  if (!CLOUD || !KEY || !SECRET) return NextResponse.json({ items: [], next: null });
  const q = new URL(req.url).searchParams;
  const folder = q.get('folder') ?? 'hector/galerie';
  const ci = q.get('ci') ?? '';
  const cv = q.get('cv') ?? '';

  const [img, vid] = await Promise.all([
    list('image', folder, ci),
    list('video', folder, cv),
  ]);

  const items = [
    ...img.resources.map((r: any) => ({ id: r.public_id, url: r.secure_url, type: r.format === 'gif' ? 'gif' : 'image', created: r.created_at })),
    ...vid.resources.map((r: any) => ({ id: r.public_id, url: r.secure_url, type: 'video', created: r.created_at })),
  ].sort((a, b) => +new Date(b.created) - +new Date(a.created)).slice(0, 20);

  const next = (img.next_cursor || vid.next_cursor) ? { ci: img.next_cursor ?? '', cv: vid.next_cursor ?? '' } : null;
  return NextResponse.json({ items, next });
}