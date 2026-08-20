// data/media.ts

// ⭐ Toutes les images de marque
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

// ⭐ Whitelist des clés pour /api/media
export const mediaKeys = {
  hero: { folder: 'branding', name: 'hero-campement' },
  bio: { folder: 'branding', name: 'bio-sophie-marc' },
  footerOff: { folder: 'branding', name: 'hector-off' },
  footerOn: { folder: 'branding', name: 'hector-on' },
  galerie: { folder: 'galerie' },
  moments: { folder: 'moments' },
  mediaKit: { folder: 'mediakit', name: 'Media-Kit' },
} as const;

// ⭐ URL de l'API media kit
export const mediaKitUrl = '/api/media-kit';

// ⭐ Configuration du media kit
export const mediaKitConfig = {
  folder: 'mediakit',
  filename: 'Media-Kit.pdf',
  downloadName: 'La-Viree-d-Hector-Media-Kit.pdf',
};