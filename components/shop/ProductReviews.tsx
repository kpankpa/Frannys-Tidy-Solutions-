"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { StarRating } from "@/components/shop/StarRating";
import { PendingSubmitButton } from "@/components/ui/PendingSubmitButton";
import { submitProductReviewAction } from "@/server/reviews";
import { SUBSECTION_TITLE_CLASS } from "@/lib/section-typography";

export type ProductReviewView = {
  id: string;
  authorName: string;
  comment: string;
  rating: number;
  createdAt: string;
};

type ProductReviewsProps = {
  productId: string;
  productSlug: string;
  reviews: ProductReviewView[];
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductReviews({
  productId,
  productSlug,
  reviews,
}: ProductReviewsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rating, setRating] = useState(5);

  function onSubmit(formData: FormData) {
    setError("");
    setSuccess("");
    formData.set("productId", productId);
    formData.set("productSlug", productSlug);
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = await submitProductReviewAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Thank you! Your review has been posted.");
      setRating(5);
      router.refresh();
    });
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className={SUBSECTION_TITLE_CLASS}>Customer reviews</h2>
      <p className="mt-2 text-sm text-muted">
        Share your experience with this product.
      </p>

      {reviews.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-[10px] border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground">
                  {review.authorName}
                </p>
                <time className="text-xs text-muted">
                  {formatReviewDate(review.createdAt)}
                </time>
              </div>
              <StarRating value={review.rating} size="sm" className="mt-2" />
              {review.comment.trim() ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {review.comment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted">
          No reviews yet. Be the first to rate this product.
        </p>
      )}

      <form action={onSubmit} className="mt-10 max-w-xl space-y-4">
        <h3 className="text-base font-semibold text-foreground">
          Write a review
        </h3>

        <label className="block">
          <span className="text-sm font-medium">Your name</span>
          <input
            name="authorName"
            required
            maxLength={80}
            disabled={pending}
            className={fieldClass}
            placeholder="How should we show your name?"
          />
        </label>

        <div>
          <span className="text-sm font-medium">Your rating</span>
          <div className="mt-2">
            <StarRating
              value={rating}
              interactive
              onChange={setRating}
              size="lg"
            />
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Comment (optional)</span>
          <textarea
            name="comment"
            rows={4}
            maxLength={2000}
            disabled={pending}
            placeholder="Tell others what you liked about this product."
            className={fieldClass}
          />
        </label>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}

        <PendingSubmitButton pendingLabel="Posting...">
          Post review
        </PendingSubmitButton>
      </form>
    </section>
  );
}
