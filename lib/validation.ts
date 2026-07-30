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
 * Product image URLs: site-relative /uploads/... or https (admin-only saves).
 * Blocks javascript/data and path traversal.
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
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function explainInvalidImageUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "URL is empty.";
  if (trimmed.startsWith("/uploads/")) {
    return "Upload path looks invalid. Use a file uploaded through this form.";
  }
  if (trimmed.startsWith("http://")) {
    return "Use https image URLs only (not http).";
  }
  return "Use an uploaded file path (/uploads/...) or a full https image URL.";
}

export function sanitizeImageUrlList(rawLines: string[]): {
  urls: string[];
  rejected: string[];
} {
  const urls: string[] = [];
  const rejected: string[] = [];
  for (const line of rawLines) {
    const safe = sanitizeImageUrl(line);
    if (safe) urls.push(safe);
    else if (line.trim()) rejected.push(line.trim());
  }
  return { urls, rejected };
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
