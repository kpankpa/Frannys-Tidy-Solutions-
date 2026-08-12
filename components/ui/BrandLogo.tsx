"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { DEFAULT_LOGO_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "nav" | "md" | "lg" | "footer";
  priority?: boolean;
};

const sizes = {
  sm: { width: 120, height: 48, className: "max-h-9 w-auto max-w-[6.5rem]" },
  md: { width: 160, height: 64, className: "max-h-12 w-auto max-w-[9rem]" },
  nav: {
    width: 360,
    height: 144,
    className:
      "max-h-14 w-auto max-w-full sm:max-h-[5.5rem] md:max-h-[6.75rem] lg:max-h-[7.5rem]",
  },
  footer: {
    width: 300,
    height: 120,
    className: "max-h-24 w-auto max-w-[16rem] sm:max-h-28 sm:max-w-[18rem]",
  },
  lg: { width: 200, height: 80, className: "max-h-16 w-auto max-w-[10rem]" },
} as const;

export function BrandLogo({
  href = "/",
  className,
  size = "sm",
  priority = false,
}: BrandLogoProps) {
  const site = useSiteConfig();
  const dim = sizes[size];

  const src = site.logoUrl || DEFAULT_LOGO_URL;
  const unoptimized =
    src.startsWith("/uploads/") || src.startsWith("https://");

  const image = (
    <Image
      src={src}
      alt={site.name}
      width={dim.width}
      height={dim.height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn("h-auto w-auto object-contain object-left", dim.className, className)}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex max-w-full items-center overflow-hidden",
        size === "nav" && "h-full max-h-full",
      )}
      aria-label={site.name}
    >
      {image}
    </Link>
  );
}
