"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  /** Navbar uses a compact height; footer/admin can be larger. */
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const sizes = {
  sm: { height: 40, width: 40, className: "h-10 w-10" },
  md: { height: 56, width: 56, className: "h-14 w-14" },
  lg: { height: 96, width: 96, className: "h-24 w-24" },
} as const;

export function BrandLogo({
  href = "/",
  className,
  size = "sm",
  priority = false,
}: BrandLogoProps) {
  const site = useSiteConfig();
  const dim = sizes[size];

  const image = (
    <Image
      src="/frannystidy.png"
      alt={site.name}
      width={dim.width}
      height={dim.height}
      priority={priority}
      className={cn(
        "rounded-md object-contain",
        dim.className,
        className,
      )}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label={site.name}
    >
      {image}
    </Link>
  );
}
