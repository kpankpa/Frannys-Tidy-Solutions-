import "./load-env";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { seedCatalog } from "./seed-catalog";
import { SITE } from "../constants";
import { cedisToPesewas } from "../money";
import { db } from "./index";
import {
  categories,
  productImages,
  products,
  settings,
  users,
} from "./schema";

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
  const passwordHash = await hash(password, 10);

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

async function seedSettings() {
  const defaults = [
    { key: "delivery_fee_pesewas", value: String(cedisToPesewas(SITE.deliveryFee)) },
    { key: "whatsapp_number", value: SITE.whatsapp },
    { key: "business_hours", value: SITE.hours },
    { key: "business_address", value: SITE.address },
  ];

  for (const row of defaults) {
    const existing = await db.query.settings.findFirst({
      where: eq(settings.key, row.key),
    });
    if (!existing) {
      await db.insert(settings).values(row);
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
