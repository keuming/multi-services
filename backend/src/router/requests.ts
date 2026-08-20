import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure } from "./trpc.js";
import { requests, listings } from "../db/schema.js";
import { TRPCError } from "@trpc/server";

const createRequestInput = z.object({
  listingId: z.number().int().positive().optional(),
  categoryId: z.number().int().positive().optional(),
  fullName: z.string().trim().min(2, "Nom trop court").max(160),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro invalide")
    .max(32)
    .regex(/^[0-9+ ]+$/, "Numéro invalide"),
  city: z.string().trim().max(96).optional(),
  message: z.string().trim().max(1000).optional(),
});

export const requestsRouter = router({
  /**
   * Lead-capture only: records the client's intent to be contacted about a
   * listing/category. Deliberately has no booking, pricing, or commission
   * logic — that's out of scope for the catalogue-only phase.
   */
  create: publicProcedure.input(createRequestInput).mutation(async ({ ctx, input }) => {
    if (input.listingId) {
      const [listing] = await ctx.db
        .select({ id: listings.id })
        .from(listings)
        .where(eq(listings.id, input.listingId))
        .limit(1);
      if (!listing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Annonce introuvable" });
      }
    }

    const [created] = await ctx.db
      .insert(requests)
      .values({
        listingId: input.listingId,
        categoryId: input.categoryId,
        fullName: input.fullName,
        phone: input.phone,
        city: input.city,
        message: input.message,
      })
      .returning({ id: requests.id });

    return { id: created.id };
  }),
});
