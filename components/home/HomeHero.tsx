import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { buildWhatsAppUrl, SITE } from "@/lib/constants";
import { formatPrice, products } from "@/lib/products";

export function HomeHero() {
  const floating = products.slice(0, 3);

  return (
    <section className="droplet-bg relative overflow-hidden border-b border-border">
      <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <FadeIn>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Cleaning Made Easy,
            <br />
            <span className="text-primary">Freshness Guaranteed</span>
            <br />
            Every Time.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Premium cleaning detergents and professional cleaning services
            delivered with excellence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/shop" size="lg">
              Shop Products
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="outline" size="lg">
              Book Cleaning Service
            </Button>
            <Button
              href={buildWhatsAppUrl(
                `Hello ${SITE.name}! I'd like to order on WhatsApp.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] shadow-2xl shadow-primary/15 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80"
              alt="Professional cleaner in a modern Ghanaian home"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent" />
            <Sparkles className="absolute right-5 top-5 h-8 w-8 text-highlight drop-shadow" />
          </div>

          <div className="absolute -left-2 top-10 hidden w-44 rounded-[20px] border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur sm:block lg:-left-6">
            <div className="relative mb-2 h-20 overflow-hidden rounded-[14px]">
              <Image
                src={floating[0].image}
                alt={floating[0].imageAlt}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <p className="text-xs font-bold text-foreground">{floating[0].name}</p>
            <p className="text-xs font-semibold text-primary">
              {formatPrice(floating[0].price)}
            </p>
          </div>

          <div className="absolute -right-2 bottom-16 hidden w-44 rounded-[20px] border border-white/50 bg-white/90 p-3 shadow-xl backdrop-blur sm:block lg:-right-4">
            <div className="relative mb-2 h-20 overflow-hidden rounded-[14px]">
              <Image
                src={floating[1].image}
                alt={floating[1].imageAlt}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
            <p className="text-xs font-bold text-foreground">{floating[1].name}</p>
            <p className="text-xs font-semibold text-primary">
              {formatPrice(floating[1].price)}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
