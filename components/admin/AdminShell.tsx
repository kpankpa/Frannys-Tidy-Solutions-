"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LOGO_URL } from "@/lib/site-config";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  Package,
  Settings,
  Sparkles,
  Tags,
  Megaphone,
  Images,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminNavBadges } from "@/lib/db/stats";

type BadgeKey = keyof AdminNavBadges;

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  badgeKey?: BadgeKey;
};

const navGroups: { label: string; links: NavLink[] }[] = [
  {
    label: "Operations",
    links: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      {
        href: "/admin/orders",
        label: "Orders",
        icon: ClipboardList,
        badgeKey: "pendingOrders",
      },
      {
        href: "/admin/bookings",
        label: "Bookings",
        icon: CalendarDays,
        badgeKey: "requestedBookings",
      },
      {
        href: "/admin/services",
        label: "Cleaning services",
        icon: Sparkles,
      },
      {
        href: "/admin/products",
        label: "Products",
        icon: Package,
        badgeKey: "outOfStockProducts",
      },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/media", label: "Media", icon: Images },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Business",
    links: [
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      {
        href: "/admin/complaints",
        label: "Complaints",
        icon: MessageSquareWarning,
        badgeKey: "openComplaints",
      },
    ],
  },
  {
    label: "Website",
    links: [
      { href: "/admin/content", label: "Site content", icon: FileText },
      { href: "/admin/promotions", label: "Promotions", icon: Megaphone },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavBadge({
  count,
  active,
}: {
  count: number;
  active: boolean;
}) {
  if (count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  return (
    <span
      className={cn(
        "ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
        active
          ? "bg-white/20 text-white"
          : "bg-highlight text-primary-dark",
      )}
    >
      {label}
    </span>
  );
}

function NavItems({
  pathname,
  badges,
  onNavigate,
}: {
  pathname: string;
  badges: AdminNavBadges;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.links.map((link) => {
              const Icon = link.icon;
              const active = isActive(pathname, link.href);
              const count = link.badgeKey ? badges[link.badgeKey] : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-surface-soft hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                  <NavBadge count={count} active={active} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

type AdminShellProps = {
  brandName: string;
  logoUrl: string;
  email: string;
  displayName: string;
  badges: AdminNavBadges;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
};

export function AdminShell({
  brandName,
  logoUrl,
  email,
  displayName,
  badges,
  logoutAction,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle =
    navGroups
      .flatMap((g) => g.links)
      .find((l) => isActive(pathname, l.href))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface p-5 md:flex">
          <Link
            href="/admin"
            className="inline-flex items-center gap-3"
            aria-label={`${brandName} admin`}
          >
            <Image
              src={logoUrl || DEFAULT_LOGO_URL}
              alt={brandName}
              width={140}
              height={56}
              unoptimized
              className="h-11 w-auto max-w-[8rem] object-contain"
            />
            <span>
              <span className="block text-sm font-extrabold text-primary">
                Business Hub
              </span>
              <span className="block truncate text-xs text-muted">{email}</span>
            </span>
          </Link>

          <div className="mt-8 flex-1">
            <NavItems pathname={pathname} badges={badges} />
          </div>

          <div className="mt-8 space-y-3 border-t border-border pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              View website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-primary-dark/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col overflow-y-auto bg-surface p-5 shadow-xl">
              <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold text-primary">Menu</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-muted hover:bg-surface-soft"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavItems
                pathname={pathname}
                badges={badges}
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="mt-8 space-y-3 border-t border-border pt-6">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  View website
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </form>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur md:px-8 md:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-border bg-surface md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {pageTitle}
                </p>
                <p className="truncate text-xs text-muted">
                  {displayName} · {brandName}
                </p>
              </div>
            </div>
            <form action={logoutAction} className="md:hidden">
              <button
                type="submit"
                className="rounded-full bg-surface-soft px-3 py-1.5 text-xs font-semibold"
              >
                Sign out
              </button>
            </form>
          </header>
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
