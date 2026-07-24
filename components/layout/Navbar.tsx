"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl, NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/80 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-primary sm:text-xl">
          {SITE.shortName}
          <span className="hidden font-semibold text-muted sm:inline">
            {" "}
            Tidy Solutions
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-muted hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-surface-muted"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-bold text-primary-dark">
                {count}
              </span>
            ) : null}
          </Link>
          <Button
            href={buildWhatsAppUrl(
              `Hello ${SITE.name}! I'd like to place an order / book a cleaning.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-white xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[16px] px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/cart" className="mt-2 w-full">
            View Cart ({count})
          </Button>
        </nav>
      </div>
    </header>
  );
}
