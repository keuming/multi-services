import { z } from "zod";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { router, publicProcedure } from "./trpc.js";
import { listings, categories, providers } from "../db/schema.js";
import { TRPCError } from "@trpc/server";

const PAGE_SIZE_DEFAULT = 12;
const PAGE_SIZE_MAX = 48;

export const listingsRouter = router({
  /**
   * Paginated, filterable catalogue query. Powers both the homepage
   * "featured" rail and the per-category listing grid.
   */
  list: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        city: z.string().optional(),
        search: z.string().optional(),
        featuredOnly: z.boolean().optional().default(false),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(PAGE_SIZE_MAX).default(PAGE_SIZE_DEFAULT),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = [eq(listings.isActive, true)];

      if (input.categorySlug) {
        const [category] = await ctx.db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, input.categorySlug))
          .limit(1);
        // Unknown slug -> empty result set, not an error (keeps the UI simple).
        if (!category) {
          return { items: [], total: 0, page: input.page, pageSize: input.pageSize };
        }
        filters.push(eq(listings.categoryId, category.id));
      }

      if (input.city) {
        filters.push(ilike(listings.city, `%${input.city}%`));
      }

      if (input.search) {
        filters.push(ilike(listings.title, `%${input.search}%`));
      }

      if (input.featuredOnly) {
        filters.push(eq(listings.isFeatured, true));
      }

      const whereClause = and(...filters);

      const [items, [{ count }]] = await Promise.all([
        ctx.db
          .select({
            id: listings.id,
            title: listings.title,
            description: listings.description,
            city: listings.city,
            priceLabel: listings.priceLabel,
            imageUrl: listings.imageUrl,
            isFeatured: listings.isFeatured,
            metadata: listings.metadata,
            categorySlug: categories.slug,
            categoryName: categories.name,
            providerName: providers.name,
            providerVerified: providers.isVerified,
          })
          .from(listings)
          .innerJoin(categories, eq(listings.categoryId, categories.id))
          .leftJoin(providers, eq(listings.providerId, providers.id))
          .where(whereClause)
          .orderBy(desc(listings.isFeatured), desc(listings.createdAt))
          .limit(input.pageSize)
          .offset((input.page - 1) * input.pageSize),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(listings)
          .where(whereClause),
      ]);

      return { items, total: count, page: input.page, pageSize: input.pageSize };
    }),

  /** Full detail for a single listing (listing detail page). */
  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .select({
          id: listings.id,
          title: listings.title,
          description: listings.description,
          city: listings.city,
          priceLabel: listings.priceLabel,
          imageUrl: listings.imageUrl,
          metadata: listings.metadata,
          categoryId: categories.id,
          categorySlug: categories.slug,
          categoryName: categories.name,
          providerId: providers.id,
          providerName: providers.name,
          providerPhone: providers.phone,
          providerVerified: providers.isVerified,
          providerCity: providers.city,
        })
        .from(listings)
        .innerJoin(categories, eq(listings.categoryId, categories.id))
        .leftJoin(providers, eq(listings.providerId, providers.id))
        .where(eq(listings.id, input.id))
        .limit(1);

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Annonce introuvable" });
      }
      return item;
    }),
});
