# Nexova Services

Plateforme multiservice (véhicules, matériaux de construction, artisans/RH,
ramassage des ordures, gaz, plans de construction, bétail) — **v1 : catalogue
+ vitrine**, sans logique de paiement/commission/réservation. Chaque
verticale partage le même schéma de données générique (`metadata` JSONB) et
les mêmes composants UI, pour rester facile à étendre.

## Stack

- **Backend** : Node.js, tRPC v11 (serveur HTTP standalone), Drizzle ORM,
  Neon PostgreSQL — même pattern que MediConnect / ProxiGaz / COMIX-CI.
- **Frontend** : React 18, Vite, Tailwind CSS, React Router, tRPC + React
  Query pour le fetching typé de bout en bout.

## Structure

```
nexova-services/
  backend/
    src/
      db/           schema.ts, index.ts (connexion Neon), seed.ts
      router/        trpc.ts + un router par domaine (categories, listings, providers, requests)
      server.ts       point d'entrée HTTP
  frontend/
    src/
      components/ui/       Button, Card, Badge, Input, Textarea, Select, Modal, Skeleton, EmptyState…
      components/layout/   Navbar, Footer, Container
      components/services/ ServiceCategoryCard, ListingCard/ListingGrid, CategoryFilterBar, RequestFormModal
      pages/                Home, ServicesIndex, CategoryPage, ListingDetail, Contact, NotFound
      lib/                  trpc.js, categories.js, utils.js
      hooks/                useDebouncedValue.js
```

## Démarrage

### 1. Backend

```bash
cd backend
cp .env.example .env
# Renseigner DATABASE_URL avec votre chaîne de connexion Neon
npm install
npm run db:push     # crée les tables à partir de src/db/schema.ts
npm run db:seed      # insère les 7 catégories + données de démo
npm run dev           # démarre l'API tRPC sur http://localhost:4100
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev   # http://localhost:5173
```

## Décisions d'architecture

- **Schéma générique plutôt que 7 tables** : `listings` et `providers` sont
  génériques, avec un champ `metadata` JSONB pour les attributs spécifiques
  à chaque verticale (ex. `{ seats }` pour un véhicule vs `{ ageApprox }`
  pour du bétail). Évite de dupliquer le CRUD/UI sept fois ; un nouveau
  service = une ligne dans `categories`, pas une migration.
- **Pas de logique métier complexe (v1)** : `requests` n'est qu'une capture
  de lead (nom, téléphone, message). Aucune réservation, aucun calcul de
  commission, aucun paiement — conforme au choix "catalogue/vitrine" fait
  pour ce premier build. Le document de cadrage prévoit ces mécaniques
  (100 000 GNF/jour pour véhicules, commissions par verticale, etc.) pour
  une phase ultérieure.
- **RequestFormModal unique** : un seul composant de formulaire, réutilisé
  sur la page catégorie, la page détail d'annonce et la page Contact via
  des props optionnelles (`categoryId`, `listingId`) — pas de duplication
  de formulaire par verticale.
- **États gérés partout** : chaque écran de données a un état loading
  (skeletons calés sur la mise en page finale), erreur (avec bouton
  Réessayer) et vide (message contextuel), via `ListingGrid`.

## Déploiement (Vercel Services)

Le fichier `vercel.json` à la racine déclare `frontend` et `backend` comme
deux services d'un même projet Vercel (fonctionnalité **Vercel Services**,
beta depuis juin 2026), servis sur un seul domaine :
- `/api/*` → service `backend`
- tout le reste → service `frontend`

Variables d'environnement à définir dans le dashboard Vercel :
- **backend** : `DATABASE_URL` (chaîne Neon)
- **frontend** : `VITE_API_URL=/api` (chemin relatif, même domaine que le backend)

Le backend est un serveur Node.js classique (`backend/src/server.ts`, avec
`server.listen()`) — Vercel le détecte automatiquement comme "Node.js
server" sans configuration supplémentaire. Comme Vercel Services route la
requête vers `/api/...` sans retirer ce préfixe, `server.ts` le retire lui-même
côté backend avant de le transmettre à tRPC.

## Prochaines étapes suggérées

- Authentification admin + CRUD des `listings`/`providers` (actuellement
  seedés en dur).
- Passer `requests.categoryId`/upload d'images à un vrai stockage (ex.
  Cloudinary, comme Cavally Livres) plutôt que des URLs statiques.
- Ajouter la logique métier par verticale une fois une verticale prioritaire
  validée (ex. calcul des 100 000 GNF/jour pour la location de véhicules).
