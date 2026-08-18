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
export const mediaKitUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/fl_attachment:La-Viree-d-Hector-Media-Kit/${cloudinaryConfig.folders.mediaKit}/Media-Kit.pdf`;