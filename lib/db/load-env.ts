import { config } from "dotenv";
import { resolve } from "path";

// Prefer .env.local for Next.js projects. Override stale shell exports in scripts.
config({ path: resolve(process.cwd(), ".env.local"), override: true });
config({ path: resolve(process.cwd(), ".env") });
