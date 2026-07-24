"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function AdminNavLink({ href, label, icon: Icon }: AdminNavLinkProps) {
  const pathname = usePathname();
  const active =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-primary text-white"
          : "text-muted hover:bg-surface-soft hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
