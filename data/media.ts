
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ,
  folders: {
    branding: 'branding',
    galerie: 'galerie',
    moments: 'moments',
    mediaKit: 'mediakit',
  },
};

//  Toutes les images fixes dans hector/branding
export const brandImages = {
  hero: {
    publicId: 'branding/hero-campement',
    alt: 'Un camion aménagé au campement, le soir',
  },
  bio: {
    publicId: 'branding/bio-sophie-marc',
    alt: 'Sophie et Jean-Marc, le couple derrière La Virée d\'Hector',
  },
  footerOff: {
    publicId: 'branding/hector-off',
    alt: '',
  },
  footerOn: {
    publicId: 'branding/hector-on',
    alt: '',
  },
};

export const mediaKitUrl = '/api/media-kit';