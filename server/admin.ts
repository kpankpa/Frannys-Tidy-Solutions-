"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateOrderStatus } from "@/lib/db/orders";
import { updateBookingStatus } from "@/lib/db/bookings";
import { createComplaint, setComplaintStatus } from "@/lib/db/complaints";
import {
  SETTING_KEYS,
  upsertSettings,
  type SettingKey,
} from "@/lib/db/settings";
import { cedisToPesewas } from "@/lib/money";
import { ORDER_PIPELINE } from "@/lib/order-status";
import { BOOKING_PIPELINE } from "@/lib/booking-status";
import { toWhatsAppE164, normalizeGhanaPhone } from "@/lib/phone";
import { clampText, sanitizeSocialUrl, LIMITS } from "@/lib/validation";

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = clampText(String(formData.get("note") ?? ""), 240);

  const allowed = ORDER_PIPELINE.some((s) => s.key === status);
  if (!orderNumber || !allowed) return;

  await updateOrderStatus(orderNumber, status, note);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber.trim().toUpperCase()}`);
  revalidatePath("/track-order");
}

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = BOOKING_PIPELINE.some((s) => s.key === status);
  if (!bookingId || !allowed) return;

  await updateBookingStatus(bookingId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
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

  if (instagram === null || tiktok === null) {
    redirect("/admin/settings?error=InvalidSocialUrl");
  }

  const entries: Partial<Record<SettingKey, string>> = {
    [SETTING_KEYS.businessName]: clampText(
      String(formData.get("businessName") ?? ""),
      120,
    ),
    [SETTING_KEYS.tagline]: clampText(String(formData.get("tagline") ?? ""), 160),
    [SETTING_KEYS.description]: clampText(
      String(formData.get("description") ?? ""),
      500,
    ),
    [SETTING_KEYS.address]: clampText(String(formData.get("address") ?? ""), 240),
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
  };

  await upsertSettings(entries as Record<string, string>);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/checkout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/admin/login");
}

export async function saveSiteContentAction(formData: FormData) {
  await requireAdmin();

  const whyChooseItems = [0, 1, 2, 3].map((i) => ({
    title: clampText(String(formData.get(`whyTitle${i}`) ?? ""), 80),
    description: clampText(String(formData.get(`whyDesc${i}`) ?? ""), 240),
  })).filter((item) => item.title);

  const serviceIds = [
    "professional",
    "office",
    "residential",
    "deep",
    "move",
    "commercial",
  ] as const;
  const serviceItems = serviceIds.map((id) => ({
    id,
    title: clampText(String(formData.get(`serviceTitle_${id}`) ?? ""), 80),
    description: clampText(
      String(formData.get(`serviceDesc_${id}`) ?? ""),
      320,
    ),
  }));

  const servicePromises = [0, 1, 2].map((i) => ({
    title: clampText(String(formData.get(`promiseTitle${i}`) ?? ""), 80),
    body: clampText(String(formData.get(`promiseBody${i}`) ?? ""), 320),
  })).filter((item) => item.title);

  const contactTopics = String(formData.get("contactTopics") ?? "")
    .split("\n")
    .map((line) => clampText(line.trim(), 120))
    .filter(Boolean);

  await upsertSettings({
    [SETTING_KEYS.heroHeadline]: clampText(
      String(formData.get("heroHeadline") ?? ""),
      200,
    ),
    [SETTING_KEYS.heroSubcopy]: clampText(
      String(formData.get("heroSubcopy") ?? ""),
      500,
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
    [SETTING_KEYS.shopHeroHeadline]: clampText(
      String(formData.get("shopHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.shopHeroSubcopy]: clampText(
      String(formData.get("shopHeroSubcopy") ?? ""),
      500,
    ),
    [SETTING_KEYS.servicesHeroHeadline]: clampText(
      String(formData.get("servicesHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.servicesHeroSubcopy]: clampText(
      String(formData.get("servicesHeroSubcopy") ?? ""),
      500,
    ),
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
    [SETTING_KEYS.contactHeroHeadline]: clampText(
      String(formData.get("contactHeroHeadline") ?? ""),
      160,
    ),
    [SETTING_KEYS.contactHeroSubcopy]: clampText(
      String(formData.get("contactHeroSubcopy") ?? ""),
      500,
    ),
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
    [SETTING_KEYS.serviceItems]: JSON.stringify(serviceItems),
    [SETTING_KEYS.servicePromises]: JSON.stringify(servicePromises),
    [SETTING_KEYS.homeServicesTitle]: clampText(
      String(formData.get("homeServicesTitle") ?? ""),
      120,
    ),
    [SETTING_KEYS.homeServicesDescription]: clampText(
      String(formData.get("homeServicesDescription") ?? ""),
      240,
    ),
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/shop");
  revalidatePath("/admin/content");
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
