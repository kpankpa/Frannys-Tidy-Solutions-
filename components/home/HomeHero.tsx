import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import {
  getDefaultSiteConfig,
  getSiteConfig,
} from "@/lib/db/settings";

export async function HomeHero() {
  const site = await getSiteConfig().catch(() => getDefaultSiteConfig());
  const headlineLines = site.heroHeadline.split("\n").filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden bg-primary-dark text-white">
      <AnimatedImage
        src="/hero-home.png"
        alt={`${site.name} cleaning products and brand`}
        priority
        sizes="100vw"
        className="object-cover object-center"
        drift="in"
      />
      <HeroOverlay />
      <div className="container-page relative py-20 sm:py-28">
        <FadeIn className="max-w-2xl">
          <p className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {site.name}
          </p>
          <h1 className="mt-4 text-xl font-semibold leading-snug text-white/95 sm:text-3xl">
            {headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            {site.heroSubcopy || site.tagline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" variant="light" size="md">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Our Services
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
