export type PromoPlacement = "home" | "everywhere" | "both";

export type PromoImageFit = "cover" | "contain";

export type PromoBanner = {
  enabled: boolean;
  title: string;
  image: string;
  link: string;
  alt: string;
  placement: PromoPlacement;
  /** 0 to 100, horizontal focal point for object-position. */
  imageFocusX: number;
  /** 0 to 100, vertical focal point for object-position. */
  imageFocusY: number;
  /** 50 to 200, zoom percentage (100 = default). */
  imageZoom: number;
  /** cover fills the banner; contain shows the full image. */
  imageFit: PromoImageFit;
  /** YYYY-MM-DD, optional start (inclusive). */
  showFrom: string;
  /** YYYY-MM-DD, optional end (inclusive). */
  showUntil: string;
};

export const DEFAULT_PROMO_BANNER: PromoBanner = {
  enabled: false,
  title: "",
  image: "",
  link: "",
  alt: "Seasonal promotion",
  placement: "home",
  imageFocusX: 50,
  imageFocusY: 50,
  imageZoom: 100,
  imageFit: "cover",
  showFrom: "",
  showUntil: "",
};

/** Less extreme than 21:9 so portrait flyers crop less aggressively. */
export const PROMO_SPOTLIGHT_ASPECT_CLASS = "aspect-[3/2] sm:aspect-[2/1]";

function clampFocus(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function parseFocus(value: unknown, fallback = 50) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return clampFocus(parsed);
}

export function promoImagePosition(focusX: number, focusY: number) {
  return `${clampFocus(focusX)}% ${clampFocus(focusY)}%`;
}

export function parseZoom(value: unknown, fallback = 100) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(200, Math.max(50, Math.round(parsed)));
}

function parseFit(value: unknown): PromoImageFit {
  return value === "contain" ? "contain" : "cover";
}

function parsePlacement(value: unknown): PromoPlacement {
  if (value === "everywhere" || value === "both") return value;
  return "home";
}

export function parsePromoBanner(raw: string | undefined): PromoBanner {
  if (!raw?.trim()) return { ...DEFAULT_PROMO_BANNER };

  try {
    const parsed = JSON.parse(raw) as Partial<PromoBanner>;
    return {
      enabled: parsed.enabled === true,
      title: String(parsed.title ?? "").trim().slice(0, 120),
      image: String(parsed.image ?? "").trim(),
      link: String(parsed.link ?? "").trim().slice(0, 500),
      alt: String(parsed.alt ?? "Seasonal promotion").trim().slice(0, 160),
      placement: parsePlacement(parsed.placement),
      imageFocusX: parseFocus(parsed.imageFocusX, 50),
      imageFocusY: parseFocus(parsed.imageFocusY, 50),
      imageZoom: parseZoom(parsed.imageZoom, 100),
      imageFit: parseFit(parsed.imageFit),
      showFrom: String(parsed.showFrom ?? "").trim().slice(0, 10),
      showUntil: String(parsed.showUntil ?? "").trim().slice(0, 10),
    };
  } catch {
    return { ...DEFAULT_PROMO_BANNER };
  }
}

function dayStart(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dayEnd(isoDate: string) {
  const date = new Date(`${isoDate}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isPromoLive(
  promo: PromoBanner,
  now: Date = new Date(),
): boolean {
  if (!promo.enabled || !promo.image.trim()) return false;

  if (promo.showFrom) {
    const start = dayStart(promo.showFrom);
    if (start && now < start) return false;
  }

  if (promo.showUntil) {
    const end = dayEnd(promo.showUntil);
    if (end && now > end) return false;
  }

  return true;
}

export function showPromoSpotlight(promo: PromoBanner, now?: Date) {
  if (!isPromoLive(promo, now)) return false;
  return promo.placement === "home" || promo.placement === "both";
}

export function showPromoRibbon(promo: PromoBanner, now?: Date) {
  if (!isPromoLive(promo, now)) return false;
  return promo.placement === "everywhere" || promo.placement === "both";
}

export function promoDismissStorageKey(promo: PromoBanner) {
  return `frannys-promo-dismiss:${promo.image}:${promo.showUntil}:${promo.title}`;
}

export function sanitizePromoLink(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed.includes("..") || trimmed.includes("\\")) return "";
    if (!/^\/[A-Za-z0-9._/?#=&%-]*$/.test(trimmed)) return "";
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }

  return "";
}
