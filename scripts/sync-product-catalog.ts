import { eq, notInArray } from "drizzle-orm";
import "../lib/db/load-env";
import { seedCatalog } from "../lib/db/seed-catalog";
import { db } from "../lib/db";
import { categories, productImages, products } from "../lib/db/schema";
import { cedisToPesewas } from "../lib/money";

async function main() {
  console.log("Syncing product catalog to database...\n");

  const categoryRows = await db.select().from(categories);
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c.id]));
  const catalogSlugs = seedCatalog.map((item) => item.id);

  let created = 0;
  let updated = 0;

  for (const item of seedCatalog) {
    const categoryId = categoryByName.get(item.category);
    if (!categoryId) {
      throw new Error(`Missing category for product: ${item.name}`);
    }

    const existing = await db.query.products.findFirst({
      where: eq(products.slug, item.id),
    });

    const values = {
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
    };

    let productId: string;

    if (existing) {
      await db
        .update(products)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(products.id, existing.id));
      productId = existing.id;
      updated++;
      console.log(`  UPD ${item.id}`);
    } else {
      const [inserted] = await db
        .insert(products)
        .values({
          slug: item.id,
          ...values,
        })
        .returning();
      productId = inserted.id;
      created++;
      console.log(`  NEW ${item.id}`);
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(productImages)
        .where(eq(productImages.productId, productId));
      await tx.insert(productImages).values(
        item.images.map((url, index) => ({
          productId,
          url,
          sortOrder: index,
        })),
      );
    });
  }

  const retired = await db
    .update(products)
    .set({
      inStock: false,
      stockQuantity: 0,
      updatedAt: new Date(),
    })
    .where(notInArray(products.slug, catalogSlugs))
    .returning({ slug: products.slug });

  if (retired.length > 0) {
    console.log("\nRetired old products (out of stock):");
    for (const row of retired) {
      console.log(`  OFF ${row.slug}`);
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
