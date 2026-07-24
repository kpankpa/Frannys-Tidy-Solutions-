"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE, SOCIAL } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.8a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.85 4.85 0 0 1-1-.15Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden rounded-t-2xl bg-primary-dark text-white sm:rounded-t-3xl">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
        <div>
          <Link href="/" className="inline-block" aria-label={SITE.name}>
            <Image
              src="/frannystidy.png"
              alt={SITE.name}
              width={72}
              height={72}
              className="h-14 w-14 rounded-lg object-contain"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Redefining cleanliness with clinical precision and premium service
            across Ghana.
          </p>
          <div className="mt-4 flex gap-2.5">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/services" className="hover:text-white">
                Home Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Office Sanitization
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Deep Cleaning
              </Link>
            </li>
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
            <li>
              <Link href="/admin" className="hover:text-white/90">
                Admin
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
              <a href={`tel:${SITE.phone}`} className="hover:text-white">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-highlight" />
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-sm text-white/55">
          © 2026 {SITE.name}. {SITE.tagline}
        </div>
      </div>
    </footer>
  );
}
