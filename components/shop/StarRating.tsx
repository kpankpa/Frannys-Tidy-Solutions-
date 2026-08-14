"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
};

const sizeClass = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const rounded = Math.min(max, Math.max(0, value));

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${rounded} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= Math.round(rounded);

        if (interactive && onChange) {
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={starValue === Math.round(rounded)}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              onClick={() => onChange(starValue)}
              className="rounded p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Star
                className={cn(
                  sizeClass[size],
                  filled
                    ? "fill-highlight text-highlight"
                    : "fill-transparent text-border",
                )}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            className={cn(
              sizeClass[size],
              filled
                ? "fill-highlight text-highlight"
                : "fill-transparent text-border",
            )}
          />
        );
      })}
    </div>
  );
}
