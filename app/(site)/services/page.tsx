import { Suspense } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BookingForm } from "@/components/services/BookingForm";
import { cleaningServices } from "@/lib/services";

export const metadata = {
  title: "Cleaning Services",
};

export default function ServicesPage() {
  return (
    <>
      <section className="droplet-bg border-b border-border py-14 sm:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Professional Care for Every Space
            </h1>
            <p className="mt-4 max-w-xl text-muted sm:text-lg">
              Clinical-grade hygiene with premium hospitality standards for
              homes, offices, hotels, schools, churches, and businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#book" size="lg">
                Explore All Services
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Free Estimate
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[12px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                alt="Bright modern living space ready for professional cleaning"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            title="Our Cleaning Services"
            description="Select the service that fits your space, then book via WhatsApp."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cleaningServices.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.05} as="article">
                <div className="card-lift flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
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
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">
                      {service.description}
                    </p>
                    <Button href={service.href} className="mt-5 w-full" size="sm">
                      Select Service
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="bg-surface py-16">
        <div className="container-page">
          <SectionHeading
            title="Book a Cleaning Service"
            description="Tell us what you need. We confirm everything on WhatsApp."
          />
          <div className="mx-auto mt-10 max-w-2xl">
            <Suspense
              fallback={
                <div className="rounded-[10px] border border-border bg-white p-8 text-center text-muted">
                  Loading booking form...
                </div>
              }
            >
              <BookingForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
