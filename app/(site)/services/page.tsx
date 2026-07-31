import Image from "next/image";
import { Suspense } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { AccentCircles } from "@/components/ui/AccentCircles";
import { SectionSpinner } from "@/components/ui/PageSpinner";
import { BookingForm } from "@/components/services/BookingForm";
import { WhyBook } from "@/components/services/WhyBook";
import { resolveCleaningServices } from "@/lib/services";
import { getSiteConfig } from "@/lib/db/settings";
import { FLYERS } from "@/lib/flyers";
import { formatPrice } from "@/lib/products";

export const metadata = {
  title: "Cleaning Services",
  description:
    "Book professional residential and commercial cleaning with Frannys Tidy Solutions across Accra and Ghana.",
};

export default async function ServicesPage() {
  const site = await getSiteConfig();
  const services = resolveCleaningServices(site.serviceItems);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-primary-dark text-white">
        <AnimatedImage
          src={FLYERS.brandProducts.src}
          alt={FLYERS.brandProducts.alt}
          priority
          sizes="100vw"
          className="object-[center_18%]"
          drift="in"
        />
        <HeroOverlay />
        <div className="container-page relative py-20 sm:py-28">
          <FadeIn className="max-w-2xl">
            <p className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              {site.name}
            </p>
            <h1 className="mt-4 text-xl font-semibold leading-snug text-white/95 sm:text-3xl">
              {site.servicesHeroHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {site.servicesHeroSubcopy}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#book" variant="light" size="md">
                Book a Cleaning
              </Button>
              <a
                href="#services"
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
              >
                View Services
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. Service catalogue */}
      <section id="services" className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <FadeIn className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {site.servicesSectionHeadline}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {site.servicesSectionSubcopy}
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.04} as="article">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface soft-shadow">
                  <div className="relative m-1.5 aspect-[16/10] overflow-hidden rounded-[14px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                    <Button
                      href={`?service=${encodeURIComponent(service.title)}#book`}
                      className="mt-5 w-full"
                      size="sm"
                    >
                      Select Service
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {site.servicePackages.length > 0 ? (
        <section className="border-y border-border bg-surface-muted/60 py-16 sm:py-20">
          <div className="container-page">
            <FadeIn className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {site.packagesHeadline}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {site.packagesSubcopy}
              </p>
            </FadeIn>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {site.servicePackages.map((pkg, i) => (
                <FadeIn key={`${pkg.name}-${i}`} delay={i * 0.04} as="article">
                  <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-surface p-6 soft-shadow">
                    <h3 className="text-lg font-bold text-foreground">
                      {pkg.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {pkg.description}
                    </p>
                    <p className="mt-5 text-xl font-extrabold text-primary">
                      From {formatPrice(pkg.priceFromCedis)}
                    </p>
                    <Button
                      href={`?service=${encodeURIComponent(pkg.name)}#book`}
                      className="mt-5 w-full"
                      size="sm"
                    >
                      Book this package
                    </Button>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. How it works */}
      <section className="droplet-bg border-y border-border py-16 sm:py-20">
        <div className="container-page">
          <FadeIn className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {site.serviceProcessTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {site.serviceProcessSubcopy}
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {site.serviceProcess.map((item, i) => (
              <FadeIn key={`${item.step}-${item.title}`} delay={i * 0.06}>
                <p className="text-3xl font-extrabold text-secondary/45">
                  {item.step}
                </p>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Spaces we serve */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl soft-shadow">
              <Image
                src={site.serviceSpacesImage}
                alt={site.serviceSpacesTitle}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={
                  site.serviceSpacesImage.startsWith("/uploads/") ||
                  site.serviceSpacesImage.startsWith("https://")
                }
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {site.serviceSpacesTitle}
            </h2>
            <ul className="mt-8 space-y-5">
              {site.serviceSpaces.map((space) => (
                <li key={space.title} className="border-l-2 border-secondary/40 pl-4">
                  <h3 className="font-bold text-foreground">{space.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {space.body}
                  </p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <WhyBook
        shortName={site.shortName}
        subcopy={site.whyBookSubcopy}
        promises={site.servicePromises}
      />

      {/* 6. Booking */}
      <section id="book" className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Request a cleaning visit
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Tell us what you need. We save your request, then open WhatsApp so
              you can confirm with the {site.shortName} team.
            </p>
          </FadeIn>
          <div className="mx-auto mt-10 max-w-2xl">
            <Suspense fallback={<SectionSpinner label="Loading booking form..." />}>
              <BookingForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white soft-shadow sm:rounded-3xl sm:px-10 sm:py-12">
              <AccentCircles />
              <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Prefer to talk first?
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-white/75">
                    Reach us any day of the week. We are based in {site.address}.
                  </p>
                </div>
                <Button href="/contact" variant="light" size="md">
                  Contact Us
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
