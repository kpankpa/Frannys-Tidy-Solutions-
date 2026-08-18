"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSiteCache } from "@/lib/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  sanitizeServiceItem,
  sanitizeServicePackage,
  slugifyServiceId,
  MAX_SERVICE_PACKAGES,
} from "@/lib/cleaning-services-admin";
import {
  getCleaningServiceById,
  listCleaningServices,
  listServicePackages,
  saveCleaningServices,
  saveServicePackages,
} from "@/lib/db/cleaning-services";
import { sanitizeLogoUrl } from "@/lib/validation";

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidateServicePages() {
  revalidatePublicSiteCache();
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/admin/services");
  revalidatePath("/admin/content");
}

export async function saveCleaningServiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const existingId = String(formData.get("existingId") ?? "").trim();
  const rawId = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const imageRaw = String(formData.get("image") ?? "").trim();
  const image = sanitizeLogoUrl(imageRaw);

  if (imageRaw && !image) {
    return {
      ok: false,
      error:
        "Image URL is invalid. Use a site photo such as /professional-cleaning.jpg or /uploads/..., or a https image URL.",
    };
  }

  const item = sanitizeServiceItem({
    id: rawId || existingId || title,
    title,
    description,
    image: image ?? "",
  });

  if (!item) {
    return { ok: false, error: "Title is required." };
  }

  const services = await listCleaningServices();
  const duplicate = services.find(
    (service) => service.id === item.id && service.id !== existingId,
  );
  if (duplicate) {
    return {
      ok: false,
      error: "Another service already uses that URL id. Pick a different slug.",
    };
  }

  let next: typeof services;
  if (existingId) {
    const index = services.findIndex((service) => service.id === existingId);
    if (index < 0) {
      return { ok: false, error: "Service not found." };
    }
    next = [...services];
    next[index] = item;
  } else {
    next = [...services, item];
  }

  await saveCleaningServices(next);
  revalidateServicePages();
  return { ok: true };
}

export async function deleteCleaningServiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "Missing service id." };

  const services = await listCleaningServices();
  const next = services.filter((service) => service.id !== id);
  if (next.length === services.length) {
    return { ok: false, error: "Service not found." };
  }
  if (next.length === 0) {
    return { ok: false, error: "Keep at least one cleaning service." };
  }

  await saveCleaningServices(next);
  revalidateServicePages();
  return { ok: true };
}

export async function saveServicePackagesAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const packages = [];
  for (let i = 0; i < MAX_SERVICE_PACKAGES; i++) {
    const name = String(formData.get(`packageName${i}`) ?? "");
    const description = String(formData.get(`packageDesc${i}`) ?? "");
    const priceFromCedis = Number(formData.get(`packagePrice${i}`) ?? 0);
    const item = sanitizeServicePackage({ name, description, priceFromCedis });
    if (item) packages.push(item);
  }

  if (packages.length > MAX_SERVICE_PACKAGES) {
    return { ok: false, error: `You can add up to ${MAX_SERVICE_PACKAGES} packages.` };
  }

  await saveServicePackages(packages);
  revalidateServicePages();
  return { ok: true };
}

export async function deleteCleaningServiceFormAction(
  formData: FormData,
): Promise<void> {
  await deleteCleaningServiceAction(formData);
}

export async function suggestServiceId(title: string) {
  await requireAdmin();
  return slugifyServiceId(title);
}

export async function getCleaningServiceForEdit(id: string) {
  await requireAdmin();
  return getCleaningServiceById(id);
}

export async function loadServicePackagesForAdmin() {
  await requireAdmin();
  return listServicePackages();
}
