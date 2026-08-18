export const cloudinaryConfig = {
  // Utilise la variable d'environnement avec fallback
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ,
  folders: {
    galerie: 'galerie',
    moments: 'moments',
    mediaKit: 'mediakit',
  },
};

// URL avec fl_attachment → force le téléchargement silencieux
export const mediaKitUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/Media-Kit.pdf`;
