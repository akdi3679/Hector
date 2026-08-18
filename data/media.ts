export const cloudinaryConfig = {
  cloudName: 'du0frvxjo',
  folders: {
    galerie: 'galerie',
    moments: 'moments',
    mediaKit: 'mediakit',
  },
};

export const mediaKitUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/v1766226030/${cloudinaryConfig.folders.mediaKit}/Media-Kit.pdf`;

// URLs pour galerie et moments seront chargées dynamiquement via /api/media