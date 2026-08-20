// lib/cloudinary-config.ts

// ⭐ Interface explicite avec name optionnel
export interface MediaKeyConfig {
  folder: string;
  name?: string; // ⭐ optionnel
}
// lib/cloudinary-config.ts — Ajoute ce helper en bas du fichier

// ⭐ Helper pour récupérer le publicId d'une clé avec fallback sécurisé
export function getPublicId(key: string): string {
  const config = cloudinaryConfig.mediaKeys[key];
  if (!config) {
    console.warn(`[cloudinary] Unknown media key: ${key}`);
    return '';
  }
  return config.name || '';
}
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo',

  folders: {
    branding: 'branding',
    galerie: 'galerie',
    moments: 'moments',
    mediaKit: 'mediakit',
    siteImg: 'site-img',
  },

  mediaKit: {
    folder: 'mediakit',
    filename: 'Media-Kit.pdf',
    downloadName: 'La-Viree-d-Hector-Media-Kit.pdf',
  },

  // ⭐⭐⭐ Typé explicitement comme Record<string, MediaKeyConfig>
  mediaKeys: {
    hero: { folder: 'branding', name: 'hero-campement' },
    bio: { folder: 'branding', name: 'bio-sophie-marc' },
    footerOff: { folder: 'branding', name: 'hector-off' },
    footerOn: { folder: 'branding', name: 'hector-on' },
    galerie: { folder: 'galerie' },
    moments: { folder: 'moments' },
    mediaKit: { folder: 'mediakit', name: 'Media-Kit' },
  } as Record<string, MediaKeyConfig>, // ⭐ Cast explicite
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