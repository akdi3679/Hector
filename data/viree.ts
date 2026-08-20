export { socialStats, brandsAudience } from './social-stats';

export const brandData = {
  name: 'La Virée d’Hector',
  tagline: 'It’s time to go.',
  couple: 'Sophie & Jean-Marc',
  truck: 'Hector, notre camion aménagé',
  since: '2021',
  instagram: { handle: '@lavireedhector', url: 'https://www.instagram.com/lavireedhector/' },
  facebook: { url: 'https://www.facebook.com/lavireedhector/' },
  tiktok: { handle: '@lavireedhector', url: 'https://www.tiktok.com/@lavireedhector' },
  youtube: { url: 'https://www.youtube.com/@lavireedhector' },
};

export const navigation = [
  { label: 'Vidéos', href: '#videos' },
  { label: 'Notre histoire', href: '#apropos' },
  { label: 'L’écosystème', href: '#ecosysteme' },
  { label: 'Espace marques', href: '#marques' },
  { label: 'Galerie', href: '#galerie' },
];


export const storyData = {
  title: 'Sophie, Jean-Marc… et Hector.',
  paragraphs: [
    'En 2021, on change de vie : on quitte tout pour vivre en version nomade, au volant d’Hector, notre camion aménagé.',
    'Sophie, c’est l’œil et la plume ; Jean-Marc, la mécanique et les plans. Hector, lui, est notre maison, notre studio de tournage et le troisième membre de l’équipe.',
    'On parcourt les routes du monde et on vous raconte tout — les merveilles, les galères, le matériel qui nous suit. Sans filtre, comme à la maison.',
  ],
  signature: 'Sophie, Jean-Marc & Hector',
  timeline: ['2021 — on change de vie', 'Hector entre dans nos vies', 'Les routes du monde', 'Des kilomètres de récits'],
};

export const platforms = [
  { name: 'YouTube', desc: 'Trois chaînes, une même route : longues étapes, coulisses et formats courts, au complet.', url: brandData.youtube.url, main: true },
  { name: 'TikTok', desc: 'Les virées en vertical, l’étincelle qui donne envie de partir.', url: brandData.tiktok.url },
  { name: 'Instagram', desc: 'Le quotidien en images, les routes du moment.', url: brandData.instagram.url },
  { name: 'Facebook', desc: 'La communauté des premiers kilomètres.', url: brandData.facebook.url },
];

export const formats = [
  { title: 'Intégration YouTube', text: 'Votre marque vit une vraie étape avec nous, racontée honnêtement.' },
  { title: 'Test & review honnête', text: 'Énergie, confort, matériel nomade : testé des semaines, pas une après-midi.' },
  { title: 'Formats courts', text: 'TikTok & Shorts : l’étincelle qui donne envie, vue et revue.' },
  { title: 'Contenu UGC', text: 'Des images vraies, tournées en conditions réelles, réutilisables par votre marque.' },
  { title: 'Ambassade longue durée', text: 'Une histoire qui s’écrit sur la route — pas un one-shot.' },
];

export const collabs = ['Allpowers', 'OutIn', 'DJI'];






export interface YoutubeChannel {
  id: string;
  handle: string;
  name: string;
  url: string;
  positioning: string;
  description: string;
  audience: string;
  themes: string[];
  accent: 'red' | 'sun' | 'sky';
}

export const youtubeChannels: YoutubeChannel[] = [
  {
    id: 'main',
    handle: '@lavireedhector',
    name: 'La Virée d’Hector',
    url: 'https://www.youtube.com/@lavireedhector',
    positioning: 'Partenariats & produits nomades',
    description: 'La chaîne principale : intégrations marques, tests d’équipements, high-tech et vie à bord d’Hector.',
    audience: 'Voyage · high-tech · équipement nomade',
    themes: ['Vanlife', 'High-tech', 'Équipement'],
    accent: 'red',
  },
  {
    id: 'tech',
    handle: '@HorizonTechnium',
    name: 'Horizon Technium',
    url: 'https://www.youtube.com/@HorizonTechnium',
    positioning: 'Énergie, solaire & maison',
    description: 'Technologies domestiques, stockage d’énergie, solaire et renouvelables — testés en conditions réelles.',
    audience: 'Maison · énergie · solaire',
    themes: ['Solaire', 'Batteries', 'Domotique'],
    accent: 'sun',
  },
  {
    id: 'travel',
     handle: '@LavireedHectorTravel',
    name: 'La Virée d’Hector Travel',
    url: 'https://www.youtube.com/@Lavir%C3%A9edHectorTravel',
    positioning: 'Voyages & destinations',
    description: 'Exclusivement le voyage : destinations, découvertes, rencontres et vie sur la route.',
    audience: 'Voyage · destinations · découvertes',
    themes: ['Destinations', 'Vlogs', 'Rencontres'],
    accent: 'sky',
  },
];

// Fallback si pas de clé API — dernières vidéos réelles d'Horizon Technium
export const fallbackLatestVideos = [
  { title: 'Station de stockage OSCAL PowerStorage 2000 : 2400 W en bypass', tag: 'Horizon Technium', url: 'https://www.youtube.com/@HorizonTechnium', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop' },
  { title: 'Batterie ECO-WORTHY 16kWh : l’énergie solaire gratuite jour et nuit', tag: 'Horizon Technium', url: 'https://www.youtube.com/@HorizonTechnium', image: 'https://images.unsplash.com/photo-1508514186921-58418ff0183d?q=80&w=1000&auto=format&fit=crop' },
  { title: 'El Jem, face à 2 000 ans d’histoire', tag: 'Travel', url: 'https://www.tiktok.com/@lavireedhector/video/7581768423806356758', image: 'https://images.unsplash.com/photo-1548013148-4249e6910e1c?q=80&w=1000&auto=format&fit=crop' },
  { title: 'L’énergie qui ne nous lâche jamais (Allpowers R2500)', tag: 'La Virée d’Hector', url: 'https://www.tiktok.com/@lavireedhector/video/7353891285008157985', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
];
