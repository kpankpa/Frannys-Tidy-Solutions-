"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ProductReviews, type ProductReviewView } from "@/components/shop/ProductReviews";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";
import { ProductPrice } from "@/components/shop/ProductPrice";
import { StarRating } from "@/components/shop/StarRating";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { isLowStock, type Product } from "@/lib/products";
import {
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/lib/section-typography";

type ProductDetailProps = {
  product: Product;
  related: Product[];
  reviews: ProductReviewView[];
};

export function ProductDetail({ product, related, reviews }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
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

  function handleOrder() {
    if (!product.inStock) return;
    addItem(product.dbId, qty);
    router.push("/checkout");
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[12px] border border-border bg-surface-muted shadow-sm">
            <ProductImage
              src={gallery[activeImage] ?? product.image}
              alt={product.imageAlt}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              paddingClassName="p-6"
              hoverZoom
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-[8px] border-2 bg-surface-muted ${
                    activeImage === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt=""
                    sizes="120px"
                    paddingClassName="p-2"
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
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
            <StarRating value={product.rating} size="md" />
            <span className="font-semibold text-foreground">{product.rating}</span>
            <span>({product.reviews} review{product.reviews === 1 ? "" : "s"})</span>
          </div>
          <div className="mt-5">
            <ProductPrice
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg"
            />
          </div>
          {product.inStock && isLowStock(product.stockQuantity) ? (
            <p className="mt-2 text-sm font-semibold text-amber-700">
              Only {product.stockQuantity} left in stock
            </p>
          ) : null}
          {product.longDescription.trim() ? (
            <p className="mt-5 leading-relaxed text-muted">
              {product.longDescription}
            </p>
          ) : null}

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
            type="button"
            onClick={handleOrder}
            disabled={!product.inStock}
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

      <ProductReviews
        productId={product.dbId}
        productSlug={product.id}
        reviews={reviews}
      />

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
