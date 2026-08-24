"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { ORDER_ADMIN_STATUSES } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";
import { LIMITS } from "@/lib/validation";
import { createManualOrderAction } from "@/server/admin";

export type NewOrderProductOption = {
  dbId: string;
  name: string;
  category: string;
  unitPriceCedis: number;
  stockQuantity: number;
};

type OrderLine = {
  key: number;
  productId: string;
  quantity: number;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

let nextLineKey = 1;

export function NewOrderForm({
  products,
  defaultDeliveryFeeCedis,
}: {
  /** In-stock products only. Out-of-stock items cannot be ordered. */
  products: NewOrderProductOption[];
  defaultDeliveryFeeCedis: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [deliveryFeeDraft, setDeliveryFeeDraft] = useState(
    String(defaultDeliveryFeeCedis),
  );

  const productById = useMemo(() => {
    const map = new Map<string, NewOrderProductOption>();
    for (const product of products) {
      map.set(product.dbId, product);
    }
    return map;
  }, [products]);

  function addLine() {
    if (products.length === 0) return;
    setLines((prev) => {
      // Default the new line to the first product not already on the order.
      const firstFree =
        products.find((p) => !prev.some((line) => line.productId === p.dbId)) ??
        products[0];
      if (!firstFree) return prev;
      return [
        ...prev,
        { key: nextLineKey++, productId: firstFree.dbId, quantity: 1 },
      ];
    });
  }

  function updateLine(key: number, patch: Partial<OrderLine>) {
    setLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    );
  }

  function changeLineProduct(line: OrderLine, productId: string) {
    // Reset quantity so it cannot exceed the newly picked product's stock.
    updateLine(line.key, { productId, quantity: 1 });
  }

  function changeLineQuantity(line: OrderLine, rawQuantity: number) {
    const product = productById.get(line.productId);
    // Quantity is clamped to what is actually in stock.
    const maxStock = product?.stockQuantity ?? 0;
    const clamped = Math.min(maxStock, Math.max(1, Math.floor(rawQuantity)));
    updateLine(line.key, { quantity: clamped });
  }

  function removeLine(key: number) {
    setLines((prev) => prev.filter((line) => line.key !== key));
  }

  const deliveryFeeCedis = Number(deliveryFeeDraft) || 0;

  const subtotalCedis = lines.reduce((sum, line) => {
    const product = productById.get(line.productId);
    if (!product) return sum;
    return sum + product.unitPriceCedis * line.quantity;
  }, 0);

  const stockProblem = lines.some((line) => {
    const product = productById.get(line.productId);
    if (!product) return true;
    return (
      line.quantity < 1 ||
      !Number.isInteger(line.quantity) ||
      line.quantity > product.stockQuantity
    );
  });

  function onSubmit(formData: FormData) {
    setError("");
    if (lines.length === 0) {
      setError("Add at least one product to the order.");
      return;
    }
    if (stockProblem) {
      setError("Fix quantities first. Each line must be between 1 and the stock available.");
      return;
    }
    startTransition(async () => {
      const result = await createManualOrderAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/orders/${result.orderNumber}`);
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Customer name</span>
          <input
            name="name"
            required
            maxLength={LIMITS.name}
            placeholder="Ama Mensah"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Phone number</span>
          <input
            name="phone"
            required
            maxLength={LIMITS.phone}
            placeholder="0201234567"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Delivery address</span>
        <textarea
          name="address"
          required
          rows={2}
          maxLength={LIMITS.address}
          placeholder="House number, street, area, city"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={LIMITS.notes}
          placeholder="Optional. Landmark, preferred delivery time, etc."
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Starting status</span>
          <select name="status" defaultValue="confirmed" className={fieldClass}>
            {ORDER_ADMIN_STATUSES.map((step) => (
              <option key={step.key} value={step.key}>
                {step.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-muted">
            Phone orders usually start as Confirmed.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Delivery fee (GH₵)</span>
          <input
            name="deliveryFeeCedis"
            type="number"
            step="0.01"
            min="0"
            value={deliveryFeeDraft}
            onChange={(event) => setDeliveryFeeDraft(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="space-y-3 rounded-[8px] border border-border bg-surface-muted/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Products</p>
            <p className="mt-0.5 text-xs text-muted">
              Out-of-stock products are hidden. Quantities are capped at stock
              and re-checked when saving.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || products.length === 0}
            onClick={addLine}
          >
            <Plus className="h-3.5 w-3.5" />
            Add product
          </Button>
        </div>

        {products.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-muted">
            No in-stock products available right now.
          </p>
        ) : lines.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-muted">
            No products yet. Use Add product to build the order.
          </p>
        ) : (
          <ul className="space-y-2">
            {lines.map((line) => {
              const product = productById.get(line.productId);
              if (!product) return null;
              const selectableProducts = [
                ...(productById.get(line.productId)
                  ? [product]
                  : []),
                ...products.filter(
                  (candidate) =>
                    candidate.dbId !== line.productId &&
                    !lines.some(
                      (other) =>
                        other.key !== line.key &&
                        other.productId === candidate.dbId,
                    ),
                ),
              ];
              return (
                <li
                  key={line.key}
                  className="flex flex-wrap items-center gap-2 rounded-[8px] border border-border bg-surface p-3"
                >
                  <input type="hidden" name="productId" value={line.productId} />
                  <input
                    type="hidden"
                    name="quantity"
                    value={Math.max(1, Math.floor(line.quantity))}
                  />
                  <select
                    value={line.productId}
                    onChange={(event) =>
                      changeLineProduct(line, event.target.value)
                    }
                    aria-label={`Product for line ${line.key}`}
                    disabled={pending}
                    className="min-w-[12rem] flex-1 rounded-[8px] border border-border px-2 py-2 text-sm"
                  >
                    {selectableProducts.map((option) => (
                      <option key={option.dbId} value={option.dbId}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-right">
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={line.quantity}
                      onChange={(event) =>
                        changeLineQuantity(
                          line,
                          Math.floor(Number(event.target.value) || 0),
                        )
                      }
                      aria-label={`Quantity for ${product.name}`}
                      className="w-20 rounded-[8px] border border-border px-2 py-1.5 text-sm"
                    />
                    <p className="mt-0.5 text-[11px] text-muted">
                      {product.stockQuantity} in stock
                    </p>
                  </div>
                  <span className="w-24 text-right text-sm font-semibold">
                    {formatPrice(product.unitPriceCedis * line.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    disabled={pending}
                    className="rounded p-1.5 text-danger hover:bg-danger/10"
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <dl className="space-y-1 rounded-[8px] border border-border bg-surface px-4 py-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(subtotalCedis)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery fee</dt>
          <dd>{formatPrice(deliveryFeeCedis)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-1 font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(subtotalCedis + deliveryFeeCedis)}</dd>
        </div>
      </dl>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={pending || lines.length === 0 || stockProblem}
          className="w-full sm:w-auto"
        >
          {pending ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Creating...
            </>
          ) : (
            "Create order"
          )}
        </Button>
        <Button href="/admin/orders" variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  );
}
