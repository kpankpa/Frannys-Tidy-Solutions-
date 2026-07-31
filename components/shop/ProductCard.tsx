"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { useWhatsAppHelpers } from "@/components/providers/SiteConfigProvider";
import {
  activeProductBadge,
  formatPrice,
  isLowStock,
  type Product,
} from "@/lib/products";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { buildWhatsAppUrl, productOrderMessage } = useWhatsAppHelpers();
  const [added, setAdded] = useState(false);
  const badge = activeProductBadge(product.badge, product.badgeExpiresAt);

  function handleAdd() {
    if (!product.inStock) return;
    addItem(product.dbId, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article
      className={cn(
        "card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface soft-shadow",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
        <Link href={`/shop/${product.id}`}>
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized={shouldUnoptimizeImage(product.image)}
          />
        </Link>
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-highlight px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
            {badge}
          </span>
        ) : null}
        {product.inStock && isLowStock(product.stockQuantity) ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
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
            <p className="mt-1 line-clamp-1 text-xs text-muted">
              {product.description}
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
            {product.rating}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-base font-bold text-primary">
            {formatPrice(product.price)}
          </p>
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
              href={buildWhatsAppUrl(productOrderMessage(product.name))}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{added ? "Added" : "Order"}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
