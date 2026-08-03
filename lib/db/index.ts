import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  frannysSql?: ReturnType<typeof postgres>;
};

// Lazily create the connection so importing this module never throws.
// The throw is deferred to first actual DB use, which lets callers (and the
// Next.js build's page-data collection) handle a missing DATABASE_URL via their
// own try/catch fallbacks instead of failing at module evaluation time.
let dbInstance: Database | undefined;

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Copy .env.example to .env.local and start Postgres.",
    );
  }

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

  return drizzle(client, { schema });
}

function getDb(): Database {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  return dbInstance;
}

export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
}) as Database;
