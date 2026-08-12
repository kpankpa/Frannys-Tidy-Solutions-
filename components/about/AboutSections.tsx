import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/about/Reveal";
import { Button } from "@/components/ui/Button";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { AccentCircles } from "@/components/ui/AccentCircles";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { TeamSlideshow } from "@/components/team/TeamSlideshow";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { PEOPLE_IMAGES } from "@/lib/people-images";
import {
  SECTION_BODY_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/lib/section-typography";
import type {
  JourneyItem,
  TestimonialItem,
  TitleBodyItem,
} from "@/lib/site-config";

type AboutSectionsProps = {
  brandName: string;
  shortName: string;
  story: string;
  mission: string;
  vision: string;
  promise: string;
  promiseImage: string;
  storyImage: string;
  dealerImage: string;
  values: TitleBodyItem[];
  journey: JourneyItem[];
  difference: TitleBodyItem[];
  trustPoints: TitleBodyItem[];
  address: string;
  locationBlurb: string;
  hours: string;
  phoneDisplay: string;
  phone: string;
  email: string;
  instagramUrl: string;
  tiktokUrl: string;
  googleMapsUrl?: string;
  testimonials?: TestimonialItem[];
  productCount: number;
  yearsGrowing: number;
};

function productStatValue(count: number) {
  return `${Math.max(count, 1)}+`;
}

/** Scale the stat numeral up as the product count grows. */
function productStatSizeClass(count: number) {
  const n = Math.max(count, 1);
  if (n >= 100) return "text-5xl sm:text-6xl lg:text-7xl";
  if (n >= 10) return "text-4xl sm:text-5xl lg:text-6xl";
  return "text-4xl sm:text-5xl lg:text-6xl";
}

export function AboutSections({
  brandName,
  shortName,
  story,
  mission,
  vision,
  promise,
  promiseImage,
  storyImage,
  dealerImage,
  values,
  journey,
  difference,
  trustPoints,
  address,
  locationBlurb,
  hours,
  phoneDisplay,
  phone,
  email,
  instagramUrl,
  tiktokUrl,
  googleMapsUrl = "",
  testimonials = [],
  productCount,
  yearsGrowing,
}: AboutSectionsProps) {
  const mapsQuery = encodeURIComponent(address);
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const mapsLink =
    googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const approvedReviews = testimonials.filter((t) => t.approved);

  return (
    <>
      {/* 1. Promise */}
      <section>
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <p className="text-2xl font-bold leading-snug tracking-tight text-primary sm:text-3xl lg:text-[2.125rem] lg:leading-[1.35]">
              &ldquo;{promise}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={promiseImage}
                alt="Frannys professional cleaning team illustration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={shouldUnoptimizeImage(promiseImage)}
                className="object-contain"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Our story */}
      <section className="droplet-bg overflow-hidden">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl soft-shadow sm:aspect-[5/6]">
              <AnimatedImage
                src={storyImage}
                alt="Frannys team member showcasing branded cleaning products"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-[center_15%]"
                drift="left"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className={SECTION_TITLE_CLASS}>
              Our story as a cleaning company in Accra
            </h2>
            <div className={`${SECTION_BODY_CLASS} space-y-4`}>
              {story
                .split(/(?<=\.)\s+/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Meet the team */}
      <section className="border-y border-border bg-surface-muted">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <SectionIntro
              title="Proud to wear our name"
              subtitle="Faces of Frannys across Accra and Ghana"
              body="Our black and yellow shirts are not just uniforms. They stand for the same quality in our detergents and the same care on every cleaning job. These are the people who show up for homes and businesses every day."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <TeamSlideshow images={PEOPLE_IMAGES} />
          </Reveal>
        </div>
      </section>

      {/* 4. Mission & vision */}
      <section className="relative overflow-hidden bg-primary-dark text-white">
        <AccentCircles tone="band" />
        <div className="container-page relative py-16 sm:py-20">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <SectionIntro
              title="Mission and vision"
              subtitle="Clear purpose for every product we make and every space we clean."
              align="center"
              maxWidthClass="max-w-none"
              titleClassName="text-white"
              subtitleClassName="text-white/70"
            />
          </Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <Reveal className="lg:border-r lg:border-white/12 lg:pr-14">
              <span className="text-xs font-semibold tabular-nums text-secondary">
                01
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Mission
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                {mission}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:pl-14">
              <span className="text-xs font-semibold tabular-nums text-secondary">
                02
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Vision
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                {vision}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Why trust Frannys */}
      <section className="bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <SectionIntro
              title={`Why Accra homes and businesses trust ${shortName}`}
              subtitle={`Practical reasons to choose our cleaning products and professional cleaning services in Accra, with roots in ${locationBlurb} and a clear standard of care.`}
              maxWidthClass="max-w-none"
            />
          </Reveal>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2">
            {trustPoints.map((item) => (
              <StaggerItem
                key={item.title}
                className="rounded-2xl border border-border bg-surface-muted/50 p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-primary">
                  {item.title.startsWith("Registered") ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : item.title.startsWith("Retail") ? (
                    <Store className="h-5 w-5" />
                  ) : item.title.startsWith("Serving") ? (
                    <MapPin className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5. Products and services */}
      <section className="droplet-bg border-y border-border">
        <div className="container-page py-16 sm:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionIntro
                title="Cleaning detergents and professional cleaning services"
                subtitle={`${shortName} is a complete cleaning solutions partner in Ghana: shop cleaning detergents and book home cleaning or office cleaning under one trusted standard.`}
                maxWidthClass="max-w-none"
              />
              <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-white soft-shadow">
                <Image
                  src={dealerImage}
                  alt="Frannys Tidy Solutions product range"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized={shouldUnoptimizeImage(dealerImage)}
                  className="object-contain p-1"
                />
              </div>
            </Reveal>

            <Stagger className="space-y-8 lg:pt-10">
              {difference.map((item) => (
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

      {/* 6. Values */}
      <section className="bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <SectionIntro
              title="Values that show up in the work"
              subtitle="These are not wall slogans. They shape how we formulate, how we train, and how we show up at your door."
              maxWidthClass="max-w-none"
            />
          </Reveal>

          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2">
            {values.map((value, index) => (
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

      {/* 7. Journey */}
      <section className="bg-surface-muted">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <SectionIntro
              title="Growing with Ghana, one clean space at a time"
              subtitle="From founding to retail reach and registered operations, our focus has stayed the same: cleaner, healthier everyday spaces."
              maxWidthClass="max-w-none"
            />
          </Reveal>

          <ol className="relative mt-12 space-y-0 border-l border-border pl-8 sm:pl-10">
            {journey.map((step, index) => (
              <Reveal
                key={`${step.year}-${step.title}`}
                delay={index * 0.06}
                as="li"
                className="relative pb-10 last:pb-0"
              >
                <span className="absolute -left-[2.05rem] top-1.5 h-3 w-3 rounded-full bg-secondary ring-4 ring-surface-muted sm:-left-[2.55rem]" />
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

      {/* 8. Presence / stats */}
      <section className="bg-surface">
        <div className="container-page py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <SectionIntro
              title={`Cleaning products and services from ${locationBlurb}`}
              subtitle="Buy Frannys cleaning detergents through selected retail partners in Accra and Mampong, or shop online. Book professional home cleaning, office cleaning, and commercial cleaning across Accra and surrounding areas."
              maxWidthClass="max-w-none"
            />
          </Reveal>

          <Stagger className="mt-12 grid gap-8 sm:grid-cols-3">
            {(
              [
                {
                  value: `${yearsGrowing}+`,
                  label: "Years growing with Ghana",
                },
                {
                  value: productStatValue(productCount),
                  label: "Products available to shop",
                  valueClass: productStatSizeClass(productCount),
                },
                { value: "7", label: "Days a week, ready to help" },
              ] as const
            ).map((stat) => (
              <StaggerItem key={stat.label}>
                <p
                  className={`font-extrabold tracking-tight text-primary ${
                    "valueClass" in stat ? stat.valueClass : "text-4xl sm:text-5xl"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {approvedReviews.length > 0 ? (
        <section className="border-t border-border bg-surface-muted/70 py-16 sm:py-20">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <SectionIntro
                title="What customers say"
                subtitle="Real feedback from homes and businesses that use Frannys cleaning products and cleaning services in Accra."
                maxWidthClass="max-w-none"
              />
            </Reveal>
            <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
              {approvedReviews.map((t) => (
                <StaggerItem key={`${t.name}-${t.quote.slice(0, 24)}`}>
                  <article className="h-full rounded-2xl border border-border/70 bg-surface p-5 soft-shadow">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-3.5 w-3.5 fill-highlight text-highlight"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="mt-5 text-sm font-semibold text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* 9. Contact, hours, map, social */}
      <section className="border-y border-border bg-surface-muted">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <SectionIntro
                title="Contact our Accra cleaning company"
                subtitle="Reach Frannys Tidy Solutions for cleaning products, home cleaning bookings, and office cleaning enquiries in Accra."
                maxWidthClass="max-w-none"
              />

              <dl className="mt-8 space-y-5">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">
                      Business address
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{address}</dd>
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">
                      Phone and WhatsApp
                    </dt>
                    <dd className="mt-1 text-sm text-muted">
                      <a
                        href={`tel:${phone}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-muted">
                      <a
                        href={`mailto:${email}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-semibold text-foreground">
                      Working hours
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{hours}</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:bg-secondary/10"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Instagram
                  </a>
                ) : null}
                {tiktokUrl ? (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:bg-secondary/10"
                  >
                    <TikTokIcon className="h-4 w-4" />
                    TikTok
                  </a>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface soft-shadow">
                <iframe
                  title={`Map of ${address}`}
                  src={mapsEmbed}
                  className="h-72 w-full border-0 sm:h-[22rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                Find {brandName} in {locationBlurb} on Google Maps.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 10. Closing CTA */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center text-white soft-shadow sm:rounded-3xl sm:px-10 sm:py-12">
              <AccentCircles />
              <SectionIntro
                title="Ready for a fresher space?"
                subtitle={`Whether you need reliable detergents for home or a professional clean for your space, ${brandName} is here to make freshness feel simple.`}
                align="center"
                maxWidthClass="max-w-xl"
                titleClassName="relative text-white"
                subtitleClassName="relative text-white/75"
                bodyClassName="relative"
              />
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
                <Link
                  href="/shop"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
                >
                  Shop Products
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
