import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/db/settings";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="mt-auto w-full bg-primary-dark text-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
        <div>
          <Link href="/" className="inline-block" aria-label={site.name}>
            <Image
              src={site.logoUrl || "/frannystidy.png"}
              alt={site.name}
              width={72}
              height={72}
              unoptimized={
                site.logoUrl.startsWith("/uploads/") ||
                site.logoUrl.startsWith("https://")
              }
              className="h-14 w-14 rounded-lg object-contain"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            {site.aboutBlurb}
          </p>
          <div className="mt-4 flex gap-2.5">
            {site.instagramUrl ? (
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            ) : null}
            {site.tiktokUrl ? (
              <a
                href={site.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {site.serviceItems.slice(0, 3).map((service) => (
              <li key={service.id}>
                <Link href="/services" className="hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="hover:text-white">
                Cleaning Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-white">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-highlight" />
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-highlight" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-sm text-white/55">
          © 2026 {site.name}. {site.tagline}
        </div>
      </div>
    </footer>
  );
}
