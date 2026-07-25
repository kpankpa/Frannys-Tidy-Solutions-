import { SITE, SOCIAL } from "@/lib/constants";
import { cedisToPesewas, pesewasToCedis } from "@/lib/money";
import { cleaningServices, whyChooseUs } from "@/lib/services";
import { CONTACT_TOPICS } from "@/lib/contact-page";
import { SERVICE_PROMISES } from "@/lib/services-page";

export const SETTING_KEYS = {
  businessName: "business_name",
  tagline: "tagline",
  description: "description",
  address: "business_address",
  phone: "phone",
  phoneDisplay: "phone_display",
  whatsapp: "whatsapp_number",
  whatsappE164: "whatsapp_e164",
  email: "email",
  hours: "business_hours",
  hoursShort: "business_hours_short",
  deliveryFeePesewas: "delivery_fee_pesewas",
  heroHeadline: "hero_headline",
  heroSubcopy: "hero_subcopy",
  aboutBlurb: "about_blurb",
  aboutHeadline: "about_headline",
  aboutIntro: "about_intro",
  aboutStory: "about_story",
  aboutMission: "about_mission",
  aboutVision: "about_vision",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
  shopHeroHeadline: "shop_hero_headline",
  shopHeroSubcopy: "shop_hero_subcopy",
  servicesHeroHeadline: "services_hero_headline",
  servicesHeroSubcopy: "services_hero_subcopy",
  servicesSectionHeadline: "services_section_headline",
  servicesSectionSubcopy: "services_section_subcopy",
  whyBookSubcopy: "why_book_subcopy",
  contactHeroHeadline: "contact_hero_headline",
  contactHeroSubcopy: "contact_hero_subcopy",
  contactTopicsHeadline: "contact_topics_headline",
  contactTopics: "contact_topics",
  homeWhyTitle: "home_why_title",
  homeWhyDescription: "home_why_description",
  whyChooseItems: "why_choose_items",
  serviceItems: "service_items",
  servicePromises: "service_promises",
  homeServicesTitle: "home_services_title",
  homeServicesDescription: "home_services_description",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export type ContentItem = { title: string; description: string };
export type ServiceContentItem = {
  id: string;
  title: string;
  description: string;
};
export type PromiseItem = { title: string; body: string };

const DEFAULT_WHY_CHOOSE: ContentItem[] = whyChooseUs.map((item) => ({
  title: item.title,
  description: item.description,
}));

const DEFAULT_SERVICE_ITEMS: ServiceContentItem[] = cleaningServices.map(
  (s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
  }),
);

const DEFAULT_PROMISES: PromiseItem[] = SERVICE_PROMISES.map((p) => ({
  title: p.title,
  body: p.body,
}));

const DEFAULT_CONTACT_TOPICS = [...CONTACT_TOPICS];

export const SETTINGS_DEFAULTS: Record<SettingKey, string> = {
  business_name: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  business_address: SITE.address,
  phone: SITE.phone,
  phone_display: SITE.phoneDisplay,
  whatsapp_number: SITE.whatsapp,
  whatsapp_e164: SITE.whatsappE164,
  email: SITE.email,
  business_hours: SITE.hours,
  business_hours_short: SITE.hoursShort,
  delivery_fee_pesewas: String(cedisToPesewas(SITE.deliveryFee)),
  hero_headline: "Cleaning Made Easy,\nFreshness Guaranteed.",
  hero_subcopy:
    "Premium detergents and professional cleaning for Ghanaian homes and businesses, delivered with clinical care and hospitality standards.",
  about_blurb:
    "A proudly Ghanaian cleaning brand crafting detergents and professional services for healthier everyday spaces.",
  about_headline: "Freshness with clinical care, made for Ghanaian life",
  about_intro:
    "We manufacture trusted cleaning products and deliver professional services so homes and businesses can feel genuinely clean, calm, and cared for.",
  about_story:
    "Established in 2023 and registered in 2025, Frannys Tidy Solutions is headquartered in East Legon Hills, Accra. We began with a clear frustration: too many cleaning options promised shine without lasting care. So we built both sides of the solution ourselves. Today our detergents are stocked by retail partners in Accra and Mampong, while our trained teams serve households, offices, and community spaces with hospitality-level standards.",
  about_mission:
    "To help Ghanaian homes and businesses enjoy superior cleaning products and professional services that promote hygiene, comfort, and well-being at prices that feel fair and accessible.",
  about_vision:
    "To become Ghana's most trusted cleaning solutions brand, known for reliable formulas, respectful service, and healthier communities from Accra outward.",
  instagram_url: SOCIAL.instagram,
  tiktok_url: SOCIAL.tiktok,
  shop_hero_headline: "Shop Frannys products",
  shop_hero_subcopy:
    "Liquid soap, fabric softener, glass cleaner, bathroom cleaner, toilet cleaner, floor detergent, and multi-purpose bleach. Formulated for everyday Ghanaian homes.",
  services_hero_headline: "Professional care for every space",
  services_hero_subcopy:
    "Clinical-grade hygiene with hospitality standards for homes, offices, hotels, schools, churches, and businesses across Accra.",
  services_section_headline: "Cleaning services for real Ghanaian spaces",
  services_section_subcopy:
    "Choose the service that fits, then book. We confirm the plan on WhatsApp before our team arrives.",
  why_book_subcopy: "Cleaning backed by the products we make.",
  contact_hero_headline: "Get in touch",
  contact_hero_subcopy:
    "Send us an email for products, bookings, and support. Phone and WhatsApp are also available if you need a quicker chat.",
  contact_topics_headline: "Common reasons people reach out",
  contact_topics: JSON.stringify(DEFAULT_CONTACT_TOPICS),
  home_why_title: "Why Choose Frannys?",
  home_why_description: "The clinical premium standard for Ghanaian homes.",
  why_choose_items: JSON.stringify(DEFAULT_WHY_CHOOSE),
  service_items: JSON.stringify(DEFAULT_SERVICE_ITEMS),
  service_promises: JSON.stringify(DEFAULT_PROMISES),
  home_services_title: "Onsite Cleaning Services",
  home_services_description:
    "Homes, offices, hotels, schools, churches, and commercial spaces across Ghana.",
};

function parseJsonArray<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function parseStringList(raw: string | undefined, fallback: string[]): string[] {
  const fromJson = parseJsonArray<string>(raw, []);
  if (fromJson.length > 0 && fromJson.every((x) => typeof x === "string")) {
    return fromJson.map((s) => s.trim()).filter(Boolean);
  }
  // Also accept newline-separated plain text from the admin form.
  const lines = (raw ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : fallback;
}

function parseWhyChoose(raw: string | undefined): ContentItem[] {
  const items = parseJsonArray<ContentItem>(raw, DEFAULT_WHY_CHOOSE);
  return items
    .filter((item) => item && typeof item.title === "string")
    .map((item) => ({
      title: String(item.title).trim(),
      description: String(item.description ?? "").trim(),
    }))
    .filter((item) => item.title);
}

function parseServiceItems(raw: string | undefined): ServiceContentItem[] {
  const items = parseJsonArray<ServiceContentItem>(raw, DEFAULT_SERVICE_ITEMS);
  const byId = new Map(
    items
      .filter((item) => item && typeof item.id === "string")
      .map((item) => [
        item.id,
        {
          id: item.id,
          title: String(item.title ?? "").trim(),
          description: String(item.description ?? "").trim(),
        },
      ]),
  );

  return DEFAULT_SERVICE_ITEMS.map((fallback) => {
    const override = byId.get(fallback.id);
    if (!override?.title) return fallback;
    return {
      id: fallback.id,
      title: override.title,
      description: override.description || fallback.description,
    };
  });
}

function parsePromises(raw: string | undefined): PromiseItem[] {
  const items = parseJsonArray<PromiseItem>(raw, DEFAULT_PROMISES);
  const cleaned = items
    .filter((item) => item && typeof item.title === "string")
    .map((item) => ({
      title: String(item.title).trim(),
      body: String(item.body ?? "").trim(),
    }))
    .filter((item) => item.title);
  return cleaned.length > 0 ? cleaned : DEFAULT_PROMISES;
}

export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappE164: string;
  email: string;
  hours: string;
  hoursShort: string;
  deliveryFee: number;
  heroHeadline: string;
  heroSubcopy: string;
  aboutBlurb: string;
  aboutHeadline: string;
  aboutIntro: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  instagramUrl: string;
  tiktokUrl: string;
  shopHeroHeadline: string;
  shopHeroSubcopy: string;
  servicesHeroHeadline: string;
  servicesHeroSubcopy: string;
  servicesSectionHeadline: string;
  servicesSectionSubcopy: string;
  whyBookSubcopy: string;
  contactHeroHeadline: string;
  contactHeroSubcopy: string;
  contactTopicsHeadline: string;
  contactTopics: string[];
  homeWhyTitle: string;
  homeWhyDescription: string;
  whyChooseItems: ContentItem[];
  serviceItems: ServiceContentItem[];
  servicePromises: PromiseItem[];
  homeServicesTitle: string;
  homeServicesDescription: string;
};

export function siteConfigFromMap(s: Record<string, string>): SiteConfig {
  const feePesewas = Number(s[SETTING_KEYS.deliveryFeePesewas]);

  return {
    name: s[SETTING_KEYS.businessName] || SITE.name,
    shortName: SITE.shortName,
    tagline: s[SETTING_KEYS.tagline] || SITE.tagline,
    description: s[SETTING_KEYS.description] || SITE.description,
    address: s[SETTING_KEYS.address] || SITE.address,
    phone: s[SETTING_KEYS.phone] || SITE.phone,
    phoneDisplay: s[SETTING_KEYS.phoneDisplay] || SITE.phoneDisplay,
    whatsapp: s[SETTING_KEYS.whatsapp] || SITE.whatsapp,
    whatsappE164: s[SETTING_KEYS.whatsappE164] || SITE.whatsappE164,
    email: s[SETTING_KEYS.email] || SITE.email,
    hours: s[SETTING_KEYS.hours] || SITE.hours,
    hoursShort: s[SETTING_KEYS.hoursShort] || SITE.hoursShort,
    deliveryFee: Number.isFinite(feePesewas)
      ? pesewasToCedis(feePesewas)
      : SITE.deliveryFee,
    heroHeadline: s[SETTING_KEYS.heroHeadline] || SETTINGS_DEFAULTS.hero_headline,
    heroSubcopy: s[SETTING_KEYS.heroSubcopy] || SETTINGS_DEFAULTS.hero_subcopy,
    aboutBlurb: s[SETTING_KEYS.aboutBlurb] || SETTINGS_DEFAULTS.about_blurb,
    aboutHeadline:
      s[SETTING_KEYS.aboutHeadline] || SETTINGS_DEFAULTS.about_headline,
    aboutIntro: s[SETTING_KEYS.aboutIntro] || SETTINGS_DEFAULTS.about_intro,
    aboutStory: s[SETTING_KEYS.aboutStory] || SETTINGS_DEFAULTS.about_story,
    aboutMission:
      s[SETTING_KEYS.aboutMission] || SETTINGS_DEFAULTS.about_mission,
    aboutVision: s[SETTING_KEYS.aboutVision] || SETTINGS_DEFAULTS.about_vision,
    instagramUrl: s[SETTING_KEYS.instagramUrl] ?? SOCIAL.instagram,
    tiktokUrl: s[SETTING_KEYS.tiktokUrl] ?? SOCIAL.tiktok,
    shopHeroHeadline:
      s[SETTING_KEYS.shopHeroHeadline] || SETTINGS_DEFAULTS.shop_hero_headline,
    shopHeroSubcopy:
      s[SETTING_KEYS.shopHeroSubcopy] || SETTINGS_DEFAULTS.shop_hero_subcopy,
    servicesHeroHeadline:
      s[SETTING_KEYS.servicesHeroHeadline] ||
      SETTINGS_DEFAULTS.services_hero_headline,
    servicesHeroSubcopy:
      s[SETTING_KEYS.servicesHeroSubcopy] ||
      SETTINGS_DEFAULTS.services_hero_subcopy,
    servicesSectionHeadline:
      s[SETTING_KEYS.servicesSectionHeadline] ||
      SETTINGS_DEFAULTS.services_section_headline,
    servicesSectionSubcopy:
      s[SETTING_KEYS.servicesSectionSubcopy] ||
      SETTINGS_DEFAULTS.services_section_subcopy,
    whyBookSubcopy:
      s[SETTING_KEYS.whyBookSubcopy] || SETTINGS_DEFAULTS.why_book_subcopy,
    contactHeroHeadline:
      s[SETTING_KEYS.contactHeroHeadline] ||
      SETTINGS_DEFAULTS.contact_hero_headline,
    contactHeroSubcopy:
      s[SETTING_KEYS.contactHeroSubcopy] ||
      SETTINGS_DEFAULTS.contact_hero_subcopy,
    contactTopicsHeadline:
      s[SETTING_KEYS.contactTopicsHeadline] ||
      SETTINGS_DEFAULTS.contact_topics_headline,
    contactTopics: parseStringList(
      s[SETTING_KEYS.contactTopics],
      DEFAULT_CONTACT_TOPICS,
    ),
    homeWhyTitle:
      s[SETTING_KEYS.homeWhyTitle] || SETTINGS_DEFAULTS.home_why_title,
    homeWhyDescription:
      s[SETTING_KEYS.homeWhyDescription] ||
      SETTINGS_DEFAULTS.home_why_description,
    whyChooseItems: parseWhyChoose(s[SETTING_KEYS.whyChooseItems]),
    serviceItems: parseServiceItems(s[SETTING_KEYS.serviceItems]),
    servicePromises: parsePromises(s[SETTING_KEYS.servicePromises]),
    homeServicesTitle:
      s[SETTING_KEYS.homeServicesTitle] ||
      SETTINGS_DEFAULTS.home_services_title,
    homeServicesDescription:
      s[SETTING_KEYS.homeServicesDescription] ||
      SETTINGS_DEFAULTS.home_services_description,
  };
}

export function getDefaultSiteConfig(): SiteConfig {
  return siteConfigFromMap({ ...SETTINGS_DEFAULTS });
}
