import { SITE, SOCIAL } from "@/lib/constants";
import {
  DEFAULT_ABOUT_DIFFERENCE,
  DEFAULT_ABOUT_JOURNEY,
  DEFAULT_ABOUT_PROMISE,
  DEFAULT_ABOUT_TRUST,
  DEFAULT_ABOUT_VALUES,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_SERVICE_PROCESS,
  DEFAULT_SERVICE_SPACES,
  parseHowItWorksList,
  parseJourneyList,
  parseProcessList,
  parseTitleBodyList,
  type HowItWorksItem,
  type JourneyItem,
  type ProcessItem,
  type TitleBodyItem,
} from "@/lib/cms-lists";
import { CONTACT_TOPICS } from "@/lib/contact-page";
import { cedisToPesewas, pesewasToCedis } from "@/lib/money";
import {
  cleaningServices,
  testimonials as defaultTestimonials,
  whyChooseUs,
} from "@/lib/services";
import { SERVICE_PROMISES } from "@/lib/services-page";
import {
  DEFAULT_PROMO_BANNER,
  parsePromoBanner,
  type PromoBanner,
} from "@/lib/promotions";
import { FLYERS } from "@/lib/flyers";

export type {
  HowItWorksItem,
  JourneyItem,
  ProcessItem,
  TitleBodyItem,
} from "@/lib/cms-lists";

export type { PromoBanner } from "@/lib/promotions";

export const SETTING_KEYS = {
  businessName: "business_name",
  shortName: "short_name",
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
  locationBlurb: "location_blurb",
  heroHomeImage: "hero_home_image",
  heroHeadline: "hero_headline",
  heroSubcopy: "hero_subcopy",
  heroCtaPrimary: "hero_cta_primary",
  heroCtaSecondary: "hero_cta_secondary",
  aboutBlurb: "about_blurb",
  aboutHeadline: "about_headline",
  aboutIntro: "about_intro",
  aboutStory: "about_story",
  aboutMission: "about_mission",
  aboutVision: "about_vision",
  aboutPromise: "about_promise",
  aboutHeroImage: "about_hero_image",
  aboutStoryImage: "about_story_image",
  aboutDealerImage: "about_dealer_image",
  aboutPromiseImage: "about_promise_image",
  aboutValues: "about_values",
  aboutJourney: "about_journey",
  aboutDifference: "about_difference",
  aboutTrustPoints: "about_trust_points",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
  shopHeroHeadline: "shop_hero_headline",
  shopHeroSubcopy: "shop_hero_subcopy",
  shopHeroImage: "shop_hero_image",
  servicesHeroHeadline: "services_hero_headline",
  servicesHeroSubcopy: "services_hero_subcopy",
  servicesHeroImage: "services_hero_image",
  servicesSectionHeadline: "services_section_headline",
  servicesSectionSubcopy: "services_section_subcopy",
  whyBookSubcopy: "why_book_subcopy",
  serviceProcess: "service_process",
  serviceProcessTitle: "service_process_title",
  serviceProcessSubcopy: "service_process_subcopy",
  serviceSpaces: "service_spaces",
  serviceSpacesTitle: "service_spaces_title",
  serviceSpacesImage: "service_spaces_image",
  packagesHeadline: "packages_headline",
  packagesSubcopy: "packages_subcopy",
  contactHeroHeadline: "contact_hero_headline",
  contactHeroSubcopy: "contact_hero_subcopy",
  contactHeroImage: "contact_hero_image",
  contactTopicsHeadline: "contact_topics_headline",
  contactTopics: "contact_topics",
  homeWhyTitle: "home_why_title",
  homeWhyDescription: "home_why_description",
  whyChooseItems: "why_choose_items",
  howItWorks: "how_it_works",
  homeHowTitle: "home_how_title",
  homeHowDescription: "home_how_description",
  homeShopTitle: "home_shop_title",
  homeShopDescription: "home_shop_description",
  homeShopCta: "home_shop_cta",
  homeCtaTitle: "home_cta_title",
  homeCtaDescription: "home_cta_description",
  testimonialsTitle: "testimonials_title",
  testimonialsDescription: "testimonials_description",
  serviceItems: "service_items",
  servicePromises: "service_promises",
  servicePackages: "service_packages",
  testimonials: "testimonials",
  googleMapsUrl: "google_maps_url",
  logoUrl: "logo_url",
  receiptTitle: "receipt_title",
  receiptFooter: "receipt_footer",
  receiptNote: "receipt_note",
  homeServicesTitle: "home_services_title",
  homeServicesDescription: "home_services_description",
  promoBanner: "promo_banner",
} as const;

export const DEFAULT_LOGO_URL = "/frannystidy.png";
export const DEFAULT_HERO_HOME_IMAGE = "/hero-home.png";
export const DEFAULT_SHOP_HERO_IMAGE = FLYERS.productLineup.src;
export const DEFAULT_SERVICES_HERO_IMAGE = FLYERS.brandProducts.src;
export const DEFAULT_CONTACT_HERO_IMAGE = FLYERS.freshness.src;
export const DEFAULT_ABOUT_HERO_IMAGE = FLYERS.aboutHero.src;
export const DEFAULT_ABOUT_STORY_IMAGE = FLYERS.brandProducts.src;
export const DEFAULT_ABOUT_DEALER_IMAGE = FLYERS.dealerFlyer.src;
export const DEFAULT_ABOUT_PROMISE_IMAGE = "/cleaning-illus.jpg";
export const DEFAULT_SERVICE_SPACES_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export type ContentItem = { title: string; description: string };
export type ServiceContentItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  /** Optional "from" price in cedis for packages catalogue. */
  priceFromCedis?: number | null;
};
export type PromiseItem = { title: string; body: string };
export type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
};
export type ServicePackageItem = {
  name: string;
  description: string;
  priceFromCedis: number;
};

const DEFAULT_WHY_CHOOSE: ContentItem[] = whyChooseUs.map((item) => ({
  title: item.title,
  description: item.description,
}));

const DEFAULT_SERVICE_ITEMS: ServiceContentItem[] = cleaningServices.map(
  (s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    image: s.image,
  }),
);

const DEFAULT_PROMISES: PromiseItem[] = SERVICE_PROMISES.map((p) => ({
  title: p.title,
  body: p.body,
}));

const DEFAULT_CONTACT_TOPICS = [...CONTACT_TOPICS];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = defaultTestimonials.map((t) => ({
  name: t.name,
  role: t.role,
  quote: t.quote,
  rating: t.rating,
  approved: true,
}));

const DEFAULT_SERVICE_PACKAGES: ServicePackageItem[] = [
  {
    name: "Studio / 1-bedroom refresh",
    description:
      "Professional home cleaning for compact Accra apartments. Ideal weekly or fortnightly upkeep.",
    priceFromCedis: 250,
  },
  {
    name: "2-bedroom deep clean",
    description:
      "Intensive deep cleaning for kitchens, bathrooms, and living areas. Perfect before guests or move-in.",
    priceFromCedis: 450,
  },
  {
    name: "Office tidy (half day)",
    description:
      "Office cleaning for small teams: desks, floors, washrooms, and shared spaces.",
    priceFromCedis: 400,
  },
];

export const SETTINGS_DEFAULTS: Record<SettingKey, string> = {
  business_name: SITE.name,
  short_name: SITE.shortName,
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
  location_blurb: "East Legon Hills, Accra",
  hero_home_image: DEFAULT_HERO_HOME_IMAGE,
  hero_headline: "Freshness Guaranteed Every Time",
  hero_subcopy: "",
  hero_cta_primary: "Explore Products",
  hero_cta_secondary: "Our Services",
  about_blurb:
    "Ghanaian cleaning company in Accra offering cleaning detergents, home cleaning, and office cleaning services.",
  about_headline: "About Frannys",
  about_intro:
    "Frannys Tidy Solutions is a registered Ghanaian cleaning company in East Legon Hills, Accra. We manufacture cleaning detergents and provide professional home cleaning and office cleaning services across Accra and surrounding areas.",
  about_story:
    "Frannys Tidy Solutions is a proudly Ghanaian-owned cleaning company specialising in cleaning detergents and professional cleaning services in Accra. Established in 2023 and formally registered, we serve households and businesses that need reliable cleaning products Ghana customers can trust. From our base in East Legon Hills, Accra, we manufacture detergents in-house and deliver on-site home cleaning, office cleaning, and commercial cleaning. Shop Frannys cleaning products through selected retail partners in Accra and Mampong, or book a professional cleaning service for a healthier space. We focus on effective, safe, and affordable cleaning solutions with clear customer care.",
  about_mission:
    "To provide homes and businesses in Ghana with superior cleaning products and professional cleaning services in Accra that promote hygiene, comfort, and well-being at accessible prices and with outstanding customer care.",
  about_vision:
    "To become the most trusted cleaning company in Ghana for detergents and professional cleaning services, known for reliability, quality, and cleaner communities across Accra and beyond.",
  about_promise: DEFAULT_ABOUT_PROMISE,
  about_hero_image: DEFAULT_ABOUT_HERO_IMAGE,
  about_story_image: DEFAULT_ABOUT_STORY_IMAGE,
  about_dealer_image: DEFAULT_ABOUT_DEALER_IMAGE,
  about_promise_image: DEFAULT_ABOUT_PROMISE_IMAGE,
  about_values: JSON.stringify(DEFAULT_ABOUT_VALUES),
  about_journey: JSON.stringify(DEFAULT_ABOUT_JOURNEY),
  about_difference: JSON.stringify(DEFAULT_ABOUT_DIFFERENCE),
  about_trust_points: JSON.stringify(DEFAULT_ABOUT_TRUST),
  instagram_url: SOCIAL.instagram,
  tiktok_url: SOCIAL.tiktok,
  shop_hero_headline: "Shop",
  shop_hero_subcopy: "",
  shop_hero_image: DEFAULT_SHOP_HERO_IMAGE,
  services_hero_headline: "Cleaning Services",
  services_hero_subcopy: "",
  services_hero_image: DEFAULT_SERVICES_HERO_IMAGE,
  services_section_headline: "Cleaning services for real Ghanaian spaces",
  services_section_subcopy:
    "Choose the service that fits, then book. We confirm the plan on WhatsApp before our team arrives.",
  why_book_subcopy: "Cleaning backed by the products we make.",
  service_process: JSON.stringify(DEFAULT_SERVICE_PROCESS),
  service_process_title: "How it works",
  service_process_subcopy: "A simple path from request to fresh space.",
  service_spaces: JSON.stringify(DEFAULT_SERVICE_SPACES),
  service_spaces_title: "Homes, workplaces, and community spaces",
  service_spaces_image: DEFAULT_SERVICE_SPACES_IMAGE,
  packages_headline: "Fixed-price packages",
  packages_subcopy:
    "Clear starting prices for common Accra homes and offices. Final quote confirmed on WhatsApp after we understand the space.",
  contact_hero_headline: "Contact",
  contact_hero_subcopy: "",
  contact_hero_image: DEFAULT_CONTACT_HERO_IMAGE,
  contact_topics_headline: "Common reasons people reach out",
  contact_topics: JSON.stringify(DEFAULT_CONTACT_TOPICS),
  home_why_title: "Why Choose Frannys?",
  home_why_description: "The clinical premium standard for Ghanaian homes.",
  why_choose_items: JSON.stringify(DEFAULT_WHY_CHOOSE),
  how_it_works: JSON.stringify(DEFAULT_HOW_IT_WORKS),
  home_how_title: "Ordering Made Simple",
  home_how_description: "Four easy steps from browse to delivery.",
  home_shop_title: "Premium Shop",
  home_shop_description: "Professional-grade detergents for your home.",
  home_shop_cta: "View Full Catalog",
  home_cta_title: "Ready for a Cleaner Space?",
  home_cta_description:
    "Join households and businesses across Ghana who trust Frannys for premium products and professional cleaning.",
  testimonials_title: "Loved by Homes & Businesses",
  testimonials_description:
    "Customer reviews for Frannys cleaning products and cleaning services in Accra.",
  service_items: JSON.stringify(DEFAULT_SERVICE_ITEMS),
  service_promises: JSON.stringify(DEFAULT_PROMISES),
  service_packages: JSON.stringify(DEFAULT_SERVICE_PACKAGES),
  testimonials: JSON.stringify(DEFAULT_TESTIMONIALS),
  google_maps_url: "",
  logo_url: DEFAULT_LOGO_URL,
  receipt_title: "Receipt",
  receipt_footer:
    "Thank you for choosing Frannys Tidy Solutions. Track your order anytime at /track-order.",
  receipt_note:
    "Payment: Mobile Money or cash on delivery as agreed. Keep this receipt for your records.",
  home_services_title: "Onsite Cleaning Services",
  home_services_description:
    "Homes, offices, hotels, schools, churches, and commercial spaces across Ghana.",
  promo_banner: JSON.stringify(DEFAULT_PROMO_BANNER),
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
  const cleaned = items
    .filter((item) => item && typeof item.id === "string")
    .map((item) => ({
      id: String(item.id).trim(),
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
      image: String(item.image ?? "").trim(),
    }))
    .filter((item) => item.id && item.title);

  return cleaned.length > 0 ? cleaned : DEFAULT_SERVICE_ITEMS;
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

function parseTestimonials(raw: string | undefined): TestimonialItem[] {
  const items = parseJsonArray<TestimonialItem>(raw, DEFAULT_TESTIMONIALS);
  const cleaned = items
    .filter((item) => item && typeof item.name === "string")
    .map((item) => ({
      name: String(item.name).trim().slice(0, 80),
      role: String(item.role ?? "").trim().slice(0, 120),
      quote: String(item.quote ?? "").trim().slice(0, 500),
      rating: Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5))),
      approved: item.approved !== false,
    }))
    .filter((item) => item.name && item.quote);
  return cleaned.length > 0 ? cleaned : DEFAULT_TESTIMONIALS;
}

function parseServicePackages(raw: string | undefined): ServicePackageItem[] {
  const items = parseJsonArray<ServicePackageItem>(raw, DEFAULT_SERVICE_PACKAGES);
  const cleaned = items
    .filter((item) => item && typeof item.name === "string")
    .map((item) => ({
      name: String(item.name).trim().slice(0, 120),
      description: String(item.description ?? "").trim().slice(0, 400),
      priceFromCedis: Math.max(0, Number(item.priceFromCedis) || 0),
    }))
    .filter((item) => item.name && item.priceFromCedis > 0);
  return cleaned.length > 0 ? cleaned : DEFAULT_SERVICE_PACKAGES;
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
  locationBlurb: string;
  heroHomeImage: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutBlurb: string;
  aboutHeadline: string;
  aboutIntro: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  aboutPromise: string;
  aboutHeroImage: string;
  aboutStoryImage: string;
  aboutDealerImage: string;
  aboutPromiseImage: string;
  aboutValues: TitleBodyItem[];
  aboutJourney: JourneyItem[];
  aboutDifference: TitleBodyItem[];
  aboutTrustPoints: TitleBodyItem[];
  instagramUrl: string;
  tiktokUrl: string;
  shopHeroHeadline: string;
  shopHeroSubcopy: string;
  shopHeroImage: string;
  servicesHeroHeadline: string;
  servicesHeroSubcopy: string;
  servicesHeroImage: string;
  servicesSectionHeadline: string;
  servicesSectionSubcopy: string;
  whyBookSubcopy: string;
  serviceProcess: ProcessItem[];
  serviceProcessTitle: string;
  serviceProcessSubcopy: string;
  serviceSpaces: TitleBodyItem[];
  serviceSpacesTitle: string;
  serviceSpacesImage: string;
  packagesHeadline: string;
  packagesSubcopy: string;
  contactHeroHeadline: string;
  contactHeroSubcopy: string;
  contactHeroImage: string;
  contactTopicsHeadline: string;
  contactTopics: string[];
  homeWhyTitle: string;
  homeWhyDescription: string;
  whyChooseItems: ContentItem[];
  howItWorks: HowItWorksItem[];
  homeHowTitle: string;
  homeHowDescription: string;
  homeShopTitle: string;
  homeShopDescription: string;
  homeShopCta: string;
  homeCtaTitle: string;
  homeCtaDescription: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  serviceItems: ServiceContentItem[];
  servicePromises: PromiseItem[];
  servicePackages: ServicePackageItem[];
  testimonials: TestimonialItem[];
  googleMapsUrl: string;
  logoUrl: string;
  receiptTitle: string;
  receiptFooter: string;
  receiptNote: string;
  homeServicesTitle: string;
  homeServicesDescription: string;
  promoBanner: PromoBanner;
};

function textOrDefault(raw: string | undefined, fallback: string) {
  const value = (raw ?? "").trim();
  return value || fallback;
}

export function siteConfigFromMap(s: Record<string, string>): SiteConfig {
  const feePesewas = Number(s[SETTING_KEYS.deliveryFeePesewas]);

  return {
    name: s[SETTING_KEYS.businessName] || SITE.name,
    shortName: textOrDefault(s[SETTING_KEYS.shortName], SITE.shortName),
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
    locationBlurb: textOrDefault(
      s[SETTING_KEYS.locationBlurb],
      SETTINGS_DEFAULTS.location_blurb,
    ),
    heroHomeImage: textOrDefault(
      s[SETTING_KEYS.heroHomeImage],
      DEFAULT_HERO_HOME_IMAGE,
    ),
    heroHeadline: s[SETTING_KEYS.heroHeadline] || SETTINGS_DEFAULTS.hero_headline,
    heroSubcopy: s[SETTING_KEYS.heroSubcopy] || SETTINGS_DEFAULTS.hero_subcopy,
    heroCtaPrimary: textOrDefault(
      s[SETTING_KEYS.heroCtaPrimary],
      SETTINGS_DEFAULTS.hero_cta_primary,
    ),
    heroCtaSecondary: textOrDefault(
      s[SETTING_KEYS.heroCtaSecondary],
      SETTINGS_DEFAULTS.hero_cta_secondary,
    ),
    aboutBlurb: s[SETTING_KEYS.aboutBlurb] || SETTINGS_DEFAULTS.about_blurb,
    aboutHeadline:
      s[SETTING_KEYS.aboutHeadline] || SETTINGS_DEFAULTS.about_headline,
    aboutIntro: s[SETTING_KEYS.aboutIntro] || SETTINGS_DEFAULTS.about_intro,
    aboutStory: s[SETTING_KEYS.aboutStory] || SETTINGS_DEFAULTS.about_story,
    aboutMission:
      s[SETTING_KEYS.aboutMission] || SETTINGS_DEFAULTS.about_mission,
    aboutVision: s[SETTING_KEYS.aboutVision] || SETTINGS_DEFAULTS.about_vision,
    aboutPromise: textOrDefault(
      s[SETTING_KEYS.aboutPromise],
      DEFAULT_ABOUT_PROMISE,
    ),
    aboutHeroImage: textOrDefault(
      s[SETTING_KEYS.aboutHeroImage],
      DEFAULT_ABOUT_HERO_IMAGE,
    ),
    aboutStoryImage: textOrDefault(
      s[SETTING_KEYS.aboutStoryImage],
      DEFAULT_ABOUT_STORY_IMAGE,
    ),
    aboutDealerImage: textOrDefault(
      s[SETTING_KEYS.aboutDealerImage],
      DEFAULT_ABOUT_DEALER_IMAGE,
    ),
    aboutPromiseImage: textOrDefault(
      s[SETTING_KEYS.aboutPromiseImage],
      DEFAULT_ABOUT_PROMISE_IMAGE,
    ),
    aboutValues: parseTitleBodyList(
      s[SETTING_KEYS.aboutValues],
      DEFAULT_ABOUT_VALUES,
    ),
    aboutJourney: parseJourneyList(s[SETTING_KEYS.aboutJourney]),
    aboutDifference: parseTitleBodyList(
      s[SETTING_KEYS.aboutDifference],
      DEFAULT_ABOUT_DIFFERENCE,
    ),
    aboutTrustPoints: parseTitleBodyList(
      s[SETTING_KEYS.aboutTrustPoints],
      DEFAULT_ABOUT_TRUST,
    ),
    instagramUrl: s[SETTING_KEYS.instagramUrl] ?? SOCIAL.instagram,
    tiktokUrl: s[SETTING_KEYS.tiktokUrl] ?? SOCIAL.tiktok,
    shopHeroHeadline:
      s[SETTING_KEYS.shopHeroHeadline] || SETTINGS_DEFAULTS.shop_hero_headline,
    shopHeroSubcopy:
      s[SETTING_KEYS.shopHeroSubcopy] || SETTINGS_DEFAULTS.shop_hero_subcopy,
    shopHeroImage: textOrDefault(
      s[SETTING_KEYS.shopHeroImage],
      DEFAULT_SHOP_HERO_IMAGE,
    ),
    servicesHeroHeadline:
      s[SETTING_KEYS.servicesHeroHeadline] ||
      SETTINGS_DEFAULTS.services_hero_headline,
    servicesHeroSubcopy:
      s[SETTING_KEYS.servicesHeroSubcopy] ||
      SETTINGS_DEFAULTS.services_hero_subcopy,
    servicesHeroImage: textOrDefault(
      s[SETTING_KEYS.servicesHeroImage],
      DEFAULT_SERVICES_HERO_IMAGE,
    ),
    servicesSectionHeadline:
      s[SETTING_KEYS.servicesSectionHeadline] ||
      SETTINGS_DEFAULTS.services_section_headline,
    servicesSectionSubcopy:
      s[SETTING_KEYS.servicesSectionSubcopy] ||
      SETTINGS_DEFAULTS.services_section_subcopy,
    whyBookSubcopy:
      s[SETTING_KEYS.whyBookSubcopy] || SETTINGS_DEFAULTS.why_book_subcopy,
    serviceProcess: parseProcessList(s[SETTING_KEYS.serviceProcess]),
    serviceProcessTitle: textOrDefault(
      s[SETTING_KEYS.serviceProcessTitle],
      SETTINGS_DEFAULTS.service_process_title,
    ),
    serviceProcessSubcopy: textOrDefault(
      s[SETTING_KEYS.serviceProcessSubcopy],
      SETTINGS_DEFAULTS.service_process_subcopy,
    ),
    serviceSpaces: parseTitleBodyList(
      s[SETTING_KEYS.serviceSpaces],
      DEFAULT_SERVICE_SPACES,
    ),
    serviceSpacesTitle: textOrDefault(
      s[SETTING_KEYS.serviceSpacesTitle],
      SETTINGS_DEFAULTS.service_spaces_title,
    ),
    serviceSpacesImage: textOrDefault(
      s[SETTING_KEYS.serviceSpacesImage],
      DEFAULT_SERVICE_SPACES_IMAGE,
    ),
    packagesHeadline: textOrDefault(
      s[SETTING_KEYS.packagesHeadline],
      SETTINGS_DEFAULTS.packages_headline,
    ),
    packagesSubcopy: textOrDefault(
      s[SETTING_KEYS.packagesSubcopy],
      SETTINGS_DEFAULTS.packages_subcopy,
    ),
    contactHeroHeadline:
      s[SETTING_KEYS.contactHeroHeadline] ||
      SETTINGS_DEFAULTS.contact_hero_headline,
    contactHeroSubcopy:
      s[SETTING_KEYS.contactHeroSubcopy] ||
      SETTINGS_DEFAULTS.contact_hero_subcopy,
    contactHeroImage: textOrDefault(
      s[SETTING_KEYS.contactHeroImage],
      DEFAULT_CONTACT_HERO_IMAGE,
    ),
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
    howItWorks: parseHowItWorksList(s[SETTING_KEYS.howItWorks]),
    homeHowTitle: textOrDefault(
      s[SETTING_KEYS.homeHowTitle],
      SETTINGS_DEFAULTS.home_how_title,
    ),
    homeHowDescription: textOrDefault(
      s[SETTING_KEYS.homeHowDescription],
      SETTINGS_DEFAULTS.home_how_description,
    ),
    homeShopTitle: textOrDefault(
      s[SETTING_KEYS.homeShopTitle],
      SETTINGS_DEFAULTS.home_shop_title,
    ),
    homeShopDescription: textOrDefault(
      s[SETTING_KEYS.homeShopDescription],
      SETTINGS_DEFAULTS.home_shop_description,
    ),
    homeShopCta: textOrDefault(
      s[SETTING_KEYS.homeShopCta],
      SETTINGS_DEFAULTS.home_shop_cta,
    ),
    homeCtaTitle: textOrDefault(
      s[SETTING_KEYS.homeCtaTitle],
      SETTINGS_DEFAULTS.home_cta_title,
    ),
    homeCtaDescription: textOrDefault(
      s[SETTING_KEYS.homeCtaDescription],
      SETTINGS_DEFAULTS.home_cta_description,
    ),
    testimonialsTitle: textOrDefault(
      s[SETTING_KEYS.testimonialsTitle],
      SETTINGS_DEFAULTS.testimonials_title,
    ),
    testimonialsDescription: textOrDefault(
      s[SETTING_KEYS.testimonialsDescription],
      SETTINGS_DEFAULTS.testimonials_description,
    ),
    serviceItems: parseServiceItems(s[SETTING_KEYS.serviceItems]),
    servicePromises: parsePromises(s[SETTING_KEYS.servicePromises]),
    servicePackages: parseServicePackages(s[SETTING_KEYS.servicePackages]),
    testimonials: parseTestimonials(s[SETTING_KEYS.testimonials]),
    googleMapsUrl: (s[SETTING_KEYS.googleMapsUrl] ?? "").trim(),
    logoUrl: (s[SETTING_KEYS.logoUrl] ?? "").trim() || DEFAULT_LOGO_URL,
    receiptTitle:
      (s[SETTING_KEYS.receiptTitle] ?? "").trim() ||
      SETTINGS_DEFAULTS.receipt_title,
    receiptFooter:
      (s[SETTING_KEYS.receiptFooter] ?? "").trim() ||
      SETTINGS_DEFAULTS.receipt_footer,
    receiptNote: (s[SETTING_KEYS.receiptNote] ?? "").trim(),
    homeServicesTitle:
      s[SETTING_KEYS.homeServicesTitle] ||
      SETTINGS_DEFAULTS.home_services_title,
    homeServicesDescription:
      s[SETTING_KEYS.homeServicesDescription] ||
      SETTINGS_DEFAULTS.home_services_description,
    promoBanner: parsePromoBanner(s[SETTING_KEYS.promoBanner]),
  };
}

export function getDefaultSiteConfig(): SiteConfig {
  return siteConfigFromMap({ ...SETTINGS_DEFAULTS });
}
