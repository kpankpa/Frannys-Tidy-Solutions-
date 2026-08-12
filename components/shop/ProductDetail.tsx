"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { useWhatsAppHelpers } from "@/components/providers/SiteConfigProvider";
import { formatPrice, isLowStock, type Product } from "@/lib/products";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import {
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/lib/section-typography";

type ProductDetailProps = {
  product: Product;
  related: Product[];
};

export function ProductDetail({ product, related }: ProductDetailProps) {
  const { addItem } = useCart();
  const { buildWhatsAppUrl, productOrderMessage } = useWhatsAppHelpers();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const gallery =
    product.images.length > 0 ? product.images : [product.image];
  const maxQty = Math.max(1, product.stockQuantity || 1);
  const keyFeatures = product.features.filter(
    (feature) => !feature.startsWith("Ideal for:"),
  );
  const idealForLine = product.features.find((feature) =>
    feature.startsWith("Ideal for:"),
  );
  const idealFor = idealForLine?.replace(/^Ideal for:\s*/, "");

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[12px] border border-border bg-surface shadow-sm">
            <Image
              src={gallery[activeImage] ?? product.image}
              alt={product.imageAlt}
              fill
              className="object-cover transition duration-300 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized={shouldUnoptimizeImage(
                gallery[activeImage] ?? product.image,
              )}
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-[8px] border-2 ${
                    activeImage === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={shouldUnoptimizeImage(img)}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className={`${SECTION_SUBTITLE_CLASS} mt-2`}>{product.category}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Star className="h-4 w-4 fill-highlight text-highlight" />
            <span className="font-semibold text-foreground">{product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
          <p className="mt-5 text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          {product.inStock && isLowStock(product.stockQuantity) ? (
            <p className="mt-2 text-sm font-semibold text-amber-700">
              Only {product.stockQuantity} left in stock
            </p>
          ) : null}
          <p className="mt-5 leading-relaxed text-muted">{product.longDescription}</p>

          {keyFeatures.length > 0 ? (
            <div className="mt-6">
              <h2 className={SUBSECTION_TITLE_CLASS}>Key features</h2>
              <ul className="mt-3 space-y-2">
                {keyFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {idealFor ? (
            <div className="mt-6">
              <h2 className={SUBSECTION_TITLE_CLASS}>Ideal for</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{idealFor}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-[8px] border border-border bg-surface">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="px-3 py-3 text-foreground"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="px-3 py-3 text-foreground"
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={() => addItem(product.dbId, qty)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          <Button
            href={buildWhatsAppUrl(productOrderMessage(product.name, qty))}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="mt-3 w-full sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order
          </Button>

          <p className="mt-4 text-sm text-muted">
            Looking for something else?{" "}
            <Link href="/shop" className="font-semibold text-primary hover:underline">
              Browse all products
            </Link>
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-16">
          <h2 className={SECTION_TITLE_CLASS}>Related products</h2>
          <p className={SECTION_SUBTITLE_CLASS}>
            More detergents and cleaning solutions from Frannys
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
