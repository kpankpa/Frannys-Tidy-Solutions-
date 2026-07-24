import { PackageCheck, Truck, Users, Wallet } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import {
  cleaningServices,
  howItWorks,
  testimonials,
  whyChooseUs,
} from "@/lib/services";
import Image from "next/image";
import { Star } from "lucide-react";

const whyIcons = [PackageCheck, Users, Wallet, Truck];

export function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            title="Featured Products"
            description="Premium detergents manufactured for Ghanaian homes and businesses."
            className="max-w-xl"
          />
          <Button href="/shop" variant="outline">
            View Shop
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Why Choose Us"
          description="A complete cleaning ecosystem: products you can trust and services you can book."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => {
            const Icon = whyIcons[i];
            return (
              <FadeIn key={item.title} delay={i * 0.06} as="article">
                <div className="card-lift h-full rounded-[20px] border border-border bg-surface-muted p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
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

export function HomeServices() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Professional Cleaning Services"
          description="Homes, offices, hotels, schools, churches, and commercial spaces across Ghana."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cleaningServices.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.05} as="article">
              <div className="card-lift flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-sm">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted">
                    {service.description}
                  </p>
                  <Button href={service.href} className="mt-5 w-full" size="sm">
                    Book Now
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="How It Works"
          description="From browse to delivery: a modern WhatsApp-first checkout."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {howItWorks.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.08} as="article">
              <div className="relative h-full rounded-[20px] border border-border bg-surface-muted p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
                {i < howItWorks.length - 1 ? (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-secondary md:block">
                    →
                  </span>
                ) : null}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          title="Loved by Homes & Businesses"
          description="Real feedback from customers across Accra."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08} as="article">
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-sm">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-highlight text-highlight"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
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

export function HomeCTA() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-page">
        <FadeIn>
          <div className="rounded-[24px] bg-gradient-to-br from-primary to-primary-dark px-8 py-14 text-center text-white shadow-xl shadow-primary/20 sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready for a Cleaner Home?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Shop premium detergents or book a professional clean. Fresh
              spaces start with Frannys.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/shop" variant="highlight" size="lg">
                Shop Products
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Book Cleaning
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
