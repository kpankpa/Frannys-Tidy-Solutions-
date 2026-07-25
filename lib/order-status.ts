/** Canonical order pipeline for checkout, admin, and track-order. */

export const ORDER_PIPELINE = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "awaiting_payment", label: "Awaiting Payment" },
  { key: "packaging", label: "Packaging" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

export type OrderStatusKey = (typeof ORDER_PIPELINE)[number]["key"];

export function normalizeOrderStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function orderStatusLabel(status: string): string {
  const key = normalizeOrderStatus(status);
  const found = ORDER_PIPELINE.find((step) => step.key === key);
  if (found) return found.label;
  // Fallback: title-case the raw status
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function orderStatusIndex(status: string): number {
  const key = normalizeOrderStatus(status);
  const index = ORDER_PIPELINE.findIndex((step) => step.key === key);
  return index >= 0 ? index : 0;
}
