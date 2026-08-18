export interface SocialStat {
  platform: string;
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  url: string;
}

export const socialStats: SocialStat[] = [
  { platform: 'youtube', value: 3, suffix: '', decimals: 0, label: 'chaînes YouTube', url: 'https://www.youtube.com/@lavireedhector' },
  { platform: 'youtube-total', value: 222000, suffix: '', decimals: 0, label: 'abonnés YouTube cumulés', url: 'https://www.youtube.com/@lavireedhector' },
  { platform: 'instagram', value: 11.6, suffix: 'K', decimals: 1, label: 'abonnés Instagram', url: 'https://www.instagram.com/lavireedhector/' },
  { platform: 'facebook', value: 7.5, suffix: 'K', decimals: 1, label: 'abonnés Facebook', url: 'https://www.facebook.com/lavireedhector/' },
  { platform: 'tiktok', value: 0, suffix: '∞', decimals: 0, label: 'TikTok', url: 'https://www.tiktok.com/@lavireedhector' },
];

// Pour BrandsSection (affichage simplifié)
export const brandsAudience = [
  { value: '3', label: 'chaînes YouTube' },
  { value: '11,6K', label: 'Instagram' },
  { value: '7,5K', label: 'Facebook' },
  { value: '∞', label: 'TikTok' },
];