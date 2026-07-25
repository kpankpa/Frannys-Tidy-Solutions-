"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createProduct,
  deleteProduct,
  getProductByDbId,
  toggleProductStock,
  updateProduct,
  type ProductInput,
} from "@/lib/db/products";
import { clampText, sanitizeImageUrlList } from "@/lib/validation";

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((line) => clampText(line, 160));
}

function parseImageUrls(raw: string): string[] {
  return sanitizeImageUrlList(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8),
  );
}

function revalidateProductPaths(slug?: string | null) {
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const dbId = String(formData.get("dbId") ?? "").trim();
  const priceCedis = Number(formData.get("priceCedis") ?? 0);
  const rating = Math.min(5, Math.max(0, Number(formData.get("rating") ?? 0)));
  const reviewsCount = Math.max(
    0,
    Math.floor(Number(formData.get("reviewsCount") ?? 0)),
  );

  const input: ProductInput = {
    name: clampText(String(formData.get("name") ?? ""), 120),
    slug: clampText(String(formData.get("slug") ?? ""), 140),
    description: clampText(String(formData.get("description") ?? ""), 400),
    longDescription: clampText(
      String(formData.get("longDescription") ?? ""),
      4000,
    ),
    features: parseFeatures(String(formData.get("features") ?? "")),
    priceCedis,
    categoryId: String(formData.get("categoryId") ?? ""),
    rating,
    reviewsCount,
    inStock: formData.get("inStock") === "on" || formData.get("inStock") === "true",
    badge: clampText(String(formData.get("badge") ?? ""), 40) || null,
    imageAlt: clampText(String(formData.get("imageAlt") ?? ""), 160),
    imageUrls: parseImageUrls(String(formData.get("imageUrls") ?? "")),
  };

  if (!input.name || !input.categoryId || !Number.isFinite(priceCedis) || priceCedis <= 0) {
    return {
      ok: false as const,
      error: "Name, category, and a valid price are required.",
    };
  }

  if (input.imageUrls.length === 0) {
    return {
      ok: false as const,
      error:
        "Add at least one image: upload a file or use an Unsplash https URL.",
    };
  }

  const previous = dbId ? await getProductByDbId(dbId) : null;

  try {
    const saved = dbId
      ? await updateProduct(dbId, input)
      : await createProduct(input);

    revalidateProductPaths(previous?.id);
    revalidateProductPaths(saved?.id);
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    if (message.toLowerCase().includes("unique") || message.includes("23505")) {
      return { ok: false as const, error: "That slug is already in use." };
    }
    return { ok: false as const, error: "Could not save product. Check your inputs." };
  }
}

export async function toggleStockAction(formData: FormData) {
  await requireAdmin();
  const dbId = String(formData.get("dbId") ?? "");
  if (!dbId) return;
  const updated = await toggleProductStock(dbId);
  revalidateProductPaths(updated?.id);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const dbId = String(formData.get("dbId") ?? "");
  if (!dbId) return;
  const existing = await getProductByDbId(dbId);
  try {
    await deleteProduct(dbId);
    revalidateProductPaths(existing?.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("foreign key") || message.includes("23503")) {
      throw new Error(
        "This product is linked to past orders and could not be deleted. Mark it out of stock instead.",
      );
    }
    throw error;
  }
}
