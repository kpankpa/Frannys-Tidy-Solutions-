import Image from "next/image";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { PageHeroTitle } from "@/components/ui/PageHeroTitle";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { SectionSpinner } from "@/components/ui/PageSpinner";
import { ContactForm } from "@/components/contact/ContactForm";
import { TeamSlideshow } from "@/components/team/TeamSlideshow";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { getCachedSiteConfig } from "@/lib/db/cached-public";
import { PEOPLE_IMAGES } from "@/lib/people-images";
import { buildWhatsAppUrl } from "@/lib/constants";
import {
  PAGE_HERO_INNER_CLASS,
  PAGE_HERO_SECTION_CLASS,
} from "@/lib/hero-layout";

export const metadata = {
  title: "Contact",
  description:
    "Email Frannys Tidy Solutions for cleaning products, bookings, and support in Accra.",
};

export default async function ContactPage() {
  const site = await getCachedSiteConfig();
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
      <section className={PAGE_HERO_SECTION_CLASS}>
        <AnimatedImage
          src={site.contactHeroImage}
          alt="Fresh laundry and Frannys cleaning products"
          priority
          sizes="100vw"
          className="object-[center_20%]"
          drift="right"
        />
        <HeroOverlay />
        <div className={PAGE_HERO_INNER_CLASS}>
          <PageHeroTitle title={site.contactHeroHeadline}>
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
          </PageHeroTitle>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <FadeIn>
            <SectionIntro
              title="Direct lines to the team"
              subtitle="Phone, email, address, and hours for Frannys Tidy Solutions"
            />
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
            <SectionIntro
              title="Real people, not a call center"
              subtitle={`Who you will meet when you reach out to ${site.shortName}`}
              body="When you call, WhatsApp, or email us, you reach people like these. Friendly faces who know the products, the services, and what it takes to keep your space fresh."
              maxWidthClass="max-w-md"
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <TeamSlideshow images={PEOPLE_IMAGES} />
          </FadeIn>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <SectionIntro
              title={site.contactTopicsHeadline}
              subtitle="Common reasons customers reach out to our team"
            />
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
            <div className="relative aspect-[5/4] w-full">
              <Image
                src="/contact-us.jpg"
                alt="Contact Frannys Tidy Solutions"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="message" className="bg-surface-muted py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <FadeIn>
            <SectionIntro
              title={`Email the ${site.shortName} team`}
              subtitle={
                <>
                  Use the form to send a message to{" "}
                  <a href={mailtoUrl} className="font-semibold text-primary hover:underline">
                    {site.email}
                  </a>
                  . Need something faster? WhatsApp is still available for quick chats.
                </>
              }
              maxWidthClass="max-w-md"
            />
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

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <FadeIn>
            <SectionIntro
              title={`Based in ${site.address}`}
              subtitle={`Open ${site.hours}. Follow us on social for freshness tips and updates from the ${site.shortName} team.`}
            />
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
