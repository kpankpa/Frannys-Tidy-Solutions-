import Image from "next/image";
import Link from "next/link";
import {
  PackageCheck,
  Truck,
  Users,
  Wallet,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/lib/section-typography";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { AccentCircles } from "@/components/ui/AccentCircles";
import type { Product } from "@/lib/products";
import type { Service } from "@/lib/services";
import type { HowItWorksItem, TestimonialItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const whyIcons = [PackageCheck, Users, Wallet, Zap];
const whyColors = [
  "bg-sky-100 text-sky-700",
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-cyan-100 text-cyan-700",
];

const stepColors = [
  "bg-primary text-white",
  "bg-primary text-white",
  "bg-secondary text-primary-dark",
  "bg-highlight text-primary-dark",
];

export function WhyChoose({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: { title: string; description: string }[];
}) {
  return (
    <section className="bg-surface-muted/70 py-14 sm:py-16">
      <div className="container-page">
        <SectionHeading title={title} description={description} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = whyIcons[i] ?? Truck;
            return (
              <FadeIn key={item.title} delay={i * 0.06} as="article">
                <div className="card-lift h-full rounded-2xl border border-border/70 bg-surface p-5 soft-shadow">
                  <div
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                      whyColors[i],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts({
  products,
  title,
  description,
  ctaLabel,
}: {
  products: Product[];
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <section className="py-14 sm:py-16">
      <div className="container-page">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
            <p className={`${SECTION_SUBTITLE_CLASS} max-w-lg`}>{description}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 4).map((product, i) => (
            <FadeIn
              key={product.id}
              delay={i * 0.05}
              className="w-[250px] shrink-0 sm:w-auto"
            >
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeServices({
  title,
  description,
  services,
}: {
  title: string;
  description: string;
  services: Service[];
}) {
  return (
    <section className="bg-surface-muted/70 py-14 sm:py-16">
      <div className="container-page">
        <SectionHeading title={title} description={description} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.05} as="article">
              <div className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface soft-shadow">
                <div className="relative m-1 mb-0 aspect-[16/10] overflow-hidden rounded-[10px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 pt-4">
                  <h3 className="text-[15px] font-semibold text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <Button
                    href={service.href}
                    variant="outline"
                    className="mt-4 w-full"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Button href="/services" variant="outline" size="sm">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: HowItWorksItem[];
}) {
  return (
    <section className="py-14 sm:py-16">
      <div className="container-page">
        <SectionHeading title={title} description={description} />
        <div className="relative mt-10">
          <div className="absolute left-[12%] right-[12%] top-4 hidden h-px bg-border md:block" />
          <div className="grid gap-8 md:grid-cols-4 md:gap-5">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.08} as="article">
                <div className="relative text-center">
                  <div
                    className={cn(
                      "relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold soft-shadow",
                      stepColors[i],
                    )}
                  >
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({
  items,
  title,
  description,
}: {
  items: TestimonialItem[];
  title: string;
  description: string;
}) {
  const approved = items.filter((t) => t.approved);
  if (approved.length === 0) return null;

  return (
    <section className="bg-surface-muted/70 py-14 sm:py-16">
      <div className="container-page">
        <SectionHeading title={title} description={description} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {approved.map((t, i) => (
            <FadeIn key={`${t.name}-${i}`} delay={i * 0.08} as="article">
              <div className="h-full rounded-2xl border border-border/70 bg-surface p-5 soft-shadow">
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
                <div className="mt-5 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-xs font-bold text-primary">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCTA({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="pb-14 sm:pb-16">
      <div className="container-page">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center text-white soft-shadow sm:rounded-3xl sm:px-10 sm:py-12">
            <AccentCircles />
            <h2 className={`relative ${SECTION_TITLE_CLASS} text-white`}>
              {title}
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-[15px]">
              {description}
            </p>
            <div className="relative mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Button href="/shop" variant="highlight" size="md">
                Get Started
              </Button>
              <Button href="/services" variant="light" size="md">
                Book Cleaning
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
