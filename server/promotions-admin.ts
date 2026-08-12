"use server";

import { revalidatePath } from "next/cache";
import {
  revalidatePublicSiteCache,
} from "@/lib/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { upsertSetting } from "@/lib/db/settings";
import {
  parsePromoBanner,
  parseFocus,
  parseZoom,
  sanitizePromoLink,
  type PromoPlacement,
} from "@/lib/promotions";
import { SETTING_KEYS } from "@/lib/site-config";
import { clampText, sanitizeLogoUrl } from "@/lib/validation";

type ActionResult = { ok: true } | { ok: false; error: string };

function parsePlacement(value: string): PromoPlacement {
  if (value === "everywhere" || value === "both") return value;
  return "home";
}

export async function savePromoBannerAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const enabled =
    formData.get("enabled") === "on" || formData.get("enabled") === "true";
  const title = clampText(String(formData.get("title") ?? ""), 120);
  const imageRaw = String(formData.get("image") ?? "").trim();
  const image = sanitizeLogoUrl(imageRaw);
  const alt = clampText(
    String(formData.get("alt") ?? "Seasonal promotion"),
    160,
  );
  const link = sanitizePromoLink(String(formData.get("link") ?? ""));
  const placement = parsePlacement(String(formData.get("placement") ?? "home"));
  const showFrom = String(formData.get("showFrom") ?? "").trim().slice(0, 10);
  const showUntil = String(formData.get("showUntil") ?? "").trim().slice(0, 10);
  const imageFocusX = parseFocus(formData.get("imageFocusX"), 50);
  const imageFocusY = parseFocus(formData.get("imageFocusY"), 50);
  const imageZoom = parseZoom(formData.get("imageZoom"), 100);
  const imageFitRaw = String(formData.get("imageFit") ?? "cover");
  const imageFit = imageFitRaw === "contain" ? "contain" : "cover";

  if (enabled && !image) {
    return {
      ok: false,
      error: "Upload a flyer or poster image before enabling the promotion.",
    };
  }

  if (imageRaw && image === null) {
    return { ok: false, error: "Promotion image URL is invalid." };
  }

  const promo = parsePromoBanner(
    JSON.stringify({
      enabled,
      title,
      image: image ?? "",
      link,
      alt,
      placement,
      imageFocusX,
      imageFocusY,
      imageZoom,
      imageFit,
      showFrom,
      showUntil,
    }),
  );

  await upsertSetting(SETTING_KEYS.promoBanner, JSON.stringify(promo));

  revalidatePublicSiteCache();
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/services");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/promotions");

  return { ok: true };
}
