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

/** Hyphen is last so it is literal, not a character-class range. */
const SAFE_PATH_SEGMENT = /^[A-Za-z0-9._+()[\]' ,&@-]+$/;
const IMAGE_FILE_EXT = /\.(?:jpe?g|png|gif|webp|svg|avif)$/i;

function decodePathSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

/**
 * Site-relative image path: /flyers/..., /people-images/..., /uploads/...,
 * /move-in/..., or a root public file such as /frannys-logo.jpg.
 */
function sanitizeSiteImagePath(trimmed: string): string | null {
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  if (trimmed.includes("..") || trimmed.includes("\\")) return null;

  const pathOnly = trimmed.split(/[?#]/, 1)[0] ?? "";
  const segments = pathOnly.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > 8) return null;

  const cleaned: string[] = [];
  for (const segment of segments) {
    const decoded = decodePathSegment(segment);
    if (
      !decoded ||
      decoded.includes("..") ||
      decoded.includes("/") ||
      decoded.includes("\\")
    ) {
      return null;
    }
    if (!SAFE_PATH_SEGMENT.test(decoded)) return null;
    cleaned.push(encodeURIComponent(decoded));
  }

  const last = decodePathSegment(cleaned[cleaned.length - 1] ?? "");
  if (!last || !IMAGE_FILE_EXT.test(last)) return null;

  return `/${cleaned.join("/")}`;
}

function sanitizeHttpsImageUrl(trimmed: string): string | null {
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Image URLs used in admin saves: site-relative public path or https.
 * Blocks javascript/data, http, and path traversal.
 */
export function sanitizeImageUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return sanitizeSiteImagePath(trimmed) ?? sanitizeHttpsImageUrl(trimmed);
}

/** Same rules as sanitizeImageUrl; empty string means "use the default". */
export function sanitizeLogoUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return sanitizeImageUrl(trimmed);
}

export function explainInvalidImageUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "URL is empty.";
  if (trimmed.startsWith("http://")) {
    return "Use https image URLs only (not http).";
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return "Site path looks invalid. Use a public file such as /flyers/..., /uploads/..., or upload a file.";
  }
  return "Use a site path (/flyers/..., /uploads/...) or a full https image URL.";
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
