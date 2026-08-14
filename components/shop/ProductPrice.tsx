import { formatPrice, isProductOnSale, saleDiscountPercent } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const priceSize = {
  sm: "text-base",
  md: "text-base",
  lg: "text-3xl",
} as const;

const compareSize = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

export function ProductPrice({
  price,
  compareAtPrice,
  size = "md",
  className,
}: ProductPriceProps) {
  const product = { price, compareAtPrice };
  const onSale = isProductOnSale(product);
  const discount = saleDiscountPercent(product);

  if (!onSale) {
    return (
      <p className={cn("font-bold text-primary", priceSize[size], className)}>
        {formatPrice(price)}
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <p className={cn("font-bold text-primary", priceSize[size])}>
        {formatPrice(price)}
      </p>
      <p
        className={cn(
          "font-medium text-muted line-through decoration-muted/80",
          compareSize[size],
        )}
      >
        {formatPrice(compareAtPrice!)}
      </p>
      {discount != null && discount > 0 ? (
        <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
          -{discount}%
        </span>
      ) : null}
    </div>
  );
}
