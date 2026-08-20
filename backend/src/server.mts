import "dotenv/config";
import { createServer } from "node:http";
import cors from "cors";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/trpc.js";

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
console.log(`Nexova Services API (tRPC) écoute sur http://localhost:${port}`);
