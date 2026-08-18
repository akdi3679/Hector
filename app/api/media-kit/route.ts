import { NextResponse } from 'next/server';

export const revalidate = 3600; // ⭐ Cache route activé

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const FOLDER = process.env.CLOUDINARY_MEDIA_KIT_FOLDER || '';
const FILENAME = process.env.CLOUDINARY_MEDIA_KIT_FILENAME || 'Media-Kit.pdf';
const DOWNLOAD_NAME = 'La-Viree-d-Hector-Media-Kit.pdf';
const CLOUD = process.env.NEXT_PUBLIC_CLOUD
// ⭐ Validation du filename (pas de /, .., ou caractères spéciaux)
const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

export async function GET() {
  if (!CLOUD_NAME) {
    console.error('[media-kit] CLOUD_NAME manquant');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }
  
  if (!SAFE_FILENAME.test(FILENAME)) {
    console.error('[media-kit] Filename invalide');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const pdfUrl = FOLDER && SAFE_FILENAME.test(FOLDER)
    ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FOLDER}/${FILENAME}`
    : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FILENAME}`;

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      if (res.status === 404) {
        const rawUrl = pdfUrl.replace('/image/upload/', '/raw/upload/');
        const rawRes = await fetch(rawUrl, { next: { revalidate: 3600 } });
        if (rawRes.ok) return servePdf(rawRes);
      }
      // ⭐ Ne pas exposer l'URL
      return NextResponse.json({ error: 'Media kit temporarily unavailable' }, { status: 404 });
    }

    return servePdf(res);
  } catch (err) {
    console.error('[media-kit] Erreur:', err);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

async function servePdf(res: Response) {
  const buffer = await res.arrayBuffer();
  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', `attachment; filename="${DOWNLOAD_NAME}"`);
  headers.set('Content-Length', buffer.byteLength.toString());
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('X-Content-Type-Options', 'nosniff'); // ⭐ Sécurité
  return new NextResponse(buffer, { status: 200, headers });
}