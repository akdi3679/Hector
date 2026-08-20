// lib/cloudinary-config.ts
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo',
  
  // ⭐ Tous les folders au même endroit
  folders: {
    branding: 'branding',
    galerie: 'galerie',
    moments: 'moments',
    mediaKit: 'mediakit',
    siteImg: 'site-img',
  },
  
  // ⭐ Media kit centralisé
  mediaKit: {
    folder: 'mediakit',
    filename: 'Media-Kit.pdf',
    downloadName: 'La-Viree-d-Hector-Media-Kit.pdf',
  },
  
  // ⭐ Clés sémantiques → résolution serveur
  mediaKeys: {
    // Branding
    hero: { folder: 'branding', name: 'hero-campement' },
    bio: { folder: 'branding', name: 'bio-sophie-marc' },
    footerOff: { folder: 'branding', name: 'hector-off' },
    footerOn: { folder: 'branding', name: 'hector-on' },
    
    // Groupes (toutes les images du folder)
    galerie: { folder: 'galerie' },
    moments: { folder: 'moments' },
    
    // Media kit
    mediaKit: { folder: 'mediakit', name: 'Media-Kit' },
  },
};

// ⭐ Helper pour construire les URLs Cloudinary
interface Opts {
  w?: number;
  h?: number;
  ar?: string;
  crop?: 'fill' | 'limit' | 'thumb' | 'scale';
  q?: 'auto' | 'eco' | number;
}

export function cdn(publicId: string, opts: Opts = {}): string {
  const { w = 1200, h, ar, crop = 'fill', q = 'auto' } = opts;
  const transforms = [
    'f_auto',
    `q_${q}`,
    `c_${crop}`,
    `w_${w}`,
    h ? `h_${h}` : '',
    ar ? `ar_${ar}` : '',
  ].filter(Boolean).join(',');
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transforms}/${publicId}`;
}

export function rawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/${publicId}`;
}