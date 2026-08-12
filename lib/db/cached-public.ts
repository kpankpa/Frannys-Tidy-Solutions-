import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  CACHE_TAGS,
  CATALOG_CACHE_SECONDS,
  SITE_CACHE_SECONDS,
} from "@/lib/cache";
import {
  countShopProducts,
  getProductBySlug,
  listCategories,
  listProducts,
} from "@/lib/db/products";
import { getSiteConfig, type SiteConfig } from "@/lib/db/settings";
import type { Product } from "@/lib/products";

const loadSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => getSiteConfig(),
  ["public-site-config"],
  {
    revalidate: SITE_CACHE_SECONDS,
    tags: [CACHE_TAGS.site],
  },
);

/** Cached site settings for public pages and APIs. */
export const getCachedSiteConfig = cache(loadSiteConfig);

const loadProductCatalog = unstable_cache(
  async (): Promise<Product[]> => listProducts(),
  ["public-product-catalog"],
  {
    revalidate: CATALOG_CACHE_SECONDS,
    tags: [CACHE_TAGS.products],
  },
);

/** Full in-stock catalog for shop, home, and cart API. */
export const getCachedProducts = cache(loadProductCatalog);

const loadCategories = unstable_cache(
  async () => listCategories(),
  ["public-product-categories"],
  {
    revalidate: CATALOG_CACHE_SECONDS,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.products],
  },
);

export const getCachedCategories = cache(loadCategories);

const loadShopProductCount = unstable_cache(
  async () => countShopProducts(),
  ["public-shop-product-count"],
  {
    revalidate: CATALOG_CACHE_SECONDS,
    tags: [CACHE_TAGS.products],
  },
);

export const getCachedShopProductCount = cache(loadShopProductCount);

export async function getCachedProductBySlug(
  slug: string,
): Promise<Product | null> {
  const fromCatalog = (await getCachedProducts()).find(
    (product) => product.id === slug,
  );
  if (fromCatalog) return fromCatalog;
  return getProductBySlug(slug);
}

export async function getCachedRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const all = await getCachedProducts();
  const current = all.find((product) => product.id === slug);
  if (!current) return all.slice(0, limit);

  return all
    .filter((product) => product.id !== slug && product.category === current.category)
    .concat(
      all.filter(
        (product) => product.id !== slug && product.category !== current.category,
      ),
    )
    .slice(0, limit);
}
