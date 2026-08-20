import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { router, publicProcedure } from "./trpc.js";
import { providers, categories } from "../db/schema.js";

export const providersRouter = router({
  /** Verified-partner directory, optionally filtered by category slug. */
  list: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        verifiedOnly: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const filters = [];

      if (input.categorySlug) {
        const [category] = await ctx.db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, input.categorySlug))
          .limit(1);
        if (!category) return [];
        filters.push(eq(providers.categoryId, category.id));
      }

      if (input.verifiedOnly) {
        filters.push(eq(providers.isVerified, true));
      }

      return ctx.db
        .select({
          id: providers.id,
          name: providers.name,
          city: providers.city,
          isVerified: providers.isVerified,
          rating: providers.rating,
          avatarUrl: providers.avatarUrl,
          categorySlug: categories.slug,
          categoryName: categories.name,
        })
        .from(providers)
        .innerJoin(categories, eq(providers.categoryId, categories.id))
        .where(filters.length ? and(...filters) : undefined);
    }),
});
