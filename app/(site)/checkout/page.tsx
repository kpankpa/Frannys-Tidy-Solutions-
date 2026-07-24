"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import {
  buildWhatsAppUrl,
  checkoutWhatsAppMessage,
} from "@/lib/constants";
import { formatPrice } from "@/lib/products";

const field =
  "mt-1.5 w-full rounded-[16px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function CheckoutPage() {
  const router = useRouter();
  const { getLineItems, subtotal, delivery, total, count, clear } = useCart();
  const lines = getLineItems();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  if (count === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-bold">Nothing to checkout</h1>
        <Button href="/shop" className="mt-6">
          Browse Shop
        </Button>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = checkoutWhatsAppMessage({
      ...form,
      items: lines.map((l) => ({
        name: l.product.name,
        qty: l.quantity,
        price: l.product.price,
      })),
      subtotal,
      delivery,
      total,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    clear();
    router.push("/track-order");
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        WhatsApp Checkout
      </h1>
      <p className="mt-2 text-muted">
        Confirm your details and we&apos;ll open WhatsApp with your order ready
        to send.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-bold text-foreground">
            Customer Information
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="text-sm font-medium">Name</span>
              <input
                required
                className={field}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="text-sm font-medium">Phone</span>
              <input
                required
                type="tel"
                className={field}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Delivery Address</span>
              <input
                required
                className={field}
                placeholder="Street, suburb, city"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Notes</span>
              <textarea
                rows={4}
                className={field}
                placeholder="Landmarks, preferred delivery time..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>
          <Button type="submit" variant="whatsapp" size="lg" className="mt-6 w-full">
            <MessageCircle className="h-5 w-5" />
            Complete Order on WhatsApp
          </Button>
        </form>

        <aside className="h-fit rounded-[20px] border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold">Summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted">
                  {product.name} x {quantity}
                </span>
                <span className="font-semibold">{formatPrice(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-semibold">{formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt className="font-bold">Grand Total</dt>
              <dd className="font-bold text-primary">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
