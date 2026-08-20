import "dotenv/config";
import { db } from "./index.js";
import { categories, providers, listings } from "./schema.js";

async function seed() {
  console.log("Seeding categories...");

  const categoryRows = await db
    .insert(categories)
    .values([
      {
        slug: "vehicules",
        name: "Location de véhicules",
        shortDescription: "Voitures, utilitaires et véhicules de cérémonie",
        icon: "Car",
        revenueModel: "100 000 GNF de frais de mise en relation / jour",
        displayOrder: 1,
      },
      {
        slug: "materiaux",
        name: "Matériaux de construction",
        shortDescription: "Sable, gravier, ciment, briques et agrégats",
        icon: "Bricks",
        revenueModel: "Commission négociée avec le distributeur",
        displayOrder: 2,
      },
      {
        slug: "artisans",
        name: "Artisans & Ressources humaines",
        shortDescription: "Maçons, plombiers, électriciens, menuisiers…",
        icon: "HardHat",
        revenueModel: "Commission intégrée aux frais de prestation",
        displayOrder: 3,
      },
      {
        slug: "ordures",
        name: "Ramassage des ordures",
        shortDescription: "Collecte régulière pour particuliers et entreprises",
        icon: "Trash2",
        revenueModel: "Abonnement mensuel",
        displayOrder: 4,
      },
      {
        slug: "gaz",
        name: "Vente de gaz",
        shortDescription: "Commande de bouteilles auprès de distributeurs partenaires",
        icon: "Flame",
        revenueModel: "Commission par bouteille vendue",
        displayOrder: 5,
      },
      {
        slug: "plans",
        name: "Plans de construction",
        shortDescription: "Architectes, dessinateurs et bureaux d'études",
        icon: "Ruler",
        revenueModel: "Commission ou marge par plan vendu",
        displayOrder: 6,
      },
      {
        slug: "betail",
        name: "Vente de bétail",
        shortDescription: "Vaches, moutons et chèvres, vendeurs vérifiés",
        icon: "Beef",
        revenueModel: "Commission sur chaque animal vendu",
        displayOrder: 7,
      },
    ])
    .returning();

  const byIdSlug = Object.fromEntries(categoryRows.map((c) => [c.slug, c.id]));

  console.log("Seeding providers...");

  const providerRows = await db
    .insert(providers)
    .values([
      { categoryId: byIdSlug.vehicules, name: "Agence Kaloum Auto", city: "Conakry", phone: "+224 620 00 00 01", isVerified: true, rating: 460 },
      { categoryId: byIdSlug.materiaux, name: "Distributions Nongo Matériaux", city: "Conakry", phone: "+224 620 00 00 02", isVerified: true, rating: 430 },
      { categoryId: byIdSlug.artisans, name: "Ibrahima Bah — Maçon", city: "Kindia", phone: "+224 620 00 00 03", isVerified: true, rating: 480 },
      { categoryId: byIdSlug.ordures, name: "Propreté Ratoma", city: "Conakry", phone: "+224 620 00 00 04", isVerified: false, rating: 400 },
      { categoryId: byIdSlug.gaz, name: "Distributeur Gaz Matam", city: "Conakry", phone: "+224 620 00 00 05", isVerified: true, rating: 410 },
      { categoryId: byIdSlug.plans, name: "Cabinet Architecture Fria", city: "Fria", phone: "+224 620 00 00 06", isVerified: true, rating: 470 },
      { categoryId: byIdSlug.betail, name: "Éleveur Mamadou Diallo", city: "Labé", phone: "+224 620 00 00 07", isVerified: true, rating: 450 },
    ])
    .returning();

  const providerBy = (name: string) => providerRows.find((p) => p.name === name)!.id;

  console.log("Seeding listings...");

  await db.insert(listings).values([
    {
      categoryId: byIdSlug.vehicules,
      providerId: providerBy("Agence Kaloum Auto"),
      title: "Toyota Land Cruiser — location journalière",
      description: "Véhicule tout-terrain climatisé, idéal déplacements pro ou cérémonies.",
      city: "Conakry",
      priceLabel: "100 000 GNF / jour (frais de mise en relation)",
      isFeatured: true,
      metadata: { seats: 7, transmission: "automatique" },
    },
    {
      categoryId: byIdSlug.materiaux,
      providerId: providerBy("Distributions Nongo Matériaux"),
      title: "Ciment CIMENCAM — sac de 50kg",
      description: "Livraison disponible sur Conakry et environs, commande par lot.",
      city: "Conakry",
      priceLabel: "Prix sur devis",
      isFeatured: true,
      metadata: { unit: "sac 50kg" },
    },
    {
      categoryId: byIdSlug.artisans,
      providerId: providerBy("Ibrahima Bah — Maçon"),
      title: "Maçon expérimenté — gros œuvre & finitions",
      description: "15 ans d'expérience, disponible pour chantiers résidentiels.",
      city: "Kindia",
      priceLabel: "Sur devis",
      isFeatured: true,
      metadata: { metier: "maçon", experienceAnnees: 15 },
    },
    {
      categoryId: byIdSlug.ordures,
      providerId: providerBy("Propreté Ratoma"),
      title: "Abonnement ramassage — 3 passages/semaine",
      description: "Pour ménages et petits commerces, sacs fournis.",
      city: "Conakry",
      priceLabel: "Abonnement mensuel",
      metadata: { passagesParSemaine: 3 },
    },
    {
      categoryId: byIdSlug.gaz,
      providerId: providerBy("Distributeur Gaz Matam"),
      title: "Bouteille de gaz 12,5kg",
      description: "Livraison à domicile disponible sur Matam et Kaloum.",
      city: "Conakry",
      priceLabel: "Commande directe",
      metadata: { capaciteKg: 12.5 },
    },
    {
      categoryId: byIdSlug.plans,
      providerId: providerBy("Cabinet Architecture Fria"),
      title: "Plan de maison 3 chambres + salon",
      description: "Plan 2D + 3D, dossier complet pour dépôt permis de construire.",
      city: "Fria",
      priceLabel: "Sur devis",
      metadata: { chambres: 3 },
    },
    {
      categoryId: byIdSlug.betail,
      providerId: providerBy("Éleveur Mamadou Diallo"),
      title: "Vache locale — 3 ans",
      description: "Bonne santé, vérifiée. Localisation Labé, transport à discuter.",
      city: "Labé",
      priceLabel: "Sur négociation",
      metadata: { type: "vache", ageApprox: "3 ans" },
    },
  ]);

  console.log("Seed terminé ✔");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
