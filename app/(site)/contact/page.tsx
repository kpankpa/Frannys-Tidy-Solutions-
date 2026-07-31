import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { SectionSpinner } from "@/components/ui/PageSpinner";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteConfig } from "@/lib/db/settings";
import { buildWhatsAppUrl } from "@/lib/constants";
import { FLYERS } from "@/lib/flyers";

export const metadata = {
  title: "Contact",
  description:
    "Email Frannys Tidy Solutions for cleaning products, bookings, and support in Accra.",
};

export default async function ContactPage() {
  const site = await getSiteConfig();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello ${site.name}!`,
    site.whatsappE164,
  );
  const mailtoUrl = `mailto:${site.email}`;

  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: mailtoUrl,
    },
    {
      icon: Phone,
      label: "Phone",
      value: site.phoneDisplay,
      href: `tel:${site.phone}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: site.address,
    },
    {
      icon: Clock,
      label: "Hours",
      value: site.hours,
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary-dark text-white">
        <AnimatedImage
          src={FLYERS.freshness.src}
          alt={FLYERS.freshness.alt}
          priority
          sizes="100vw"
          className="object-[center_20%]"
          drift="right"
        />
        <HeroOverlay />
        <div className="container-page relative py-20 sm:py-28">
          <FadeIn className="max-w-2xl">
            <p className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              {site.name}
            </p>
            <h1 className="mt-4 text-xl font-semibold leading-snug text-white/95 sm:text-3xl">
              {site.contactHeroHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {site.contactHeroSubcopy}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#message" variant="light" size="md">
                <Mail className="h-4 w-4" />
                Email Us
              </Button>
              <a
                href={mailtoUrl}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
              >
                {site.email}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <FadeIn className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Direct lines to the team
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {channels.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.05}>
                <div className="flex gap-4 border-l-2 border-secondary/40 pl-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    {"href" in item && item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block text-sm text-muted hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted">{item.value}</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {site.contactTopicsHeadline}
            </h2>
            <ul className="mt-8 space-y-3">
              {site.contactTopics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-3 text-[15px] text-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {topic}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl soft-shadow">
              <AnimatedImage
                src={FLYERS.freshness.src}
                alt={FLYERS.freshness.alt}
                className="object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                drift="right"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="message" className="bg-surface py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Email the {site.shortName} team
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              Use the form to send a message to{" "}
              <a href={mailtoUrl} className="font-semibold text-primary hover:underline">
                {site.email}
              </a>
              . Need something faster? WhatsApp is still available for quick
              chats.
            </p>
            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="md"
              className="mt-8"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Suspense fallback={<SectionSpinner label="Loading form..." />}>
              <ContactForm />
            </Suspense>
          </FadeIn>
        </div>
      </section>

      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page">
          <FadeIn className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Based in {site.address}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Open {site.hours}. Follow us on social for freshness tips and
              updates from the {site.shortName} team.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {site.instagramUrl ? (
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:bg-secondary/10"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                </a>
              ) : null}
              {site.tiktokUrl ? (
                <a
                  href={site.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:bg-secondary/10"
                >
                  <TikTokIcon className="h-4 w-4" />
                  TikTok
                </a>
              ) : null}
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-border soft-shadow">
            <iframe
              title={`Map of ${site.address}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </FadeIn>
          <FadeIn delay={0.12} className="mt-3">
            <a
              href={
                site.googleMapsUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Open in Google Maps
            </a>
            <p className="mt-1 text-xs text-muted">
              Find {site.name} in {site.locationBlurb}. Claim the Google
              Business Profile and keep photos updated for local search.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
