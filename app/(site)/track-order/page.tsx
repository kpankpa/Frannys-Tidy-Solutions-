"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { demoOrders, orderStatuses, type OrderStatus } from "@/lib/services";
import { cn } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<(typeof demoOrders)[number] | null>(null);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = demoOrders.find(
      (o) =>
        o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
        o.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""),
    );
    if (!found) {
      setResult(null);
      setError(
        "Order not found. Try demo: FTS-1042 with phone 0200928400",
      );
      return;
    }
    setError("");
    setResult(found);
  }

  const currentIndex = result
    ? orderStatuses.indexOf(result.status as OrderStatus)
    : -1;

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Track Order
        </h1>
        <p className="mt-3 text-muted">
          Enter your order number and phone to see live progress.
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
            placeholder="FTS-1042"
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
        <Button type="submit" className="w-full" size="lg">
          Track Order
        </Button>
        {error ? <p className="text-center text-sm text-danger">{error}</p> : null}
      </form>

      {result ? (
        <div className="mx-auto mt-10 max-w-2xl rounded-[10px] border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Order {result.orderNumber}</p>
              <p className="text-lg font-bold text-foreground">{result.customer}</p>
            </div>
            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-primary">
              {result.status}
            </span>
          </div>

          <ul className="mt-5 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
            {result.lineItems.map((item) => (
              <li
                key={`${result.orderNumber}-${item.productId}`}
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
            {orderStatuses.map((status, i) => {
              const done = i <= currentIndex;
              return (
                <li key={status} className="flex gap-4">
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
                    {i < orderStatuses.length - 1 ? (
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
                      {status}
                    </p>
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
