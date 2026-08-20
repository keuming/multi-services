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

/**
 * Per-category accent color, one of the four colors in the CONNECTA logo's
 * wheel (navy/vehicules, orange/matériaux, green/artisans, brown/bétail).
 * The remaining three categories (not pictured in the logo) reuse the
 * closest matching hue so every tile still reads as part of the same set.
 * Tailwind can't safely purge classes built from a dynamic string, so this
 * gives raw hex values applied via inline `style` instead of class names.
 */
const CATEGORY_ACCENTS = {
  vehicules: { bg: "#1e3a5f1a", text: "#1e3a5f" }, // navy — matches the logo's car icon
  materiaux: { bg: "#d97b3d1a", text: "#c1682d" }, // orange — matches the aggregates icon
  artisans: { bg: "#3d82591a", text: "#316b48" }, // green — matches the wrench/gear icon
  betail: { bg: "#8b5e3c1a", text: "#744c30" }, // brown — matches the cattle icon
  ordures: { bg: "#1e3a5f1a", text: "#1e3a5f" }, // reuse navy
  gaz: { bg: "#d97b3d1a", text: "#c1682d" }, // reuse orange (fire-adjacent)
  plans: { bg: "#3d82591a", text: "#316b48" }, // reuse green
};

const DEFAULT_ACCENT = { bg: "#1e3a5f1a", text: "#1e3a5f" };

export function getCategoryAccent(slug) {
  return CATEGORY_ACCENTS[slug] ?? DEFAULT_ACCENT;
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
