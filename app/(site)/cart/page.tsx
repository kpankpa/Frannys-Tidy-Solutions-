"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/PageSpinner";
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from "@/lib/section-typography";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const {
    getLineItems,
    setQuantity,
    removeItem,
    subtotal,
    deliveryGuide,
    total,
    count,
    catalogReady,
  } = useCart();
  const lines = getLineItems();

  if (!catalogReady) {
    return <PageSpinner label="Loading your cart..." />;
  }

  if (count === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className={PAGE_TITLE_CLASS}>Your cart is empty</h1>
        <p className={PAGE_SUBTITLE_CLASS}>Browse our shop and add products to continue.</p>
        <Button href="/shop" className="mt-8">
          Go to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className={PAGE_TITLE_CLASS}>Shopping cart</h1>
      <p className={PAGE_SUBTITLE_CLASS}>
        Review your items before checkout. Delivery is confirmed on WhatsApp.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          {lines.map(({ product, quantity, lineTotal }) => (
            <div
              key={product.dbId}
              className="flex gap-4 rounded-[10px] border border-border bg-surface p-4 shadow-sm"
            >
              <Link
                href={`/shop/${product.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[8px]"
              >
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/shop/${product.id}`}
                      className="font-bold text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{product.category}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(product.dbId)}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-[8px] border border-border">
                    <button
                      type="button"
                      className="px-2.5 py-2"
                      onClick={() => setQuantity(product.dbId, quantity - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-2"
                      onClick={() => setQuantity(product.dbId, quantity + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-bold text-primary">{formatPrice(lineTotal)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[10px] border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-semibold text-muted">Agreed on WhatsApp</dd>
            </div>
            {deliveryGuide > 0 ? (
              <p className="text-xs text-muted">
                Typical delivery from {formatPrice(deliveryGuide)}. Final fee
                is confirmed with Frannys on WhatsApp.
              </p>
            ) : (
              <p className="text-xs text-muted">
                Delivery fee is confirmed with Frannys on WhatsApp.
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold">Items total</dt>
              <dd className="font-bold text-primary">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to Checkout
          </Button>
          <Button href="/shop" variant="outline" className="mt-3 w-full">
            Continue Shopping
          </Button>
        </aside>
      </div>
    </div>
  );
}
