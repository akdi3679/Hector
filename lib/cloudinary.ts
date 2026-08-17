const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

interface Opts { w?: number; h?: number; ar?: string; crop?: 'fill' | 'limit' | 'thumb'; }

export function cdn(publicId: string, { w = 1200, h, ar, crop = 'fill' }: Opts = {}): string {
  const t = ['f_auto', 'q_auto', `w_${w}`, `c_${crop}`, h ? `h_${h}` : '', ar ? `ar_${ar}` : '']
    .filter(Boolean).join(',');
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}/${publicId}`;
}