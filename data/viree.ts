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
export const youtubeChannels = [
  {
    id: 'main',
    name: 'La Virée d\'Hector',
    url: brandData.youtube.url,
    positioning: 'Partenariats, produits voyage, high-tech, équipements nomades',
    audience: '11,6K abonnés',
    description: 'Chaîne principale orientée partenariats et présentations de produits autour du voyage, de la high-tech et des équipements adaptés à la vie nomade.',
    exampleContent: 'Tests matériel, intégrations marques, vie à bord',
    brands: ['Allpowers', 'DJI', 'OutIn']
  },
  {
    id: 'tech',
    name: 'Horizon Technium',
    url: 'https://www.youtube.com/@horizontechnium', // ← URL à confirmer
    positioning: 'Tech domestique, énergie, solaire, renouvelables',
    audience: 'à compléter',
    description: 'Consacrée aux nouvelles technologies domestiques, aux équipements de la maison, à l\'énergie, au solaire et plus largement aux solutions liées aux énergies renouvelables.',
    exampleContent: 'Tests panneaux solaires, batteries, domotique, solutions énergétiques',
    brands: ['à compléter']
  },
  {
    id: 'travel',
    name: 'La Virée d\'Hector Travel',
    url: 'https://www.youtube.com/@lavireedhectortravel', // ← URL à confirmer
    positioning: 'Voyages, destinations, découvertes, vie sur la route',
    audience: 'à compléter',
    description: 'Exclusivement consacrée à nos voyages, nos destinations, nos découvertes et notre vie sur la route.',
    exampleContent: 'Vlogs voyage, guides destinations, coulisses',
    brands: []
  }
];
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

// DÉMO — remplacer par de vrais messages de la communauté
export const reviews = [
  { text: 'Vous nous donnez envie de tout quitter, nous aussi. Ne lâchez rien !', from: 'message de la communauté' },
  { text: 'Hector est devenu notre camion préféré à nous aussi.', from: 'message de la communauté' },
  { text: 'Chaque vidéo est une bouffée d’air. Continuez exactement comme ça.', from: 'message de la communauté' },
  { text: 'On a acheté notre fourgon grâce à vos conseils. Merci pour tout.', from: 'message de la communauté' },
];

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
// Matériel RÉEL, vérifié dans leur contenu
export const gear = [
  { name: 'Hector, PL aménagé', role: 'maison, studio & véhicule', note: 'le décor de toutes nos vidéos' },
  { name: 'Station Allpowers R2500', role: 'énergie nomade', note: 'partenariat — testée des mois' },
  { name: 'DJI Mini 5 Pro', role: 'prises de vue aériennes', note: 'pris en main en conditions de voyage' },
  { name: 'OutIn Nano', role: 'espresso à bord', note: 'partenariat' },
  { name: 'PC de montage sur-mesure', role: 'watercooling & étalonnage', note: 'des vidéos dignes de ce nom' },
];
