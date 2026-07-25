const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
]);

const SOCIAL_HOST_HINTS = [
  "instagram.com",
  "www.instagram.com",
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
];

export function clampText(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Social profile links: https only, optional host hint. */
export function sanitizeSocialUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const known = SOCIAL_HOST_HINTS.some(
      (hint) => host === hint || host.endsWith(`.${hint.replace(/^www\./, "")}`),
    );
    // Allow https URLs even if host is unusual (brand may use linktree later),
    // but never javascript:/data:.
    if (!known && !host.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Product image URLs: site-relative /uploads/... or allowlisted https hosts.
 */
export function sanitizeImageUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/uploads/")) {
    if (trimmed.includes("..") || trimmed.includes("\\")) return null;
    if (!/^\/uploads\/[A-Za-z0-9._-]+$/.test(trimmed)) return null;
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function sanitizeImageUrlList(rawLines: string[]): string[] {
  const out: string[] = [];
  for (const line of rawLines) {
    const safe = sanitizeImageUrl(line);
    if (safe) out.push(safe);
  }
  return out;
}

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export const LIMITS = {
  name: 80,
  phone: 20,
  address: 240,
  notes: 500,
  serviceType: 80,
  location: 160,
  message: 800,
  orderNumber: 32,
  subject: 160,
  details: 2000,
  maxCartLines: 30,
  maxQtyPerLine: 50,
} as const;
