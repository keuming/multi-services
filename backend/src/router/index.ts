import { router } from "./trpc.js";
import { categoriesRouter } from "./categories.js";
import { listingsRouter } from "./listings.js";
import { providersRouter } from "./providers.js";
import { requestsRouter } from "./requests.js";

export const appRouter = router({
  categories: categoriesRouter,
  listings: listingsRouter,
  providers: providersRouter,
  requests: requestsRouter,
});

// This is the single source of truth for end-to-end type safety on the
// frontend (imported by frontend/src/lib/trpc.ts). Never import server code
// on the client — only this type.
export type AppRouter = typeof appRouter;
