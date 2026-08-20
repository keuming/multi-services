import { createServer } from "node:http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/trpc.js";

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes("*") || allowedOrigins.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext,
});

function stripApiPrefix(url) {
  if (url === "/api") return "/";
  if (url?.startsWith("/api/")) return url.slice(4);
  return url;
}

const server = createServer((req, res) => {
  req.url = stripApiPrefix(req.url);
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  trpcHandler(req, res);
});

const port = Number(process.env.PORT ?? 4100);
server.listen(port);

// eslint-disable-next-line no-console
console.log(`CONNECTA API (tRPC) écoute sur http://localhost:${port}`);
