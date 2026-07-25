import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { listCategories, listProducts } from "@/lib/db/products";
import { getSiteConfig } from "@/lib/db/settings";
import { FLYERS } from "@/lib/flyers";

export const metadata = {
  title: "Shop",
  description:
    "Browse Frannys detergents and cleaning solutions for homes and businesses in Ghana.",
};

export default async function ShopPage() {
  const [products, categoryRows, site] = await Promise.all([
    listProducts(),
    listCategories(),
    getSiteConfig(),
  ]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary-dark text-white">
        <AnimatedImage
          src={FLYERS.productLineup.src}
          alt={FLYERS.productLineup.alt}
          priority
          sizes="100vw"
          className="object-[center_65%]"
          drift="left"
        />
        <HeroOverlay />
        <div className="container-page relative py-16 sm:py-20">
          <FadeIn className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              {site.shopHeroHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {site.shopHeroSubcopy}
            </p>
          </FadeIn>
        </div>
      </section>
      <ShopCatalog
        products={products}
        categories={categoryRows.map((c) => c.name)}
      />
    </>
  );
}
