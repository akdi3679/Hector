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
  { platform: 'tiktok', value: 3.5, suffix: 'K', decimals: 1, label: 'TikTok', url: 'https://www.tiktok.com/@lavireedhector' },
];

/**
 * Formate une valeur + suffixe pour affichage (ex: 11.6 + 'K' → '11,6K')
 */
function formatStatValue(value: number, suffix: string): string {
  if (suffix === '∞') return '∞';
  const suffixLower = suffix.toLowerCase();
  if (suffixLower === 'k') {
    return `${value.toString().replace('.', ',')}K`;
  }
  if (!suffix) {
    return value.toString();
  }
  return `${value}${suffix}`;
}

/**
 * Dérivé automatiquement de socialStats — jamais à maintenir en double.
 * Exclut "youtube-total" car BrandsSection affiche déjà "3 chaînes YouTube".
 */
export const brandsAudience = socialStats
  .filter((s) => s.platform !== 'youtube-total')
  .map((s) => ({
    value: formatStatValue(s.value, s.suffix),
    label: s.label,
  }));