import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/db/settings";
import { DEFAULT_LOGO_URL } from "@/lib/site-config";
import { FOOTER_COLUMN_TITLE_CLASS } from "@/lib/section-typography";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";

export function Footer({ site }: { site: SiteConfig }) {
  const logoSrc = site.logoUrl || DEFAULT_LOGO_URL;

  return (
    <footer className="mt-auto w-full overflow-hidden bg-primary-dark text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:py-12">
        <div className="min-w-0 space-y-4">
          <Link
            href="/"
            className="inline-block max-w-full"
            aria-label={site.name}
          >
            <Image
              src={logoSrc}
              alt={site.name}
              width={280}
              height={112}
              unoptimized
              className="h-auto max-h-20 w-auto max-w-full object-contain object-left sm:max-h-24 sm:max-w-[14rem]"
            />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            {site.aboutBlurb}
          </p>
          <div className="flex flex-wrap gap-2.5">
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

        <div className="min-w-0">
          <h3 className={FOOTER_COLUMN_TITLE_CLASS}>Services</h3>
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

        <div className="min-w-0">
          <h3 className={FOOTER_COLUMN_TITLE_CLASS}>Company</h3>
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

        <div className="min-w-0">
          <h3 className={FOOTER_COLUMN_TITLE_CLASS}>Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-highlight" />
              <a href={`tel:${site.phone}`} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2 break-words">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
              <a href={`mailto:${site.email}`} className="min-w-0 hover:text-white">
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
        <div className="container-page space-y-1.5 py-5 text-center text-sm text-white/55">
          <p>
            © 2026 {site.name}. {site.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
