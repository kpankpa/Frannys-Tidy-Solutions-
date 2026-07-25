import { asc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, productImages, products } from "./schema";
import { pesewasToCedis, cedisToPesewas } from "../money";
import type { Product, ProductFilters } from "../products";

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;
type ImageRow = typeof productImages.$inferSelect;

type ProductWithRelations = ProductRow & {
  category: CategoryRow | null;
  images: ImageRow[];
};

export function mapDbProduct(row: ProductWithRelations): Product {
  const sortedImages = [...row.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const urls = sortedImages.map((img) => img.url);
  const fallback =
    "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80";

  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription,
    features: row.features ?? [],
    price: pesewasToCedis(row.pricePesewas),
    category: row.category?.name ?? "Uncategorized",
    rating: Number(row.rating),
    reviews: row.reviewsCount,
    inStock: row.inStock,
    badge: row.badge ?? undefined,
    image: urls[0] ?? fallback,
    images: urls.length > 0 ? urls : [fallback],
    imageAlt: row.imageAlt || row.name,
  };
}

export async function listCategories() {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    with: {
      category: true,
      images: true,
    },
    orderBy: [asc(products.name)],
  });

  let mapped = rows.map(mapDbProduct);

  if (filters.category && filters.category !== "All") {
    mapped = mapped.filter((p) => p.category === filters.category);
  }

  if (filters.maxPrice != null) {
    mapped = mapped.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.availability === "in") {
    mapped = mapped.filter((p) => p.inStock);
  } else if (filters.availability === "out") {
    mapped = mapped.filter((p) => !p.inStock);
  }

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    mapped = mapped.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  return mapped;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
      images: true,
    },
  });

  return row ? mapDbProduct(row) : null;
}

export async function getProductByDbId(id: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      images: true,
    },
  });

  return row ? mapDbProduct(row) : null;
}

/** @deprecated Prefer getProductBySlug. Kept for call sites that pass slug as id. */
export async function getProductById(id: string): Promise<Product | null> {
  const bySlug = await getProductBySlug(id);
  if (bySlug) return bySlug;
  return getProductByDbId(id);
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const current = await getProductBySlug(slug);
  const all = await listProducts();
  if (!current) return all.slice(0, limit);

  return all
    .filter((p) => p.id !== slug && p.category === current.category)
    .concat(all.filter((p) => p.id !== slug && p.category !== current.category))
    .slice(0, limit);
}

export async function countProducts() {
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  return result[0]?.count ?? 0;
}

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  priceCedis: number;
  categoryId: string;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  badge?: string | null;
  imageAlt: string;
  imageUrls: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductInput) {
  const slug = input.slug.trim() || slugify(input.name);

  const [created] = await db
    .insert(products)
    .values({
      slug,
      name: input.name.trim(),
      description: input.description.trim(),
      longDescription: input.longDescription.trim(),
      features: input.features,
      pricePesewas: cedisToPesewas(input.priceCedis),
      categoryId: input.categoryId,
      rating: String(input.rating ?? 0),
      reviewsCount: input.reviewsCount ?? 0,
      inStock: input.inStock,
      badge: input.badge || null,
      imageAlt: input.imageAlt.trim() || input.name.trim(),
    })
    .returning();

  if (input.imageUrls.length > 0) {
    await db.insert(productImages).values(
      input.imageUrls.map((url, index) => ({
        productId: created.id,
        url,
        sortOrder: index,
      })),
    );
  }

  return getProductByDbId(created.id);
}

export async function updateProduct(dbId: string, input: ProductInput) {
  const slug = input.slug.trim() || slugify(input.name);

  await db.transaction(async (tx) => {
    await tx
      .update(products)
      .set({
        slug,
        name: input.name.trim(),
        description: input.description.trim(),
        longDescription: input.longDescription.trim(),
        features: input.features,
        pricePesewas: cedisToPesewas(input.priceCedis),
        categoryId: input.categoryId,
        rating: String(input.rating ?? 0),
        reviewsCount: input.reviewsCount ?? 0,
        inStock: input.inStock,
        badge: input.badge || null,
        imageAlt: input.imageAlt.trim() || input.name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(products.id, dbId));

    await tx.delete(productImages).where(eq(productImages.productId, dbId));

    if (input.imageUrls.length > 0) {
      await tx.insert(productImages).values(
        input.imageUrls.map((url, index) => ({
          productId: dbId,
          url,
          sortOrder: index,
        })),
      );
    }
  });

  return getProductByDbId(dbId);
}

export async function toggleProductStock(dbId: string) {
  const current = await db.query.products.findFirst({
    where: eq(products.id, dbId),
  });
  if (!current) return null;

  await db
    .update(products)
    .set({ inStock: !current.inStock, updatedAt: new Date() })
    .where(eq(products.id, dbId));

  return getProductByDbId(dbId);
}

export async function deleteProduct(dbId: string) {
  await db.delete(products).where(eq(products.id, dbId));
}
