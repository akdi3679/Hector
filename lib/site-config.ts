// lib/site-config.ts
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lavireedhector.fr',
  name: 'La Virée d\'Hector',
  tagline: 'It\'s time to go.',
};

// Helper pour construire les URLs absolues
export const absoluteUrl = (path: string = '') => 
  `${siteConfig.url}${path}`;