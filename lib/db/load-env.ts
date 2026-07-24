import { config } from "dotenv";
import { resolve } from "path";

// Prefer .env.local for Next.js projects
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });
