import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. The Neon integration on Vercel injects this automatically; for local dev copy it from the Neon dashboard into .env.local.",
  );
}

export const db = drizzle(neon(connectionString), { schema });
