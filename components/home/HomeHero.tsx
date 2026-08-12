import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { PageHeroTitle } from "@/components/ui/PageHeroTitle";
import {
  getDefaultSiteConfig,
} from "@/lib/db/settings";
import { getCachedSiteConfig } from "@/lib/db/cached-public";
import {
  PAGE_HERO_INNER_CLASS,
  PAGE_HERO_SECTION_CLASS,
} from "@/lib/hero-layout";

export async function HomeHero() {
  const site = await getCachedSiteConfig().catch(() => getDefaultSiteConfig());
  const headline = site.heroHeadline.split("\n")[0]?.trim() || site.heroHeadline;

  return (
    <section className={PAGE_HERO_SECTION_CLASS}>
      <AnimatedImage
        src={site.heroHomeImage}
        alt={`${site.name} cleaning products and brand`}
        priority
        sizes="100vw"
        className="object-cover object-center"
        drift="in"
      />
      <HeroOverlay />
      <div className={PAGE_HERO_INNER_CLASS}>
        <PageHeroTitle title={headline}>
          <Button href="/shop" variant="light" size="md">
            {site.heroCtaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="/services"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
          >
            {site.heroCtaSecondary}
          </a>
        </PageHeroTitle>
      </div>
    </section>
  );
}
