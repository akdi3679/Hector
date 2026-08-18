import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const FOLDER = process.env.CLOUDINARY_MEDIA_KIT_FOLDER || 'mediakit';
const FILENAME = process.env.CLOUDINARY_MEDIA_KIT_FILENAME || 'Media-Kit.pdf';
const DOWNLOAD_NAME = 'La-Viree-d-Hector-Media-Kit.pdf';

export async function GET() {
  if (!CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary non configuré' }, { status: 500 });
  }

  // ⭐ URL construite dynamiquement, sans version, sans hardcoding
  const pdfUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FILENAME}`;

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'PDF introuvable' }, { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${DOWNLOAD_NAME}"`);
    headers.set('Content-Length', buffer.byteLength.toString());
    headers.set('Cache-Control', 'public, max-age=3600');
    
    return new NextResponse(buffer, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: 'Erreur de téléchargement' }, { status: 500 });
  }
}