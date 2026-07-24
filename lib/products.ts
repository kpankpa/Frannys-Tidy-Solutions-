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
  badge?: string;
  image: string;
  images: string[];
  imageAlt: string;
};

export type ProductFilters = {
  category?: string;
  query?: string;
  maxPrice?: number;
  availability?: "all" | "in" | "out";
};

export function formatPrice(amount: number): string {
  return formatPriceFromCedis(amount);
}
