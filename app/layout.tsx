// app/layout.tsx


import type { Metadata } from 'next';
import './globals.css';
import { siteConfig, absoluteUrl } from '@/lib/site-config';
import { ToastProvider } from '@/components/Toast';
import { useGlobalFetch } from '@/lib/useGlobalFetch';

import { SiteDataProvider } from '@/lib/site-data';

import { Fraunces, Archivo, Caveat } from 'next/font/google';

const fraunces = Fraunces({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const archivo = Archivo({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const caveat = Caveat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

// ⭐ Metadata SEO complète
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  
  title: {
    default: 'La Virée d\'Hector — Voyager, découvrir, raconter | Créateurs de contenu',
    template: '%s | La Virée d\'Hector',
  },
  description: 'Sophie & Jean-Marc parcourent l\'Europe à bord d\'Hector, leur camion aménagé. Road-trips, découvertes et vie nomade en vidéo — YouTube, TikTok, Instagram.',
  keywords: ['vanlife', 'voyage', 'camion aménagé', 'youtube', 'partenariat', 'équipement nomade', 'high-tech', 'énergie solaire'],
  authors: [{ name: 'Sophie & Jean-Marc' }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Un couple, un camion aménagé, trois chaînes YouTube. Découvrez notre univers et collaborons.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Sophie, Jean-Marc & Hector`,
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: 'Un couple, un camion aménagé, trois chaînes YouTube. Découvrez notre univers et collaborons.',
    images: ['/og-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: siteConfig.url,
  },
};

// ⭐ JSON-LD Schema.org (SEO structuré)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  slogan: siteConfig.tagline,
  url: siteConfig.url,
  logo: absoluteUrl('/icon.png'),
  description: 'Créateurs de contenu voyage, tech et vanlife. 3 chaînes YouTube, partenariats marques.',
  founder: [
    { '@type': 'Person', name: 'Sophie' },
    { '@type': 'Person', name: 'Jean-Marc' },
  ],
  sameAs: [
    'https://www.youtube.com/@lavireedhector',
    'https://www.youtube.com/@HorizonTechnium',
    'https://www.youtube.com/@LavireedHectorTravel',
    'https://www.instagram.com/lavireedhector/',
    'https://www.facebook.com/lavireedhector/',
    'https://www.tiktok.com/@lavireedhector',
  ],
  knowsAbout: [
    'vanlife',
    'voyage',
    'high-tech',
    'énergie solaire',
    'matériel nomade',
    'camion aménagé',
    'road-trip',
  ],
};
// app/layout.tsx
const videosSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'VideoObject',
      name: 'La Virée d\'Hector — Chaîne principale',
      description: 'Partenariats, produits nomades, tech et vie à bord d\'Hector.',
      url: 'https://www.youtube.com/@lavireedhector',
      thumbnailUrl: 'https://lavireedhector.fr/og-image.jpg',
      uploadDate: '2021-01-01',
      author: {
        '@type': 'Organization',
        name: 'La Virée d\'Hector',
      },
    },
  ],
};
function GlobalErrorHandler() {
  useGlobalFetch();
  return null;
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${archivo.variable} ${caveat.variable}`}>
      <body>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videosSchema) }} />
   <SiteDataProvider>
          <ToastProvider>
            <GlobalErrorHandler />  {/* ⭐ UNE SEULE FOIS ICI */}
            {children}
          </ToastProvider>
        </SiteDataProvider>
</body>
    </html>
  );
}



