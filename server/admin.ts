"use server";

import { revalidatePath } from "next/cache";
import {
  revalidatePublicCatalogCache,
  revalidatePublicSiteCache,
} from "@/lib/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createManualOrder,
  updateOrderStatus,
  updateOrderDeliveryFee,
} from "@/lib/db/orders";
import { updateBookingStatus } from "@/lib/db/bookings";
import { createComplaint, setComplaintStatus } from "@/lib/db/complaints";
import {
  SETTING_KEYS,
  upsertSettings,
  type SettingKey,
} from "@/lib/db/settings";
import { cedisToPesewas } from "@/lib/money";
import { ORDER_ADMIN_STATUSES, orderStatusLabel } from "@/lib/order-status";
import { BOOKING_PIPELINE, bookingStatusLabel } from "@/lib/booking-status";
import { toWhatsAppE164, normalizeGhanaPhone } from "@/lib/phone";
import {
  clampText,
  sanitizeLogoUrl,
  sanitizeSocialUrl,
  sanitizeImageUrlList,
  LIMITS,
} from "@/lib/validation";
import { DEFAULT_WEBSITE_GALLERY } from "@/lib/site-config";

function revalidateAfterOrderChange(orderNumber: string) {
  const normalizedNumber = orderNumber.trim().toUpperCase();
  revalidatePublicCatalogCache();
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${normalizedNumber}`);
  revalidatePath(`/admin/orders/${normalizedNumber}/print`);
  revalidatePath("/admin/customers");
  revalidatePath("/track-order");
}

export type UpdateOrderStatusState =
  | {
      ok: true;
      orderNumber: string;
      statusLabel: string;
      unchanged?: boolean;
      leftFilter?: boolean;
    }
  | { ok: false; error: string };

export async function updateOrderStatusAction(
  _prev: UpdateOrderStatusState | null,
  formData: FormData,
): Promise<UpdateOrderStatusState> {
  await requireAdmin();

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const note = clampText(String(formData.get("note") ?? ""), 240);
  const activeStatusFilter = String(
    formData.get("activeStatusFilter") ?? "",
  ).trim();

  if (!orderNumber) {
    return { ok: false, error: "Missing order number." };
  }

  const allowed = ORDER_ADMIN_STATUSES.some((s) => s.key === status);
  if (!allowed) {
    return { ok: false, error: "Choose a valid order status." };
  }

  try {
    const result = await updateOrderStatus(orderNumber, status, note);

    if (!result.unchanged) {
      revalidateAfterOrderChange(result.orderNumber);
    }

    const leftFilter = Boolean(
      activeStatusFilter &&
        !result.unchanged &&
        result.status !== activeStatusFilter,
    );

    return {
      ok: true,
      orderNumber: result.orderNumber,
      statusLabel: orderStatusLabel(result.status),
      unchanged: result.unchanged,
      leftFilter,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update the order.";
    const safe =
      message.includes("stock") ||
      message.includes("Order not found") ||
      message.includes("available")
        ? message
        : "Could not update the order. Try again.";
    return { ok: false, error: safe };
  }
}

export type UpdateOrderDeliveryFeeState =
  | { ok: true; deliveryCedis: number; unchanged?: boolean }
  | { ok: false; error: string };

export async function updateOrderDeliveryFeeAction(
  _prev: UpdateOrderDeliveryFeeState | null,
  formData: FormData,
): Promise<UpdateOrderDeliveryFeeState> {
  await requireAdmin();

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const deliveryFeeCedis = Number(formData.get("deliveryFeeCedis") ?? NaN);

  if (!orderNumber) {
    return { ok: false, error: "Missing order number." };
  }

  if (!Number.isFinite(deliveryFeeCedis)) {
    return { ok: false, error: "Enter a valid delivery fee." };
  }

  try {
    const result = await updateOrderDeliveryFee(orderNumber, deliveryFeeCedis);

    if (!result.unchanged) {
      revalidateAfterOrderChange(result.orderNumber);
    }

    return {
      ok: true,
      deliveryCedis: result.deliveryCedis,
      unchanged: result.unchanged,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the delivery fee.";
    return {
      ok: false,
      error: message.includes("valid") ? message : "Could not save the delivery fee.",
    };
  }
}

export type CreateManualOrderState =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function createManualOrderAction(
  formData: FormData,
): Promise<CreateManualOrderState> {
  await requireAdmin();

  const productIds = formData
    .getAll("productId")
    .map((value) => String(value).trim());
  const quantities = formData.getAll("quantity").map((value) => Number(value));
  const items = productIds
    .map((productId, index) => ({
      productId,
      quantity: quantities[index] ?? 0,
    }))
    .filter((item) => item.productId);

  try {
    const result = await createManualOrder({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      status: String(formData.get("status") ?? "confirmed"),
      deliveryFeeCedis: Number(formData.get("deliveryFeeCedis") ?? 0),
      items,
    });

    // New order reserved stock, so the shop and dashboards must refresh.
    revalidatePublicCatalogCache();
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${result.orderNumber}`);
    revalidatePath("/admin/customers");

    return { ok: true, orderNumber: result.orderNumber };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create the order.";
    const safe =
      message.includes("stock") ||
      message.includes("cart") ||
      message.includes("phone") ||
      message.includes("address") ||
      message.includes("available") ||
      message.includes("valid")
        ? message
        : "Could not create the order.";
    return { ok: false, error: safe };
  }
}

export type UpdateBookingStatusState =
  | { ok: true; statusLabel: string; unchanged?: boolean }
  | { ok: false; error: string };

export async function updateBookingStatusAction(
  _prev: UpdateBookingStatusState | null,
  formData: FormData,
): Promise<UpdateBookingStatusState> {
  await requireAdmin();

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const allowed = BOOKING_PIPELINE.some((s) => s.key === status);

  if (!bookingId) {
    return { ok: false, error: "Missing booking." };
  }

  if (!allowed) {
    return { ok: false, error: "Choose a valid booking status." };
  }

  try {
    const result = await updateBookingStatus(bookingId, status);

    if (!result.unchanged) {
      revalidatePath("/admin");
      revalidatePath("/admin/bookings");
      revalidatePath("/admin/customers");
    }

    return {
      ok: true,
      statusLabel: bookingStatusLabel(result.status),
      unchanged: result.unchanged,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update the booking.";
    return {
      ok: false,
      error: message.includes("not found")
        ? message
        : "Could not update the booking. Try again.",
    };
  }
}

export async function saveBusinessSettingsAction(formData: FormData) {
  await requireAdmin();

  const deliveryCedis = Number(formData.get("deliveryFeeCedis") ?? 0);
  const phoneRaw = String(formData.get("phone") ?? "");
  const whatsappRaw = String(formData.get("whatsapp") ?? "");
  const phone = normalizeGhanaPhone(phoneRaw) ?? phoneRaw.replace(/[\s\-()]/g, "");
  const whatsapp =
    normalizeGhanaPhone(whatsappRaw) ??
    whatsappRaw.replace(/[\s\-()]/g, "");

  let whatsappE164 = String(formData.get("whatsappE164") ?? "")
    .replace(/\D/g, "")
    .trim();
  if (!whatsappE164) {
    whatsappE164 = toWhatsAppE164(whatsapp) ?? "";
  }

  const instagram = sanitizeSocialUrl(
    String(formData.get("instagramUrl") ?? ""),
  );
  const tiktok = sanitizeSocialUrl(String(formData.get("tiktokUrl") ?? ""));
  const mapsRaw = String(formData.get("googleMapsUrl") ?? "").trim();
  let googleMapsUrl = "";
  if (mapsRaw) {
    try {
      const url = new URL(mapsRaw);
      if (url.protocol !== "https:") {
        redirect("/admin/settings?error=InvalidMapsUrl");
      }
      googleMapsUrl = url.toString();
    } catch {
      redirect("/admin/settings?error=InvalidMapsUrl");
    }
  }

  if (instagram === null || tiktok === null) {
    redirect("/admin/settings?error=InvalidSocialUrl");
  }

  const logoRaw = String(formData.get("logoUrl") ?? "").trim();
  const logoUrl = sanitizeLogoUrl(logoRaw);
  if (logoUrl === null) {
    redirect("/admin/settings?error=InvalidLogoUrl");
  }

  const heroHomeRaw = String(formData.get("heroHomeImage") ?? "").trim();
  const heroHomeImage = sanitizeLogoUrl(heroHomeRaw);
  if (heroHomeImage === null) {
    redirect("/admin/settings?error=InvalidLogoUrl");
  }

  const entries: Partial<Record<SettingKey, string>> = {
    [SETTING_KEYS.businessName]: clampText(
      String(formData.get("businessName") ?? ""),
      120,
    ),
    [SETTING_KEYS.shortName]: clampText(
      String(formData.get("shortName") ?? ""),
      40,
    ),
    [SETTING_KEYS.tagline]: clampText(String(formData.get("tagline") ?? ""), 160),
    [SETTING_KEYS.description]: clampText(
      String(formData.get("description") ?? ""),
      500,
    ),
    [SETTING_KEYS.address]: clampText(String(formData.get("address") ?? ""), 240),
    [SETTING_KEYS.locationBlurb]: clampText(
      String(formData.get("locationBlurb") ?? ""),
      120,
    ),
    [SETTING_KEYS.phone]: phone,
    [SETTING_KEYS.phoneDisplay]: clampText(
      String(formData.get("phoneDisplay") ?? ""),
      40,
    ),
    [SETTING_KEYS.whatsapp]: whatsapp,
    [SETTING_KEYS.whatsappE164]: whatsappE164,
    [SETTING_KEYS.email]: clampText(String(formData.get("email") ?? ""), 120),
    [SETTING_KEYS.hours]: clampText(String(formData.get("hours") ?? ""), 120),
    [SETTING_KEYS.hoursShort]: clampText(
      String(formData.get("hoursShort") ?? ""),
      80,
    ),
    [SETTING_KEYS.deliveryFeePesewas]: String(
      cedisToPesewas(Number.isFinite(deliveryCedis) ? Math.max(0, deliveryCedis) : 0),
    ),
    [SETTING_KEYS.instagramUrl]: instagram,
    [SETTING_KEYS.tiktokUrl]: tiktok,
    [SETTING_KEYS.googleMapsUrl]: googleMapsUrl,
    [SETTING_KEYS.logoUrl]: logoUrl,
    [SETTING_KEYS.heroHomeImage]: heroHomeImage,
    [SETTING_KEYS.receiptTitle]: clampText(
      String(formData.get("receiptTitle") ?? ""),
      80,
    ),
    [SETTING_KEYS.receiptFooter]: clampText(
      String(formData.get("receiptFooter") ?? ""),
      500,
    ),
    [SETTING_KEYS.receiptNote]: clampText(
      String(formData.get("receiptNote") ?? ""),
      500,
    ),
  };

  await upsertSettings(entries as Record<string, string>);
  revalidatePublicSiteCache();
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/admin/login");
  revalidatePath("/admin/orders");
}

export async function saveSiteContentAction(formData: FormData) {
  await requireAdmin();

  const whyChooseItems = [0, 1, 2, 3].map((i) => ({
    title: clampText(String(formData.get(`whyTitle${i}`) ?? ""), 80),
    description: clampText(String(formData.get(`whyDesc${i}`) ?? ""), 240),
  })).filter((item) => item.title);

  const servicePromises = [0, 1, 2].map((i) => ({
    title: clampText(String(formData.get(`promiseTitle${i}`) ?? ""), 80),
    body: clampText(String(formData.get(`promiseBody${i}`) ?? ""), 320),
  })).filter((item) => item.title);

  const contactTopics = String(formData.get("contactTopics") ?? "")
    .split("\n")
    .map((line) => clampText(line.trim(), 120))
    .filter(Boolean);

  const testimonials = [0, 1, 2, 3, 4].map((i) => ({
    name: clampText(String(formData.get(`testimonialName${i}`) ?? ""), 80),
    role: clampText(String(formData.get(`testimonialRole${i}`) ?? ""), 120),
    quote: clampText(String(formData.get(`testimonialQuote${i}`) ?? ""), 500),
    rating: Math.min(
      5,
      Math.max(1, Math.round(Number(formData.get(`testimonialRating${i}`) ?? 5))),
    ),
    approved:
      formData.get(`testimonialApproved${i}`) === "on" ||
      formData.get(`testimonialApproved${i}`) === "true",
  })).filter((item) => item.name && item.quote);

  const aboutValues = [0, 1, 2, 3].map((i) => ({
    title: clampText(String(formData.get(`aboutValueTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`aboutValueBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const aboutJourney = [0, 1, 2, 3].map((i) => ({
    year: clampText(String(formData.get(`aboutJourneyYear${i}`) ?? ""), 40),
    title: clampText(String(formData.get(`aboutJourneyTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`aboutJourneyBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const aboutDifference = [0, 1, 2].map((i) => ({
    title: clampText(String(formData.get(`aboutDiffTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`aboutDiffBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const aboutTrustPoints = [0, 1, 2, 3].map((i) => ({
    title: clampText(String(formData.get(`aboutTrustTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`aboutTrustBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const howItWorks = [0, 1, 2, 3].map((i) => ({
    step: i + 1,
    title: clampText(String(formData.get(`howTitle${i}`) ?? ""), 80),
    description: clampText(String(formData.get(`howDesc${i}`) ?? ""), 240),
  })).filter((item) => item.title);

  const serviceProcess = [0, 1, 2, 3].map((i) => ({
    step: clampText(
      String(formData.get(`processStep${i}`) ?? String(i + 1).padStart(2, "0")),
      8,
    ),
    title: clampText(String(formData.get(`processTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`processBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const serviceSpaces = [0, 1, 2, 3].map((i) => ({
    title: clampText(String(formData.get(`spaceTitle${i}`) ?? ""), 120),
    body: clampText(String(formData.get(`spaceBody${i}`) ?? ""), 400),
  })).filter((item) => item.title);

  const galleryRaw = String(formData.get("websiteGalleryImages") ?? "").trim();
  let websiteGalleryImages = DEFAULT_WEBSITE_GALLERY;
  if (galleryRaw) {
    try {
      const parsed = JSON.parse(galleryRaw) as unknown;
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .map((item) => {
            const srcRaw =
              item && typeof item === "object" && "src" in item
                ? String((item as { src?: string }).src ?? "")
                : "";
            const altRaw =
              item && typeof item === "object" && "alt" in item
                ? String((item as { alt?: string }).alt ?? "")
                : "";
            const safeList = sanitizeImageUrlList([srcRaw.trim()]);
            const src = safeList.urls[0];
            if (!src) return null;
            return {
              src,
              alt: clampText(altRaw, 160) || "Frannys team photo",
            };
          })
          .filter(Boolean) as { src: string; alt: string }[];
        if (cleaned.length > 0) {
          websiteGalleryImages = cleaned.slice(0, 24);
        }
      }
    } catch {
      redirect("/admin/content?error=InvalidGallery");
    }
  }

  const spacesImageRaw = String(formData.get("serviceSpacesImage") ?? "").trim();
  const serviceSpacesImage = sanitizeLogoUrl(spacesImageRaw);
  if (serviceSpacesImage === null) {
    redirect("/admin/content?error=InvalidImageUrl");
  }

  const imageFields = [
    ["shopHeroImage", String(formData.get("shopHeroImage") ?? "")],
    ["servicesHeroImage", String(formData.get("servicesHeroImage") ?? "")],
    ["contactHeroImage", String(formData.get("contactHeroImage") ?? "")],
    ["aboutHeroImage", String(formData.get("aboutHeroImage") ?? "")],
    ["aboutStoryImage", String(formData.get("aboutStoryImage") ?? "")],
    ["aboutDealerImage", String(formData.get("aboutDealerImage") ?? "")],
    ["aboutPromiseImage", String(formData.get("aboutPromiseImage") ?? "")],
  ] as const;

  const savedImages: Record<(typeof imageFields)[number][0], string> = {
    shopHeroImage: "",
    servicesHeroImage: "",
    contactHeroImage: "",
    aboutHeroImage: "",
    aboutStoryImage: "",
    aboutDealerImage: "",
    aboutPromiseImage: "",
  };

  for (const [name, raw] of imageFields) {
    const safe = sanitizeLogoUrl(raw.trim());
    if (safe === null) {
      redirect("/admin/content?error=InvalidImageUrl");
    }
    savedImages[name] = safe;
  }

  await upsertSettings({
    [SETTING_KEYS.heroHeadline]: clampText(
      String(formData.get("heroHeadline") ?? ""),
      200,
    ),
    [SETTING_KEYS.heroSubcopy]: clampText(
      String(formData.get("heroSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.heroCtaPrimary]: clampText(
      String(formData.get("heroCtaPrimary") ?? ""),
      40,
    ),
    [SETTING_KEYS.heroCtaSecondary]: clampText(
      String(formData.get("heroCtaSecondary") ?? ""),
      40,
    ),
    [SETTING_KEYS.aboutBlurb]: clampText(
      String(formData.get("aboutBlurb") ?? ""),
      400,
    ),
    [SETTING_KEYS.tagline]: clampText(String(formData.get("tagline") ?? ""), 160),
    [SETTING_KEYS.aboutHeadline]: clampText(
      String(formData.get("aboutHeadline") ?? ""),
      200,
    ),
    [SETTING_KEYS.aboutIntro]: clampText(
      String(formData.get("aboutIntro") ?? ""),
      800,
    ),
    [SETTING_KEYS.aboutStory]: clampText(
      String(formData.get("aboutStory") ?? ""),
      2000,
    ),
    [SETTING_KEYS.aboutMission]: clampText(
      String(formData.get("aboutMission") ?? ""),
      1200,
    ),
    [SETTING_KEYS.aboutVision]: clampText(
      String(formData.get("aboutVision") ?? ""),
      1200,
    ),
    [SETTING_KEYS.aboutPromise]: clampText(
      String(formData.get("aboutPromise") ?? ""),
      400,
    ),
    [SETTING_KEYS.aboutHeroImage]: savedImages.aboutHeroImage,
    [SETTING_KEYS.aboutStoryImage]: savedImages.aboutStoryImage,
    [SETTING_KEYS.aboutDealerImage]: savedImages.aboutDealerImage,
    [SETTING_KEYS.aboutPromiseImage]: savedImages.aboutPromiseImage,
    [SETTING_KEYS.websiteGalleryImages]: JSON.stringify(websiteGalleryImages),
    [SETTING_KEYS.aboutValues]: JSON.stringify(aboutValues),
    [SETTING_KEYS.aboutJourney]: JSON.stringify(aboutJourney),
    [SETTING_KEYS.aboutDifference]: JSON.stringify(aboutDifference),
    [SETTING_KEYS.aboutTrustPoints]: JSON.stringify(aboutTrustPoints),
    [SETTING_KEYS.shopHeroHeadline]: clampText(
      String(formData.get("shopHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.shopHeroSubcopy]: clampText(
      String(formData.get("shopHeroSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.shopHeroImage]: savedImages.shopHeroImage,
    [SETTING_KEYS.servicesHeroHeadline]: clampText(
      String(formData.get("servicesHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.servicesHeroSubcopy]: clampText(
      String(formData.get("servicesHeroSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.servicesHeroImage]: savedImages.servicesHeroImage,
    [SETTING_KEYS.servicesSectionHeadline]: clampText(
      String(formData.get("servicesSectionHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.servicesSectionSubcopy]: clampText(
      String(formData.get("servicesSectionSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.whyBookSubcopy]: clampText(
      String(formData.get("whyBookSubcopy") ?? ""),
      240,
    ),
    [SETTING_KEYS.serviceProcess]: JSON.stringify(serviceProcess),
    [SETTING_KEYS.serviceProcessTitle]: clampText(
      String(formData.get("serviceProcessTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.serviceProcessSubcopy]: clampText(
      String(formData.get("serviceProcessSubcopy") ?? ""),
      240,
    ),
    [SETTING_KEYS.serviceSpaces]: JSON.stringify(serviceSpaces),
    [SETTING_KEYS.serviceSpacesTitle]: clampText(
      String(formData.get("serviceSpacesTitle") ?? ""),
      160,
    ),
    [SETTING_KEYS.serviceSpacesImage]: serviceSpacesImage,
    [SETTING_KEYS.packagesHeadline]: clampText(
      String(formData.get("packagesHeadline") ?? ""),
      120,
    ),
    [SETTING_KEYS.packagesSubcopy]: clampText(
      String(formData.get("packagesSubcopy") ?? ""),
      400,
    ),
    [SETTING_KEYS.contactHeroHeadline]: clampText(
      String(formData.get("contactHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.contactHeroSubcopy]: clampText(
      String(formData.get("contactHeroSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.contactHeroImage]: savedImages.contactHeroImage,
    [SETTING_KEYS.contactTopicsHeadline]: clampText(
      String(formData.get("contactTopicsHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.contactTopics]: JSON.stringify(contactTopics),
    [SETTING_KEYS.homeWhyTitle]: clampText(
      String(formData.get("homeWhyTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeWhyDescription]: clampText(
      String(formData.get("homeWhyDescription") ?? ""),
      240,
    ),
    [SETTING_KEYS.whyChooseItems]: JSON.stringify(whyChooseItems),
    [SETTING_KEYS.howItWorks]: JSON.stringify(howItWorks),
    [SETTING_KEYS.homeHowTitle]: clampText(
      String(formData.get("homeHowTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeHowDescription]: clampText(
      String(formData.get("homeHowDescription") ?? ""),
      240,
    ),
    [SETTING_KEYS.homeShopTitle]: clampText(
      String(formData.get("homeShopTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeShopDescription]: clampText(
      String(formData.get("homeShopDescription") ?? ""),
      240,
    ),
    [SETTING_KEYS.homeShopCta]: clampText(
      String(formData.get("homeShopCta") ?? ""),
      60,
    ),
    [SETTING_KEYS.homeCtaTitle]: clampText(
      String(formData.get("homeCtaTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeCtaDescription]: clampText(
      String(formData.get("homeCtaDescription") ?? ""),
      320,
    ),
    [SETTING_KEYS.testimonialsTitle]: clampText(
      String(formData.get("testimonialsTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.testimonialsDescription]: clampText(
      String(formData.get("testimonialsDescription") ?? ""),
      240,
    ),
    [SETTING_KEYS.servicePromises]: JSON.stringify(servicePromises),
    [SETTING_KEYS.testimonials]: JSON.stringify(testimonials),
    [SETTING_KEYS.homeServicesTitle]: clampText(
      String(formData.get("homeServicesTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeServicesDescription]: clampText(
      String(formData.get("homeServicesDescription") ?? ""),
      240,
    ),
  });

  revalidatePublicSiteCache();
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/shop");
  revalidatePath("/admin/content");
  redirect("/admin/content?saved=1");
}

export async function createComplaintAction(formData: FormData) {
  await requireAdmin();
  await createComplaint({
    subject: clampText(String(formData.get("subject") ?? ""), LIMITS.subject),
    details: clampText(String(formData.get("details") ?? ""), LIMITS.details),
    customerPhone: normalizeGhanaPhone(String(formData.get("customerPhone") ?? "")) ??
      String(formData.get("customerPhone") ?? "").replace(/[\s\-()]/g, ""),
  });
  revalidatePath("/admin/complaints");
  revalidatePath("/admin");
}

export async function resolveComplaintAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "resolved");
  if (!id) return;
  if (status !== "open" && status !== "resolved") return;
  await setComplaintStatus(id, status);
  revalidatePath("/admin/complaints");
  revalidatePath("/admin");
}
