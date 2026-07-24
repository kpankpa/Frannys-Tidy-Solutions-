"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/constants";
import { formatPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article
      className={cn(
        "card-lift group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-sm",
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
          />
        </Link>
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWishlisted((v) => !v)}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart
            className={cn("h-4 w-4", wishlisted && "fill-danger text-danger")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-secondary">{product.category}</p>
        <Link href={`/shop/${product.id}`} className="mt-1">
          <h3 className="text-base font-bold text-foreground transition group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
          {product.description}
        </p>
        <p className="mt-4 text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>

        <div className="mt-4 grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button href={`/shop/${product.id}`} variant="outline" size="sm">
              Quick View
            </Button>
            <Button type="button" size="sm" onClick={handleAdd}>
              <ShoppingCart className="h-4 w-4" />
              {added ? "Added" : "Add"}
            </Button>
          </div>
          <Button
            href={buildWhatsAppUrl(productOrderMessage(product.name))}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Order
          </Button>
        </div>
      </div>
    </article>
  );
}
