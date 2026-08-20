import { createServer } from "node:http";
import cors from "cors";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/trpc.js";

// dotenv is only needed to read a local .env file during `npm run dev` /
// `npm run db:seed` on a developer machine. On Vercel, environment variables
// are already injected into process.env at runtime, and Vercel's bundler for
// the captured Node.js server can't reliably trace the "dotenv/config"
// subpath import — so we load it conditionally instead of as a static
// top-level import, and never fail the server if it's unavailable.
if (!process.env.VERCEL) {
  try {
    await import("dotenv/config");
  } catch {
    // dotenv not installed / not resolvable — fine, env vars are assumed to
    // already be set some other way (e.g. exported in the shell).
  }
}

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const corsMiddleware = cors({ origin: allowedOrigins, credentials: true });

const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext,
});

/**
 * Deployed as a Vercel Service (see /vercel.json at repo root), requests
 * still carry their original "/api" prefix when they reach this service —
 * Vercel Services routes the full path, it doesn't strip the rewrite match.
 * tRPC's own route matching expects paths like "/categories.list" with no
 * prefix, so we strip it here. Locally (no Vercel rewrite in front of us),
 * requests already arrive without "/api", so this is a no-op then.
 */
function stripApiPrefix(url?: string) {
  if (url === "/api") return "/";
  if (url?.startsWith("/api/")) return url.slice(4);
  return url;
}

const server = createServer((req, res) => {
  req.url = stripApiPrefix(req.url);
  corsMiddleware(req, res, () => {
    trpcHandler(req, res);
  });
});

const port = Number(process.env.PORT ?? 4100);
server.listen(port);

// eslint-disable-next-line no-console
console.log(`CONNECTA API (tRPC) écoute sur http://localhost:${port}`);
