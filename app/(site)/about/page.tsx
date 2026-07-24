import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <FadeIn>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          A proudly Ghanaian cleaning brand for healthier spaces
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          {SITE.name} manufactures high-quality detergents and delivers
          professional cleaning services: a complete ecosystem for homes and
          businesses.
        </p>
      </FadeIn>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <FadeIn>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <Image
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"
              alt="Clean modern kitchen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="space-y-6">
          <div className="rounded-[20px] border border-border bg-surface p-6">
            <h2 className="text-xl font-bold">Our Story</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Established in {SITE.established} and registered in{" "}
              {SITE.registered}, we are headquartered in {SITE.address}. Our
              products are stocked by retail partners in Mampong and Accra, while
              our cleaning teams serve households and organisations nationwide.
            </p>
          </div>
          <div className="rounded-[20px] border border-border bg-surface p-6">
            <h2 className="text-xl font-bold">Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              To provide Ghanaian homes and businesses with superior-quality
              cleaning products and professional services that promote hygiene,
              comfort, and well-being at accessible prices.
            </p>
          </div>
          <div className="rounded-[20px] border border-border bg-surface p-6">
            <h2 className="text-xl font-bold">Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              To become the most trusted and preferred cleaning solutions brand
              in Ghana, known for innovation, reliability, and healthier
              communities.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Happy Customers", value: "5,000+" },
          { label: "Products", value: "8" },
          {
            label: "Years Growing",
            value: String(new Date().getFullYear() - SITE.established),
          },
          { label: "Service Days", value: "7 / week" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[20px] border border-border bg-surface p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[20px] border border-border bg-surface-muted p-8">
        <h2 className="text-2xl font-bold">Values</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Cleanliness",
            "Quality",
            "Reliability",
            "Customer satisfaction",
            "Affordable solutions",
            "Professional delivery",
          ].map((v) => (
            <div
              key={v}
              className="rounded-[16px] bg-surface px-4 py-4 text-sm font-semibold text-foreground shadow-sm"
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
