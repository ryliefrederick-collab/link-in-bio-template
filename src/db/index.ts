import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getConnectionString(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. The Neon integration on Vercel injects this automatically; for local dev copy it from the Neon dashboard into .env.local.",
    );
  }
  return url;
}

// Lazy client so module-load during `next build` doesn't blow up when no
// DATABASE_URL is present. The actual connection only happens on first query.
let _client: NeonQueryFunction<false, false> | undefined;
function getClient(): NeonQueryFunction<false, false> {
  if (!_client) _client = neon(getConnectionString());
  return _client;
}

export const db = drizzle(
  (async (strings: TemplateStringsArray, ...values: unknown[]) => {
    return getClient()(strings, ...values);
  }) as unknown as NeonQueryFunction<false, false>,
  { schema },
);
