"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { DEFAULT_LOGO_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "nav" | "md" | "lg";
  priority?: boolean;
};

const sizes = {
  sm: { width: 120, height: 48, className: "max-h-9 w-auto max-w-[6.5rem]" },
  md: { width: 160, height: 64, className: "max-h-12 w-auto max-w-[9rem]" },
  nav: {
    width: 280,
    height: 112,
    className:
      "max-h-[4.25rem] w-auto max-w-[12rem] sm:max-h-[4.75rem] sm:max-w-[13rem] md:max-h-[5.25rem] md:max-w-[15rem]",
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
      className="inline-flex h-full max-h-full shrink-0 items-center overflow-hidden"
      aria-label={site.name}
    >
      {image}
    </Link>
  );
}
