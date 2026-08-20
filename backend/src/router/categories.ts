import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { router, publicProcedure } from "./trpc.js";
import { categories } from "../db/schema.js";

export const categoriesRouter = router({
  /** List all active categories, ordered for display on the homepage. */
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.displayOrder));
  }),

  /** Fetch a single category by its URL slug (used by the category page). */
  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);
      return category ?? null;
    }),
});
