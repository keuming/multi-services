import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema.js";

if (!(globalThis as any).WebSocket) {
  (globalThis as any).WebSocket = ws;
}

type Database = ReturnType<typeof drizzle<typeof schema>>;

let _db: Database | null = null;

function getDb(): Database {
  if (_db) return _db;
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in."
    );
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(pool, { schema });
  return _db;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
