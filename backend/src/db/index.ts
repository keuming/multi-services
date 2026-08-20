import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema.js";

// Neon's serverless driver needs a WebSocket implementation outside the browser.
// @ts-expect-error - global assignment expected by @neondatabase/serverless in Node
globalThis.WebSocket = globalThis.WebSocket ?? ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in."
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
