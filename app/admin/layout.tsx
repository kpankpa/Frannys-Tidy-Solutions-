"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Settings,
  Users,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface p-5 md:block">
          <p className="text-lg font-extrabold text-primary">Frannys Admin</p>
          <p className="mt-1 text-xs text-muted">Operations dashboard</p>
          <nav className="mt-8 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-surface-soft hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-4 backdrop-blur md:px-8">
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard</p>
              <p className="text-xs text-muted">Demo UI. No backend connected.</p>
            </div>
            <nav className="flex gap-2 overflow-x-auto md:hidden">
              {links.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 rounded-full bg-surface-soft px-3 py-1.5 text-xs font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
