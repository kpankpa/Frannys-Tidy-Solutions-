import { updateTag } from "next/cache";

/** Seconds — public marketing data (site settings, promos). */
export const SITE_CACHE_SECONDS = 300;

/** Seconds — shop catalog (products, categories, counts). */
export const CATALOG_CACHE_SECONDS = 120;

export const CACHE_TAGS = {
  site: "public:site",
  products: "public:products",
  categories: "public:categories",
} as const;

export function publicCacheControl(maxAge = CATALOG_CACHE_SECONDS) {
  const stale = maxAge * 5;
  return `public, s-maxage=${maxAge}, stale-while-revalidate=${stale}`;
}

/** Invalidate cached site settings after admin updates. */
export function revalidatePublicSiteCache() {
  updateTag(CACHE_TAGS.site);
}

/** Invalidate cached product catalog after admin product changes. */
export function revalidatePublicCatalogCache() {
  updateTag(CACHE_TAGS.products);
  updateTag(CACHE_TAGS.categories);
}

export function revalidateAllPublicCaches() {
  revalidatePublicSiteCache();
  revalidatePublicCatalogCache();
}
