import type { Metadata } from "next";

/** Primary public origin from env (no trailing slash). */
export function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

/** Hostname from NEXT_PUBLIC_SITE_URL, or null if unset/invalid. */
export function canonicalSiteHostname(): string | null {
  try {
    return new URL(siteOrigin()).hostname.toLowerCase();
  } catch {
    return null;
  }
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
} & Partial<Metadata>;

/** Shared page metadata with a canonical path (relative to metadataBase). */
export function pageMetadata({
  title,
  description,
  path,
  ...rest
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...rest,
  };
}

/** Utility pages that should not compete for indexing. */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: true },
};
