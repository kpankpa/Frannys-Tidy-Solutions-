import { asc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, productImages, products } from "./schema";
import { pesewasToCedis, cedisToPesewas } from "../money";
import {
  isLowStock,
  type Product,
  type ProductFilters,
} from "../products";

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
  const stockQuantity = Math.max(0, row.stockQuantity ?? 0);

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
    inStock: stockQuantity > 0,
    stockQuantity,
    badge: row.badge ?? undefined,
    badgeExpiresAt: row.badgeExpiresAt?.toISOString() ?? null,
    image: urls[0] ?? fallback,
    // Real stored URLs only (no fallback) so admin edit never invents images.
    images: urls,
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
  } else if (filters.availability === "low") {
    mapped = mapped.filter((p) => isLowStock(p.stockQuantity));
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
  stockQuantity: number;
  badge?: string | null;
  badgeExpiresAt?: string | null;
  imageAlt: string;
  imageUrls: string[];
};

function parseBadgeExpiry(raw?: string | null): Date | null {
  if (!raw?.trim()) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function normalizeStock(quantity: number) {
  const stockQuantity = Math.max(0, Math.floor(Number(quantity) || 0));
  return {
    stockQuantity,
    inStock: stockQuantity > 0,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductInput) {
  const slug = input.slug.trim() || slugify(input.name);
  const stock = normalizeStock(input.stockQuantity);

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
      inStock: stock.inStock,
      stockQuantity: stock.stockQuantity,
      badge: input.badge || null,
      badgeExpiresAt: parseBadgeExpiry(input.badgeExpiresAt),
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
  const stock = normalizeStock(input.stockQuantity);

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
        inStock: stock.inStock,
        stockQuantity: stock.stockQuantity,
        badge: input.badge || null,
        badgeExpiresAt: parseBadgeExpiry(input.badgeExpiresAt),
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

  const currentlyInStock = (current.stockQuantity ?? 0) > 0;
  const next = currentlyInStock
    ? { stockQuantity: 0, inStock: false }
    : { stockQuantity: Math.max(current.stockQuantity, 10), inStock: true };

  await db
    .update(products)
    .set({ ...next, updatedAt: new Date() })
    .where(eq(products.id, dbId));

  return getProductByDbId(dbId);
}

export async function deleteProduct(dbId: string) {
  await db.delete(products).where(eq(products.id, dbId));
}

export async function duplicateProduct(dbId: string) {
  const source = await getProductByDbId(dbId);
  if (!source) {
    throw new Error("Product not found.");
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.name, source.category),
  });
  if (!category) {
    throw new Error("Product category is missing.");
  }

  const baseSlug = `${source.id}-copy`;
  let slug = baseSlug;
  let attempt = 2;
  while (await getProductBySlug(slug)) {
    slug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }

  return createProduct({
    name: `${source.name} (copy)`,
    slug,
    description: source.description,
    longDescription: source.longDescription,
    features: source.features,
    priceCedis: source.price,
    categoryId: category.id,
    rating: source.rating,
    reviewsCount: source.reviews,
    stockQuantity: source.stockQuantity,
    badge: source.badge ?? null,
    badgeExpiresAt: source.badgeExpiresAt,
    imageAlt: source.imageAlt,
    imageUrls: source.images,
  });
}

export async function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const slug = slugify(trimmed);
  const [created] = await db
    .insert(categories)
    .values({ name: trimmed, slug })
    .returning();
  return created;
}

export async function renameCategory(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const [updated] = await db
    .update(categories)
    .set({
      name: trimmed,
      slug: slugify(trimmed),
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();
  return updated;
}

export async function deleteCategory(id: string) {
  const inUse = await db.query.products.findFirst({
    where: eq(products.categoryId, id),
  });
  if (inUse) {
    throw new Error("Move or delete products in this category first.");
  }
  await db.delete(categories).where(eq(categories.id, id));
}
