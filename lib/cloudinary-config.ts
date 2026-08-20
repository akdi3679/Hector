// lib/cloudinary-config.ts

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du0frvxjo',
};

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