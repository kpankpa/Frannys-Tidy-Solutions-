"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { formatPrice } from "@/lib/products";
import { isOrderCancelled, ORDER_PIPELINE } from "@/lib/order-status";
import { trackOrderAction, type TrackedOrderView } from "@/server/orders";
import { PAGE_SUBTITLE_CLASS, PAGE_TITLE_CLASS } from "@/lib/section-typography";
import { cn } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<TrackedOrderView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const response = await trackOrderAction({ orderNumber, phone });
    setLoading(false);

    if (!response.ok) {
      setError(response.error);
      return;
    }

    setResult(response.order);
  }

  const currentIndex = result?.statusIndex ?? -1;

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className={PAGE_TITLE_CLASS}>Track order</h1>
        <p className={PAGE_SUBTITLE_CLASS}>
          Enter your order number and the phone used at checkout.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-10 max-w-lg space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
      >
        <label className="block text-left">
          <span className="text-sm font-medium">Order Number</span>
          <input
            required
            placeholder="FTS-A1B2C3D4"
            className="mt-1.5 w-full rounded-[8px] border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </label>
        <label className="block text-left">
          <span className="text-sm font-medium">Phone Number</span>
          <input
            required
            type="tel"
            placeholder="0200928400"
            className="mt-1.5 w-full rounded-[8px] border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Looking up...
            </>
          ) : (
            "Track Order"
          )}
        </Button>
        {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
      </form>

      {result ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-[10px] border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Order {result.orderNumber}</p>
              <p className="text-lg font-bold text-foreground">{result.customer}</p>
              <p className="mt-1 text-sm text-muted">
                Items {formatPrice(result.subtotalCedis)}
                {result.deliveryCedis > 0
                  ? ` · Delivery ${formatPrice(result.deliveryCedis)} · Total ${formatPrice(result.totalCedis)}`
                  : " · Delivery to be confirmed on WhatsApp"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isOrderCancelled(result.status)
                  ? "bg-danger/15 text-danger"
                  : "bg-secondary/20 text-primary"
              }`}
            >
              {result.statusLabel}
            </span>
          </div>

          {isOrderCancelled(result.status) ? (
            <p className="mt-4 rounded-[8px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
              This order was cancelled. Contact us on WhatsApp if you need help
              placing a new order.
            </p>
          ) : null}

          <ul className="mt-5 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
            {result.lineItems.map((item) => (
              <li
                key={`${result.orderNumber}-${item.productId ?? item.name}-${item.quantity}`}
                className="w-40 shrink-0 snap-start overflow-hidden rounded-[8px] border border-border bg-surface-muted sm:w-44"
              >
                <div className="relative aspect-square w-full bg-surface">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">
                    x{item.quantity}
                  </span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">{item.category}</p>
                </div>
              </li>
            ))}
          </ul>

          <ol className="mt-8 space-y-0">
            {ORDER_PIPELINE.map((step, i) => {
              const done = i <= currentIndex;
              const event = result.events.find(
                (e) => e.status.toLowerCase().replace(/[\s-]+/g, "_") === step.key,
              );
              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                        done
                          ? "bg-primary text-white"
                          : "bg-surface-soft text-muted",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    {i < ORDER_PIPELINE.length - 1 ? (
                      <span
                        className={cn(
                          "my-1 w-0.5 flex-1 min-h-6",
                          i < currentIndex ? "bg-primary" : "bg-border",
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        done ? "text-foreground" : "text-muted",
                      )}
                    >
                      {step.label}
                    </p>
                    {event ? (
                      <p className="mt-1 text-xs text-muted">
                        Updated{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(event.createdAt))}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
