/** Canonical order pipeline for checkout, track-order timeline, and fulfilment. */

export const ORDER_PIPELINE = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "awaiting_payment", label: "Awaiting Payment" },
  { key: "packaging", label: "Packaging" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

/** Admin can set any pipeline step plus cancelled. */
export const ORDER_ADMIN_STATUSES = [
  ...ORDER_PIPELINE,
  { key: "cancelled", label: "Cancelled" },
] as const;

export type OrderStatusKey = (typeof ORDER_PIPELINE)[number]["key"];
export type OrderAdminStatusKey = (typeof ORDER_ADMIN_STATUSES)[number]["key"];

export function normalizeOrderStatus(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function isOrderCancelled(status: string): boolean {
  return normalizeOrderStatus(status) === "cancelled";
}

export function orderStatusLabel(status: string): string {
  const key = normalizeOrderStatus(status);
  const found = ORDER_ADMIN_STATUSES.find((step) => step.key === key);
  if (found) return found.label;
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Timeline index for track-order. Cancelled is not a progress step. */
export function orderStatusIndex(status: string): number {
  const key = normalizeOrderStatus(status);
  if (key === "cancelled") return -1;
  const index = ORDER_PIPELINE.findIndex((step) => step.key === key);
  return index >= 0 ? index : 0;
}
