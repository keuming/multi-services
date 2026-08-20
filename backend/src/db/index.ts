import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema.js";

// Neon's serverless driver needs a WebSocket implementation outside the browser.
// Cast through `any` instead of `@ts-expect-error`: whether this assignment
// type-checks "cleanly" depends on the exact @types/node version resolved at
// build time (some versions already declare a global WebSocket, some don't),
// and an unnecessary @ts-expect-error fails a strict `tsc` build just as hard
// as a missing one would.
if (!(globalThis as any).WebSocket) {
  (globalThis as any).WebSocket = ws;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in."
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
