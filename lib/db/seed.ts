import "./load-env";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { seedCatalog } from "./seed-catalog";
import { db } from "./index";
import {
  categories,
  productImages,
  products,
  settings,
  users,
} from "./schema";
import { SETTINGS_DEFAULTS } from "./settings";
import { cedisToPesewas } from "../money";

const categoryNames = [
  "Detergents",
  "Eco-Friendly",
  "Specialty",
  "Disinfectants",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@frannys.com")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && (!process.env.ADMIN_PASSWORD || password === "changeme123")) {
    throw new Error(
      "Refusing to seed: set a strong ADMIN_PASSWORD before seeding in production.",
    );
  }

  if (isProd && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    throw new Error(
      "Refusing to seed: set AUTH_SECRET (32+ chars) before seeding in production.",
    );
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const passwordHash = await hash(password, 12);

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  await db.insert(users).values({
    email,
    name: "Frannys Admin",
    passwordHash,
    role: "admin",
  });

  console.log(`Created admin: ${email}`);
}

async function seedCategories() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) {
    console.log("Categories already seeded.");
    return existing;
  }

  const rows = await db
    .insert(categories)
    .values(
      categoryNames.map((name) => ({
        name,
        slug: slugify(name),
      })),
    )
    .returning();

  console.log(`Seeded ${rows.length} categories.`);
  return rows;
}

async function seedProducts(categoryRows: typeof categories.$inferSelect[]) {
  const existing = await db.select().from(products);
  if (existing.length > 0) {
    console.log("Products already seeded.");
    return;
  }

  const categoryByName = new Map(categoryRows.map((c) => [c.name, c.id]));

  for (const item of seedCatalog) {
    const categoryId = categoryByName.get(item.category);
    if (!categoryId) {
      throw new Error(`Missing category for product: ${item.name}`);
    }

    const [created] = await db
      .insert(products)
      .values({
        slug: item.id,
        name: item.name,
        description: item.description,
        longDescription: item.longDescription,
        features: item.features,
        pricePesewas: cedisToPesewas(item.price),
        categoryId,
        rating: String(item.rating),
        reviewsCount: item.reviews,
        inStock: item.inStock,
        stockQuantity: item.inStock ? (item.stockQuantity ?? 25) : 0,
        badge: item.badge ?? null,
        imageAlt: item.imageAlt,
      })
      .returning();

    await db.insert(productImages).values(
      item.images.map((url, index) => ({
        productId: created.id,
        url,
        sortOrder: index,
      })),
    );
  }

  console.log(`Seeded ${seedCatalog.length} products.`);
}

/** Keys we refresh on re-seed so public defaults stay current. */
const FORCE_UPDATE_KEYS = new Set([
  "about_blurb",
  "about_headline",
  "about_intro",
  "about_story",
  "about_mission",
  "about_vision",
  "testimonials",
  "service_packages",
]);

async function seedSettings() {
  const defaults = Object.entries(SETTINGS_DEFAULTS).map(([key, value]) => ({
    key,
    value,
  }));

  // Insert-only for most settings. Refresh About trust copy on re-seed.
  for (const row of defaults) {
    const existing = await db.query.settings.findFirst({
      where: eq(settings.key, row.key),
    });
    if (!existing) {
      await db.insert(settings).values(row);
      continue;
    }
    if (FORCE_UPDATE_KEYS.has(row.key)) {
      await db
        .update(settings)
        .set({ value: row.value, updatedAt: new Date() })
        .where(eq(settings.key, row.key));
    }
  }

  console.log("Settings ready.");
}

async function main() {
  console.log("Seeding Frannys database...");
  await seedAdmin();
  const categoryRows = await seedCategories();
  await seedProducts(categoryRows);
  await seedSettings();
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
