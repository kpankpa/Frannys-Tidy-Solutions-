"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useCart } from "@/lib/cart";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    for (const link of NAV_LINKS) {
      router.prefetch(link.href);
    }
    router.prefetch("/contact");
    router.prefetch("/cart");
    router.prefetch("/checkout");
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/80 bg-white transition-shadow duration-300",
        scrolled && "shadow-sm",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-2 sm:h-24 sm:gap-3 md:h-28 lg:h-32">
        <div className="min-w-0 flex-1 overflow-hidden pr-1 sm:pr-2 xl:flex-none xl:max-w-[20rem]">
          <BrandLogo href="/" size="nav" priority />
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-6 xl:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/cart"
            prefetch
            className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-surface-muted sm:h-10 sm:w-10"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-highlight px-1 text-[10px] font-bold text-primary-dark">
                {count}
              </span>
            ) : null}
          </Link>
          <Button href="/contact" size="sm" className="hidden md:inline-flex">
            Contact Us
          </Button>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground xl:hidden sm:h-10 sm:w-10"
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
              prefetch
              onClick={closeMenu}
              className="rounded-[8px] px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/contact" className="mt-2 w-full" size="sm" onClick={closeMenu}>
            Contact Us
          </Button>
          <Button href="/cart" variant="outline" className="w-full" size="sm" onClick={closeMenu}>
            View Cart ({count})
          </Button>
        </nav>
      </div>
    </header>
  );
}
