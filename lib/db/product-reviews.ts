import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { productReviews, products } from "@/lib/db/schema";

export type ProductReviewItem = {
  id: string;
  authorName: string;
  comment: string;
  rating: number;
  createdAt: Date;
};

export async function listApprovedProductReviews(
  productId: string,
): Promise<ProductReviewItem[]> {
  const rows = await db
    .select({
      id: productReviews.id,
      authorName: productReviews.authorName,
      comment: productReviews.comment,
      rating: productReviews.rating,
      createdAt: productReviews.createdAt,
    })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.approved, true),
      ),
    )
    .orderBy(desc(productReviews.createdAt));

  return rows.map((row) => ({
    ...row,
    rating: Math.min(5, Math.max(1, row.rating)),
  }));
}

export async function listProductReviewsForAdmin(productId: string) {
  return db
    .select({
      id: productReviews.id,
      authorName: productReviews.authorName,
      comment: productReviews.comment,
      rating: productReviews.rating,
      approved: productReviews.approved,
      createdAt: productReviews.createdAt,
    })
    .from(productReviews)
    .where(eq(productReviews.productId, productId))
    .orderBy(desc(productReviews.createdAt));
}

export async function createProductReview(input: {
  productId: string;
  authorName: string;
  comment: string;
  rating: number;
}) {
  const authorName = input.authorName.trim();
  const comment = input.comment.trim();
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));

  if (!authorName) {
    throw new Error("Name is required.");
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Choose a rating from 1 to 5 stars.");
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, input.productId),
    columns: { id: true },
  });
  if (!product) {
    throw new Error("Product not found.");
  }

  const [created] = await db
    .insert(productReviews)
    .values({
      productId: input.productId,
      authorName,
      comment,
      rating,
      approved: true,
    })
    .returning();

  await refreshProductRatingStats(input.productId);
  return created;
}

export async function deleteProductReview(reviewId: string) {
  const review = await db.query.productReviews.findFirst({
    where: eq(productReviews.id, reviewId),
    columns: { id: true, productId: true },
  });
  if (!review) return null;

  await db.delete(productReviews).where(eq(productReviews.id, reviewId));
  await refreshProductRatingStats(review.productId);
  return review;
}

/** Recompute cached rating and review count from approved reviews. */
export async function refreshProductRatingStats(productId: string) {
  const stats = await db
    .select({
      count: sql<number>`count(*)::int`,
      average: sql<number>`coalesce(avg(${productReviews.rating}), 0)`,
    })
    .from(productReviews)
    .where(
      and(
        eq(productReviews.productId, productId),
        eq(productReviews.approved, true),
      ),
    );

  const count = stats[0]?.count ?? 0;
  const average = stats[0]?.average ?? 0;

  if (count === 0) {
    return;
  }

  const rounded = Math.round(average * 10) / 10;

  await db
    .update(products)
    .set({
      rating: String(rounded),
      reviewsCount: count,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));
}
