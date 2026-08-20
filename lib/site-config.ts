// lib/site-config.ts
function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (url) return url;
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL is required in production. ' +
      'Please set it in Vercel environment variables.'
    );
  }
  
  return 'http://localhost:3000';
}

export const siteConfig = {
  url: getSiteUrl(),
  name: 'La Virée d\'Hector',
  tagline: 'It\'s time to go.',
};
// Helper pour construire les URLs absolues
export const absoluteUrl = (path: string = '') => 
  `${siteConfig.url}${path}`;