"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicCatalogCache } from "@/lib/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createProductReview,
  deleteProductReview,
} from "@/lib/db/product-reviews";
import { getProductByDbId } from "@/lib/db/products";
import { clampText } from "@/lib/validation";

export async function submitProductReviewAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const productSlug = String(formData.get("productSlug") ?? "").trim();
  const authorName = clampText(String(formData.get("authorName") ?? ""), 80);
  const comment = clampText(String(formData.get("comment") ?? ""), 2000);
  const rating = Number(formData.get("rating") ?? 0);

  if (!productId) {
    return { ok: false as const, error: "Product not found." };
  }
  if (!authorName) {
    return { ok: false as const, error: "Please enter your name." };
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false as const, error: "Please choose a star rating." };
  }

  try {
    await createProductReview({
      productId,
      authorName,
      comment,
      rating,
    });

    revalidatePublicCatalogCache();
    if (productSlug) {
      revalidatePath(`/shop/${productSlug}`);
    }

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Could not submit review.",
    };
  }
}

export async function deleteProductReviewAction(formData: FormData) {
  await requireAdmin();

  const reviewId = String(formData.get("reviewId") ?? "").trim();
  const productDbId = String(formData.get("productDbId") ?? "").trim();

  if (!reviewId) return;

  await deleteProductReview(reviewId);
  revalidatePublicCatalogCache();

  const product = productDbId ? await getProductByDbId(productDbId) : null;
  if (product?.id) {
    revalidatePath(`/shop/${product.id}`);
  }
  revalidatePath("/admin/products");
  if (productDbId) {
    revalidatePath(`/admin/products/${productDbId}`);
  }
}
