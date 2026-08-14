"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react";
import { ProductImage } from "@/components/shop/ProductImage";
import { ProductPrice } from "@/components/shop/ProductPrice";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import {
  activeProductBadge,
  isLowStock,
  type Product,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const badge = activeProductBadge(product.badge, product.badgeExpiresAt);

  function handleAdd() {
    if (!product.inStock) return;
    addItem(product.dbId, 1);
  }

  function handleOrder() {
    if (!product.inStock) return;
    addItem(product.dbId, 1);
    router.push("/checkout");
  }

  return (
    <article
      className={cn(
        "card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface soft-shadow",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <Link href={`/shop/${product.id}`} className="absolute inset-0">
          <ProductImage
            src={product.image}
            alt={product.imageAlt}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            hoverZoom
          />
        </Link>
        {badge ? (
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-highlight px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
            {badge}
          </span>
        ) : null}
        {product.inStock && isLowStock(product.stockQuantity) ? (
          <span className="absolute bottom-3 left-3 z-[1] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
            Only {product.stockQuantity} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/shop/${product.id}`}>
              <h3 className="truncate text-sm font-semibold text-primary transition group-hover:text-primary-dark">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {product.description}
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
            {product.rating}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <ProductPrice
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              aria-label="Add to cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <Button
              type="button"
              onClick={handleOrder}
              disabled={!product.inStock}
              variant="whatsapp"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Order</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
