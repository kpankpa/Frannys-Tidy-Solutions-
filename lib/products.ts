import { formatPriceFromCedis } from "./money";

/** Public product shape used by shop UI and cart. `id` is the URL slug. */
export type Product = {
  id: string;
  dbId: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  /** Price in Ghana cedis (UI). DB stores pesewas. */
  price: number;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  /** Units left in inventory. */
  stockQuantity: number;
  badge?: string;
  /** ISO date when badge should stop showing (optional). */
  badgeExpiresAt?: string | null;
  image: string;
  images: string[];
  imageAlt: string;
};

/** Active shop badge after expiry check. */
export function activeProductBadge(
  badge: string | undefined,
  badgeExpiresAt?: string | null,
): string | undefined {
  if (!badge?.trim()) return undefined;
  if (!badgeExpiresAt) return badge;
  const ends = new Date(badgeExpiresAt);
  if (Number.isNaN(ends.getTime())) return badge;
  if (ends.getTime() < Date.now()) return undefined;
  return badge;
}

/** At or below this count (while still > 0) counts as low stock. */
export const LOW_STOCK_THRESHOLD = 5;

export type ProductFilters = {
  category?: string;
  query?: string;
  maxPrice?: number;
  availability?: "all" | "in" | "out" | "low";
};

export function formatPrice(amount: number): string {
  return formatPriceFromCedis(amount);
}

export function isLowStock(stockQuantity: number): boolean {
  return stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD;
}
