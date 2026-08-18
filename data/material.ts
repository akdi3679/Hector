import { Truck, BatteryCharging, Camera, Coffee, Cpu } from 'lucide-react';
import type { ComponentType } from 'react';

export interface MaterialItem {
  name: string;
  role: string;
  note: string;
  icon: ComponentType<any>;
}

export const material: MaterialItem[] = [
  { name: 'Hector, PL aménagé', role: 'maison, studio & véhicule', note: 'le décor de toutes nos vidéos', icon: Truck },
  { name: 'Station Allpowers R2500', role: 'énergie nomade', note: 'partenariat — testée des mois', icon: BatteryCharging },
  { name: 'DJI Mini 5 Pro', role: 'prises de vue aériennes', note: 'pris en main en conditions de voyage', icon: Camera },
  { name: 'OutIn Nano', role: 'espresso à bord', note: 'partenariat', icon: Coffee },
  { name: 'PC de montage sur-mesure', role: 'watercooling & étalonnage', note: 'des vidéos dignes de ce nom', icon: Cpu },
];