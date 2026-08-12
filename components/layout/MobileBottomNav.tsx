"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, MoreHorizontal, ShoppingBag, Store } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "More", href: "/about", icon: MoreHorizontal },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.href === "/cart" && count > 0 ? (
                  <span className="absolute right-[22%] top-1.5 h-4 min-w-4 rounded-full bg-highlight px-1 text-[9px] font-bold leading-4 text-primary-dark">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
