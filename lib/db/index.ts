import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Copy .env.example to .env.local and start Postgres.",
  );
}

const globalForDb = globalThis as unknown as {
  frannysSql?: ReturnType<typeof postgres>;
};

// Keep the pool small so Next build workers do not exhaust Postgres.
const client =
  globalForDb.frannysSql ??
  postgres(connectionString, {
    prepare: false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.frannysSql = client;
}

export const db = drizzle(client, { schema });
