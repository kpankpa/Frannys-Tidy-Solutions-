export const BOOKING_PIPELINE = [
  { key: "requested", label: "Requested" },
  { key: "reviewed", label: "Reviewed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export type BookingStatusKey = (typeof BOOKING_PIPELINE)[number]["key"];

export function bookingStatusLabel(status: string): string {
  const key = status.trim().toLowerCase();
  const found = BOOKING_PIPELINE.find((step) => step.key === key);
  if (found) return found.label;
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
