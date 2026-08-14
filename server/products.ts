"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicCatalogCache } from "@/lib/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  getProductByDbId,
  toggleProductStock,
  updateProduct,
  createCategory,
  renameCategory,
  deleteCategory,
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

function parseImageUrls(raw: string): {
  urls: string[];
  rejected: string[];
} {
  return sanitizeImageUrlList(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 20),
  );
}

function revalidateProductPaths(slug?: string | null) {
  revalidatePublicCatalogCache();
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
  const salePriceRaw = String(formData.get("salePriceCedis") ?? "").trim();
  const salePriceCedis =
    salePriceRaw === "" ? null : Number(salePriceRaw);
  const stockQuantity = Math.max(
    0,
    Math.floor(Number(formData.get("stockQuantity") ?? 0)),
  );

  const parsedImages = parseImageUrls(String(formData.get("imageUrls") ?? ""));
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
    salePriceCedis,
    categoryId: String(formData.get("categoryId") ?? ""),
    stockQuantity,
    badge: clampText(String(formData.get("badge") ?? ""), 40) || null,
    badgeExpiresAt: String(formData.get("badgeExpiresAt") ?? "").trim() || null,
    imageAlt: clampText(String(formData.get("imageAlt") ?? ""), 160),
    imageUrls: parsedImages.urls,
  };

  if (!input.name || !input.categoryId || !Number.isFinite(priceCedis) || priceCedis <= 0) {
    return {
      ok: false as const,
      error: "Name, category, and a valid price are required.",
    };
  }

  if (
    salePriceCedis != null &&
    (!Number.isFinite(salePriceCedis) ||
      salePriceCedis <= 0 ||
      salePriceCedis >= priceCedis)
  ) {
    return {
      ok: false as const,
      error: "Sale price must be greater than 0 and less than the regular price.",
    };
  }

  if (input.imageUrls.length === 0) {
    const hint =
      parsedImages.rejected.length > 0
        ? ` ${parsedImages.rejected.length} URL(s) were rejected. Upload a file or paste a https image link.`
        : " Upload a file or paste a https image URL.";
    return {
      ok: false as const,
      error: `Add at least one image.${hint}`,
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
        "This product could not be deleted because of linked records. Mark it out of stock instead.",
      );
    }
    throw error;
  }
}

export async function duplicateProductAction(formData: FormData) {
  await requireAdmin();
  const dbId = String(formData.get("dbId") ?? "");
  if (!dbId) {
    return { ok: false as const, error: "Missing product." };
  }
  try {
    const copy = await duplicateProduct(dbId);
    revalidateProductPaths(copy?.id);
    return { ok: true as const, id: copy?.dbId ?? "" };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Could not duplicate.",
    };
  }
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = clampText(String(formData.get("name") ?? ""), 80);
  if (!name) {
    return { ok: false as const, error: "Enter a category name." };
  }
  try {
    await createCategory(name);
    revalidatePublicCatalogCache();
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("unique") || message.includes("23505")) {
      return { ok: false as const, error: "That category already exists." };
    }
    return { ok: false as const, error: "Could not create category." };
  }
}

export async function renameCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = clampText(String(formData.get("name") ?? ""), 80);
  if (!id || !name) {
    return { ok: false as const, error: "Name is required." };
  }
  try {
    await renameCategory(id, name);
    revalidatePublicCatalogCache();
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("unique") || message.includes("23505")) {
      return { ok: false as const, error: "That category name is taken." };
    }
    return { ok: false as const, error: "Could not rename category." };
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false as const, error: "Missing category." };
  try {
    await deleteCategory(id);
    revalidatePublicCatalogCache();
    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Could not delete category.",
    };
  }
}
