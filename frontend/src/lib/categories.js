import {
  Car,
  HardHat,
  Trash2,
  Flame,
  Ruler,
  Beef,
  Package,
} from "lucide-react";

/**
 * Maps a category's `icon` string (stored in the DB) to an actual
 * lucide-react component. Centralized here so both the homepage grid and
 * the category page header stay in sync without duplicating a switch.
 */
export const CATEGORY_ICONS = {
  Car,
  Bricks: Package, // lucide has no dedicated "bricks" icon; Package reads fine
  HardHat,
  Trash2,
  Flame,
  Ruler,
  Beef,
  Package,
};

export function getCategoryIcon(iconName) {
  return CATEGORY_ICONS[iconName] ?? Package;
}

/** Fallback catalogue used only while the API hasn't responded yet / is offline —
 * keeps the homepage skeleton meaningful during local dev without a seeded DB. */
export const FALLBACK_CATEGORIES = [
  { slug: "vehicules", name: "Location de véhicules", icon: "Car" },
  { slug: "materiaux", name: "Matériaux de construction", icon: "Bricks" },
  { slug: "artisans", name: "Artisans & Ressources humaines", icon: "HardHat" },
  { slug: "ordures", name: "Ramassage des ordures", icon: "Trash2" },
  { slug: "gaz", name: "Vente de gaz", icon: "Flame" },
  { slug: "plans", name: "Plans de construction", icon: "Ruler" },
  { slug: "betail", name: "Vente de bétail", icon: "Beef" },
];
