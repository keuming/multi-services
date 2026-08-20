import { createTRPCReact } from "@trpc/react-query";

// End-to-end typing note: if you migrate this file to trpc.ts, re-add
//   import type { AppRouter } from "../../../backend/src/router/index.js";
// and call createTRPCReact<AppRouter>() for full autocomplete on trpc.*.query()
// calls. Kept as plain JS here to match the rest of the frontend (.jsx).
export const trpc = createTRPCReact();

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4100";
