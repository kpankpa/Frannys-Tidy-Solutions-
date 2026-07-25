import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/about/Reveal";
import { Button } from "@/components/ui/Button";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { AccentCircles } from "@/components/ui/AccentCircles";
import {
  ABOUT_DIFFERENCE,
  ABOUT_JOURNEY,
  ABOUT_PROMISE,
  ABOUT_VALUES,
} from "@/lib/about-content";
import { FLYERS } from "@/lib/flyers";

type AboutSectionsProps = {
  brandName: string;
  shortName: string;
  story: string;
  mission: string;
  vision: string;
  address: string;
  hours: string;
  productCount: number;
  yearsGrowing: number;
};

export function AboutSections({
  brandName,
  shortName,
  story,
  mission,
  vision,
  address,
  hours,
  productCount,
  yearsGrowing,
}: AboutSectionsProps) {
  return (
    <>
      {/* Customer-first promise */}
      <section className="border-b border-border bg-surface">
        <div className="container-page py-14 sm:py-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-primary sm:text-3xl">
              {ABOUT_PROMISE}
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Origin story */}
      <section className="droplet-bg overflow-hidden">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl soft-shadow sm:aspect-[5/6]">
              <AnimatedImage
                src={FLYERS.brandProducts.src}
                alt={FLYERS.brandProducts.alt}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-[center_15%]"
                drift="left"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Built in Accra for healthier everyday spaces
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
              <p>{story}</p>
              <p>
                What began as a commitment to better detergents grew into a full
                cleaning ecosystem: products you can trust on the shelf, and
                professional teams who bring that same standard into homes,
                offices, and community spaces.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="relative overflow-hidden bg-primary-dark text-white">
        <AccentCircles tone="band" />
        <div className="container-page relative py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <Reveal className="lg:border-r lg:border-white/12 lg:pr-14">
              <span className="text-xs font-semibold tabular-nums text-secondary">
                01
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Mission
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                {mission}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:pl-14">
              <span className="text-xs font-semibold tabular-nums text-secondary">
                02
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Vision
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                {vision}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Values that show up in the work
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              These are not wall slogans. They shape how we formulate, how we
              train, and how we show up at your door.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2">
            {ABOUT_VALUES.map((value, index) => (
              <StaggerItem key={value.title} className="relative pl-14">
                <span className="absolute left-0 top-0 font-extrabold text-4xl tabular-nums text-secondary/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Difference */}
      <section className="droplet-bg border-y border-border">
        <div className="container-page py-16 sm:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Products and service, under one standard
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {shortName} is designed as a complete freshness partner: what we
                make and how we clean are meant to work together.
              </p>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl soft-shadow">
                <AnimatedImage
                  src={FLYERS.productLineup.src}
                  alt={FLYERS.productLineup.alt}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-[center_70%]"
                  drift="in"
                />
              </div>
            </Reveal>

            <Stagger className="space-y-8 lg:pt-10">
              {ABOUT_DIFFERENCE.map((item) => (
                <StaggerItem
                  key={item.title}
                  className="border-l-2 border-secondary/40 pl-5"
                >
                  <h3 className="text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Growing with Ghana, one clean space at a time
            </h2>
          </Reveal>

          <ol className="relative mt-12 space-y-0 border-l border-border pl-8 sm:pl-10">
            {ABOUT_JOURNEY.map((step, index) => (
              <Reveal key={step.year} delay={index * 0.06} as="li" className="relative pb-10 last:pb-0">
                <span className="absolute -left-[2.05rem] top-1.5 h-3 w-3 rounded-full bg-secondary ring-4 ring-surface sm:-left-[2.55rem]" />
                <p className="text-sm font-semibold text-secondary">
                  {step.year}
                </p>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof / presence */}
      <section className="bg-surface-muted">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Rooted in East Legon Hills, serving Ghana
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Based at {address}. Open {hours}. Our detergents are available
              through retail partners, and our cleaning teams serve homes and
              organisations that want a calmer, cleaner standard.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { value: `${yearsGrowing}+`, label: "Years growing with Ghana" },
              {
                value: String(productCount),
                label: "Carefully curated products",
              },
              { value: "7", label: "Days a week, ready to help" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <p className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center text-white soft-shadow sm:rounded-3xl sm:px-10 sm:py-12">
              <AccentCircles />
              <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                Ready for a fresher space?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
                Whether you need reliable detergents for home or a professional
                clean for your space, {brandName} is here to make freshness feel
                simple.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/services" variant="light" size="md">
                  Book a Cleaning
                </Button>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
