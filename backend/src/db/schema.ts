import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * categories
 * The 7 service verticals from the business plan. Kept as a table (not an enum)
 * so new verticals can be added from an admin UI later without a migration.
 */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(), // e.g. "vehicules"
  name: varchar("name", { length: 128 }).notNull(), // e.g. "Location de véhicules"
  shortDescription: varchar("short_description", { length: 256 }),
  icon: varchar("icon", { length: 64 }).notNull().default("Package"), // lucide-react icon name
  revenueModel: varchar("revenue_model", { length: 256 }), // e.g. "100 000 GNF / jour de location"
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * providers
 * Partners / suppliers / artisans / agencies who fulfill listings.
 * Deliberately generic: same table serves a vehicle owner, an artisan, a gas
 * distributor, a breeder, etc. Category-specific fields live in `metadata`.
 */
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 160 }).notNull(),
  city: varchar("city", { length: 96 }),
  phone: varchar("phone", { length: 32 }),
  isVerified: boolean("is_verified").notNull().default(false),
  rating: integer("rating").default(0), // 0-500 -> displayed as x/5.0
  avatarUrl: text("avatar_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * listings
 * A single catalogue entry (a vehicle, a bag of cement, an artisan profile,
 * a garbage-collection plan, a gas bottle size, a construction plan, an animal).
 * `metadata` carries the category-specific attributes so the schema doesn't
 * need to fork per vertical (e.g. { brand, seats } for vehicules vs
 * { breed, ageMonths } for betail).
 */
export const listings = pgTable(
  "listings",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    providerId: integer("provider_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    city: varchar("city", { length: 96 }),
    priceLabel: varchar("price_label", { length: 96 }), // display-only, e.g. "100 000 GNF/jour"
    imageUrl: text("image_url"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("listings_category_idx").on(table.categoryId),
    cityIdx: index("listings_city_idx").on(table.city),
  })
);

/**
 * requests
 * Lead-capture: a client asking to be put in touch with a provider/listing.
 * No booking/payment/commission logic here on purpose (catalogue-only scope) —
 * this just records intent so an ops agent can follow up manually.
 */
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  // Nullable: a general "Contact" page inquiry isn't tied to any vertical.
  // Category-specific requests (from a CategoryPage/ListingDetail) still set it.
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  city: varchar("city", { length: 96 }),
  message: text("message"),
  status: varchar("status", { length: 24 }).notNull().default("nouveau"), // nouveau | contacte | cloture
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
  providers: many(providers),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  category: one(categories, {
    fields: [providers.categoryId],
    references: [categories.id],
  }),
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  provider: one(providers, {
    fields: [listings.providerId],
    references: [providers.id],
  }),
}));
