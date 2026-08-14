import { Trash2 } from "lucide-react";
import { StarRating } from "@/components/shop/StarRating";
import { deleteProductReviewAction } from "@/server/reviews";
import { listProductReviewsForAdmin } from "@/lib/db/product-reviews";

type ProductReviewAdminListProps = {
  productDbId: string;
};

export async function ProductReviewAdminList({
  productDbId,
}: ProductReviewAdminListProps) {
  const reviews = await listProductReviewsForAdmin(productDbId);

  return (
    <div className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold">Customer reviews</h2>
        <p className="mt-1 text-sm text-muted">
          Reviews from the shop product page. Deleting one updates the product
          rating automatically.
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted">No customer reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-[8px] border border-border bg-surface-muted/40 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{review.authorName}</p>
                <StarRating value={review.rating} size="sm" className="mt-1" />
                {review.comment.trim() ? (
                  <p className="mt-2 text-sm text-muted">{review.comment}</p>
                ) : (
                  <p className="mt-2 text-xs italic text-muted">No comment</p>
                )}
                <p className="mt-2 text-xs text-muted">
                  {review.createdAt.toLocaleDateString("en-GH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <form action={deleteProductReviewAction}>
                <input type="hidden" name="reviewId" value={review.id} />
                <input type="hidden" name="productDbId" value={productDbId} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
