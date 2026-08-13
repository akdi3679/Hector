import type { Metadata } from 'next';
import './globals.css';
import { Fraunces, Archivo, Caveat } from 'next/font/google';
const fraunces = Fraunces({ weight: ['400','500','600','700'], style: ['normal','italic'], subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const archivo = Archivo({ weight: ['300','400','500','600','700'], subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const caveat = Caveat({ weight: ['400','600','700'], subsets: ['latin'], variable: '--font-caveat', display: 'swap' });

export const metadata: Metadata = {
  title: 'La Virée d’Hector — Voyager, découvrir, raconter | Créateurs de contenu',
  description: 'Sophie & Jean-Marc parcourent l’Europe à bord d’Hector, leur camion aménagé. Road-trips, découvertes et vie nomade en vidéo — YouTube, TikTok, Instagram.',
  openGraph: {
    title: 'La Virée d’Hector — It’s time to go.',
    description: 'Un couple, un camion aménagé, trois chaînes YouTube. Découvrez notre univers et collaborons.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'La Virée d’Hector',
  slogan: 'It’s time to go',
  founder: [{ '@type': 'Person', name: 'Sophie' }, { '@type': 'Person', name: 'Jean-Marc' }],
  sameAs: [
    'https://www.instagram.com/lavireedhector/',
    'https://www.facebook.com/lavireedhector/',
    'https://www.tiktok.com/@lavireedhector',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${archivo.variable} ${caveat.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}