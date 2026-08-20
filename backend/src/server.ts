import "dotenv/config";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./router/index.js";
import { createContext } from "./router/trpc.js";

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const server = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({ origin: allowedOrigins, credentials: true }),
});

const port = Number(process.env.PORT ?? 4100);

server.listen(port);

// eslint-disable-next-line no-console
console.log(`Nexova Services API (tRPC) écoute sur http://localhost:${port}`);
