import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const FOLDER = process.env.CLOUDINARY_MEDIA_KIT_FOLDER || '';
const FILENAME = process.env.CLOUDINARY_MEDIA_KIT_FILENAME || 'Media-Kit.pdf';
const DOWNLOAD_NAME = 'La-Viree-d-Hector-Media-Kit.pdf';

export async function GET() {
  if (!CLOUD_NAME) {
    console.error('[media-kit] CLOUD_NAME manquant');
    return NextResponse.json({ error: 'Cloudinary non configuré' }, { status: 500 });
  }

  // Construit l'URL : si FOLDER est vide, pas de folder dans l'URL
  const pdfUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${FILENAME}`;

  console.log('[media-kit] Tentative de fetch:', pdfUrl);

  try {
    const res = await fetch(pdfUrl, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      console.error('[media-kit] Cloudinary a retourné:', res.status, res.statusText);
      
      // Si 404, essaie avec resource_type "raw" au lieu de "image"
      if (res.status === 404) {
        const rawUrl = pdfUrl.replace('/image/upload/', '/raw/upload/');
        console.log('[media-kit] Retry avec raw:', rawUrl);
        
        const rawRes = await fetch(rawUrl, { next: { revalidate: 3600 } });
        if (rawRes.ok) {
          return servePdf(rawRes);
        }
      }
      
      return NextResponse.json({ 
        error: `PDF introuvable (${res.status})`,
        url: pdfUrl 
      }, { status: 404 });
    }

    return servePdf(res);
  } catch (err) {
    console.error('[media-kit] Erreur:', err);
    return NextResponse.json({ error: 'Erreur de téléchargement' }, { status: 500 });
  }
}

async function servePdf(res: Response) {
  const buffer = await res.arrayBuffer();
  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition', `attachment; filename="${DOWNLOAD_NAME}"`);
  headers.set('Content-Length', buffer.byteLength.toString());
  headers.set('Cache-Control', 'public, max-age=3600');
  
  return new NextResponse(buffer, { status: 200, headers });
}