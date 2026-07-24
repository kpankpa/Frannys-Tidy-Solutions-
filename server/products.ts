"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  createProduct,
  deleteProduct,
  toggleProductStock,
  updateProduct,
  type ProductInput,
} from "@/lib/db/products";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseImageUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const dbId = String(formData.get("dbId") ?? "").trim();
  const input: ProductInput = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    longDescription: String(formData.get("longDescription") ?? ""),
    features: parseFeatures(String(formData.get("features") ?? "")),
    priceCedis: Number(formData.get("priceCedis") ?? 0),
    categoryId: String(formData.get("categoryId") ?? ""),
    rating: Number(formData.get("rating") ?? 0),
    reviewsCount: Number(formData.get("reviewsCount") ?? 0),
    inStock: formData.get("inStock") === "on" || formData.get("inStock") === "true",
    badge: String(formData.get("badge") ?? "") || null,
    imageAlt: String(formData.get("imageAlt") ?? ""),
    imageUrls: parseImageUrls(String(formData.get("imageUrls") ?? "")),
  };

  if (!input.name || !input.categoryId || !input.priceCedis) {
    return { ok: false as const, error: "Name, category, and price are required." };
  }

  if (dbId) {
    await updateProduct(dbId, input);
  } else {
    await createProduct(input);
  }

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { ok: true as const };
}

export async function toggleStockAction(formData: FormData) {
  await requireAdmin();
  const dbId = String(formData.get("dbId") ?? "");
  if (!dbId) return;
  await toggleProductStock(dbId);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const dbId = String(formData.get("dbId") ?? "");
  if (!dbId) return;
  await deleteProduct(dbId);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}
