export { material } from './material';
export { mediaKitUrl } from './media';
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

export const videos = [
  { tag: 'Découverte', title: 'El Jem, face à 2 000 ans d’histoire', note: 'la Tunisie nous a soufflés', url: 'https://www.tiktok.com/@lavireedhector/video/7581768423806356758', image: 'https://images.unsplash.com/photo-1548013148-4249e6910e1c?q=80&w=1000&auto=format&fit=crop' },
  { tag: 'Avec Allpowers', title: 'L’énergie qui ne nous lâche jamais', note: 'la R2500 vit à bord d’Hector', url: 'https://www.tiktok.com/@lavireedhector/video/7353891285008157985', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop' },
  { tag: 'Avec OutIn', title: 'Un espresso, avec vue sur tout', note: 'le luxe simple du matin', url: 'https://www.tiktok.com/@lavireedhector', image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1000&auto=format&fit=crop' },
  { tag: 'Matériel', title: 'Hector prend de la hauteur', note: 'le DJI Mini 5 Pro dans nos bagages', url: 'https://www.youtube.com/@lavireedhector', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop' },
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

// DÉMO — produits & prix à valider avec Sophie & Jean-Marc
export const products = [
  { name: 'Stickers Hector', desc: 'Le camion en autocollants, pour vitres et carnets.', price: '5 €', image: 'https://images.unsplash.com/photo-1616400928367-1bd3317776ad?q=80&w=800&auto=format&fit=crop' },
  { name: 'Cartes postales de la route', desc: 'Nos étapes, imprimées comme au bon vieux temps.', price: '12 €', image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=800&auto=format&fit=crop' },
  { name: 'Carnet de road-trip', desc: 'Le compagnon papier de vos propres virées.', price: '18 €', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop' },
  { name: 'Presets photo du van', desc: 'Nos réglages lumière pour vos images de voyage.', price: '25 €', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop' },
];

export const gallery = [
  { src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop', alt: 'Campement du soir' },
  { src: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1200&auto=format&fit=crop', alt: 'Le ciel de la route' },
  { src: 'https://images.unsplash.com/photo-1548013148-4249e6910e1c?q=80&w=1200&auto=format&fit=crop', alt: 'Découverte en Tunisie' },
  { src: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop', alt: 'Le café du matin' },
  { src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop', alt: 'La route devant' },
  { src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop', alt: 'Préparer la prochaine étape' },
];
// DÉMO — remplacer par vos vrais moments & légendes
export const moments = [
  { image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=900&auto=format&fit=crop', caption: 'le premier réveil avec vue', emotion: 'liberté' },
  { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop', caption: 'la mer, enfin', emotion: 'émerveillement' },
  { image: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=900&auto=format&fit=crop', caption: 'ce coucher de soleil qu’on n’a pas filmé', emotion: 'silence' },
  { image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop', caption: 'perdus, mais ensemble', emotion: 'courage' },
  { image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop', caption: 'le café préféré d’Hector', emotion: 'douceur' },
];


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
export const mediaKitUrl = 'https://res.cloudinary.com/du0frvxjo/image/upload/v1/mediakit/media-kit.pdf';
