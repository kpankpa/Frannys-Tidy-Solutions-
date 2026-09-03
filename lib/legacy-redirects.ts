/**
 * Permanent redirects for URLs Google still crawls from the old static site.
 * Keep in sync with Search Console "Not found" / legacy URL reports.
 */

type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: Array<{ type: "query"; key: string; value: string }>;
};

/** Old /product-detail?fn=... values mapped to current /shop slugs. */
const LEGACY_PRODUCT_FN: Record<string, string> = {
  floor_cleaner_3052025: "/shop/multi-purpose-bleach",
  glass_cleaners_2052025: "/shop/glass-cleaner",
};

/** Old blog posts removed during the Next.js rebuild. */
const LEGACY_BLOG_FN: Record<string, string> = {
  keep_your_home_tidy_661900421: "/about",
  "7_daily_hygiene_habits_299840782": "/services",
  frannys_clean_talk_826208389: "/about",
};

export function buildLegacyRedirects(): LegacyRedirect[] {
  const redirects: LegacyRedirect[] = [];

  for (const [fn, destination] of Object.entries(LEGACY_PRODUCT_FN)) {
    redirects.push({
      source: "/product-detail",
      has: [{ type: "query", key: "fn", value: fn }],
      destination,
      permanent: true,
    });
  }

  for (const [fn, destination] of Object.entries(LEGACY_BLOG_FN)) {
    redirects.push({
      source: "/blog-detail",
      has: [{ type: "query", key: "fn", value: fn }],
      destination,
      permanent: true,
    });
  }

  redirects.push(
    { source: "/index", destination: "/", permanent: true },
    { source: "/index.html", destination: "/", permanent: true },
    { source: "/products", destination: "/shop", permanent: true },
    { source: "/products/:path*", destination: "/shop/:path*", permanent: true },
    { source: "/blog", destination: "/about", permanent: true },
    { source: "/blog/:path*", destination: "/about", permanent: true },
    { source: "/blog-detail", destination: "/about", permanent: true },
    { source: "/product-detail", destination: "/shop", permanent: true },
  );

  return redirects;
}
