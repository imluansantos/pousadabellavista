import {
  BedDouble,
  Car,
  Coffee,
  Mountain,
  PawPrint,
  ShowerHead,
  Snowflake,
  Trees,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { Feature72Item } from "@/components/ui/feature-72";
import { comodidades } from "@/data/comodidades";

// Liga os dados das 9 comodidades (src/data/comodidades.ts) ao formato do
// grid de cards (Feature72). O ícone só aparece no placeholder, caso alguma
// foto falte — fica aqui porque é componente React, não dado "puro".
const ICONS: Record<string, LucideIcon> = {
  apartamentos: BedDouble,
  cafe: Coffee,
  estacionamento: Car,
  banheiro: ShowerHead,
  pet: PawPrint,
  ar: Snowflake,
  vista: Mountain,
  wifi: Wifi,
  "ar-livre": Trees,
};

export const comodidadeItems: Feature72Item[] = comodidades.map((c) => ({
  id: c.id,
  title: c.titulo,
  description: c.texto,
  icon: ICONS[c.id] ?? BedDouble,
  image: c.foto,
  imageAlt: c.alt,
}));
