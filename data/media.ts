// data/media.ts
// ⭐ Interface explicite avec name optionnel
export interface MediaKeyConfig {
  folder: string;
  name?: string;
}
// ⭐ Toutes les images de marque du site
export const brandImages = {
  hero: {
    publicId: 'hero-campement',
    alt: 'Un camion aménagé au campement, le soir',
  },
  bio: {
    publicId: 'bio-sophie-marc',
    alt: 'Sophie et Jean-Marc, le couple derrière La Virée d\'Hector',
  },
  footerOff: {
    publicId: 'hector-off',
    alt: '',
  },
  footerOn: {
    publicId: 'hector-on',
    alt: '',
  },
};


// ⭐ Clés pour /api/media (whitelist) — typé explicitement
export const mediaKeys: Record<string, MediaKeyConfig> = {
  hero: { folder: 'branding', name: 'hero-campement' },
  bio: { folder: 'branding', name: 'bio-sophie-marc' },
  footerOff: { folder: 'branding', name: 'hector-off' },
  footerOn: { folder: 'branding', name: 'hector-on' },
  galerie: { folder: 'galerie' },
  moments: { folder: 'moments' },
  mediaKit: { folder: 'mediakit', name: 'Media-Kit' },
};

// ⭐ Clés pour les galeries dynamiques (utilisées par MediaStrip)
export const galleryKeys = {
  galerie: 'galerie',
  moments: 'moments',
} as const;

// ⭐ URL de l'API media kit
export const mediaKitUrl = '/api/media-kit';

// ⭐ Configuration du media kit
export const mediaKitConfig = {
  folder: 'mediakit',
  filename: 'Media-Kit.pdf',
  downloadName: 'La-Viree-d-Hector-Media-Kit.pdf',
};