"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PageSpinner, Spinner } from "@/components/ui/PageSpinner";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { useWhatsAppHelpers } from "@/components/providers/SiteConfigProvider";
import { formatPrice } from "@/lib/products";
import { placeOrderAction } from "@/server/orders";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function CheckoutPage() {
  const {
    getLineItems,
    subtotal,
    deliveryGuide,
    count,
    clear,
    catalogReady,
    items,
  } = useCart();
  const { buildWhatsAppUrl } = useWhatsAppHelpers();
  const lines = getLineItems();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    orderNumber: string;
    whatsappUrl: string;
  } | null>(null);

  if (!catalogReady) {
    return <PageSpinner label="Loading your cart..." />;
  }

  if (success) {
    return (
      <div className="container-page py-16 text-center sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Order placed
        </h1>
        <p className="mt-2 text-lg font-semibold text-primary">
          {success.orderNumber}
        </p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Your order is saved. Send the WhatsApp message to confirm with Frannys,
          then track progress anytime.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href={success.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Open WhatsApp
          </Button>
          <Button href="/track-order" variant="outline" size="lg">
            Track Order
          </Button>
        </div>
        <Button href="/shop" variant="ghost" className="mt-4">
          Continue shopping
        </Button>
      </div>
    );
  }

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

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-bold">Cart items unavailable</h1>
        <p className="mt-3 text-muted">
          Some products could not be loaded. Please refresh or return to the shop.
        </p>
        <Button href="/shop" className="mt-6">
          Browse Shop
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await placeOrderAction({
      name: form.name,
      phone: form.phone,
      address: form.address,
      notes: form.notes,
      website: form.website,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const whatsappUrl = buildWhatsAppUrl(result.whatsappMessage);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    clear();
    setSuccess({
      orderNumber: result.orderNumber,
      whatsappUrl,
    });
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Checkout
      </h1>
      <p className="mt-2 text-muted">
        Confirm your details. We save your order, then open WhatsApp so you can
        agree delivery and payment with Frannys.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border border-border bg-surface p-6 shadow-sm sm:p-8"
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
            {/* Honeypot for bots — keep empty */}
            <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
              <span>Website</span>
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 text-sm text-danger">{error}</p>
          ) : null}

          <Button
            type="submit"
            variant="whatsapp"
            size="lg"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting ? (
              <Spinner size="sm" className="border-white/30 border-t-white" />
            ) : (
              <WhatsAppIcon className="h-5 w-5" />
            )}
            {submitting ? "Placing order..." : "Complete Order on WhatsApp"}
          </Button>
        </form>

        <aside className="h-fit rounded-[10px] border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold">Summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.dbId} className="flex justify-between gap-3 text-sm">
                <span className="text-muted">
                  {product.name} x {quantity}
                </span>
                <span className="font-semibold">{formatPrice(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Items subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-semibold text-muted">Agreed on WhatsApp</dd>
            </div>
            {deliveryGuide > 0 ? (
              <p className="text-xs text-muted">
                Typical delivery from {formatPrice(deliveryGuide)}. Final fee
                depends on your location and is confirmed in chat.
              </p>
            ) : null}
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold">Pay now (items only)</dt>
              <dd className="font-bold text-primary">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
