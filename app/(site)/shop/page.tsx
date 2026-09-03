import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { PageHeroTitle } from "@/components/ui/PageHeroTitle";
import {
  getCachedCategories,
  getCachedProducts,
  getCachedSiteConfig,
} from "@/lib/db/cached-public";
import {
  PAGE_HERO_INNER_CLASS,
  PAGE_HERO_SECTION_CLASS,
} from "@/lib/hero-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop Cleaning Products",
  description:
    "Browse Frannys detergents, bleach, toilet cleaner, glass cleaner, and cleaning solutions for homes and businesses in Ghana.",
  path: "/shop",
});

export default async function ShopPage() {
  const [products, categoryRows, site] = await Promise.all([
    getCachedProducts(),
    getCachedCategories(),
    getCachedSiteConfig(),
  ]);

  return (
    <>
      <section className={PAGE_HERO_SECTION_CLASS}>
        <AnimatedImage
          src={site.shopHeroImage}
          alt="Frannys Tidy Solutions product lineup"
          priority
          sizes="100vw"
          className="object-[center_65%]"
          drift="left"
        />
        <HeroOverlay />
        <div className={PAGE_HERO_INNER_CLASS}>
          <PageHeroTitle title={site.shopHeroHeadline} />
        </div>
      </section>
      <ShopCatalog
        products={products}
        categories={categoryRows.map((c) => c.name)}
      />
    </>
  );
}
