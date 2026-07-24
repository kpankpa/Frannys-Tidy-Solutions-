"use client";

import Link from "next/link";
import { NAV_LINKS, SITE, SOCIAL } from "@/lib/constants";

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
    <footer className="mt-auto bg-primary-dark text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-highlight">{SITE.shortName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Premium cleaning detergents and professional services for healthier
            homes and businesses across Ghana.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-secondary">
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-highlight">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="text-sm text-white/50 hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-highlight">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>{SITE.address}</li>
            <li>
              <a href={`tel:${SITE.phone}`} className="hover:text-white">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.hoursShort}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-highlight">Newsletter</h3>
          <p className="mt-4 text-sm text-white/70">
            Get freshness tips and product drops.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="h-11 w-full rounded-[16px] border-0 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-[16px] bg-highlight px-4 text-sm font-bold text-primary-dark"
            >
              Join
            </button>
          </form>
          <div className="mt-6 overflow-hidden rounded-[16px] border border-white/10">
            <iframe
              title="East Legon Hills map"
              src="https://maps.google.com/maps?q=East%20Legon%20Hills%2C%20Accra%2C%20Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-28 w-full border-0 grayscale"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-xs text-white/45">
            Policies, Privacy, Terms
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-white/55 sm:flex-row sm:justify-between">
          <p>© 2026 {SITE.name}. All rights reserved.</p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
