import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { SITE } from "@/lib/constants";

export function HomeHero() {
  return (
    <section className="droplet-bg relative overflow-hidden">
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <FadeIn>
          <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary">
            {SITE.tagline}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-primary sm:text-4xl lg:text-[2.75rem]">
            Cleaning Made Easy,
            <br />
            Freshness Guaranteed.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">
            Premium detergents and professional cleaning for Ghanaian homes and
            businesses, delivered with clinical care and hospitality standards.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button href="/shop" size="md">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="outline" size="md">
              Our Services
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-secondary/15 via-transparent to-highlight/15 blur-xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl soft-shadow lg:rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80"
              alt="Professional Frannys cleaner in a modern home"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
