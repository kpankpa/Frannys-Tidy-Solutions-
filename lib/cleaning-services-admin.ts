import type {
  ServiceContentItem,
  ServicePackageItem,
} from "@/lib/site-config";

export const MAX_SERVICE_PACKAGES = 8;

export function slugifyServiceId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function sanitizeServiceItem(input: {
  id: string;
  title: string;
  description: string;
  image: string;
}): ServiceContentItem | null {
  const title = input.title.trim();
  if (!title) return null;

  const id = slugifyServiceId(input.id.trim() || title);
  if (!id) return null;

  return {
    id,
    title: title.slice(0, 80),
    description: input.description.trim().slice(0, 320),
    image: input.image.trim(),
  };
}

export function sanitizeServicePackage(input: {
  name: string;
  description: string;
  priceFromCedis: number;
}): ServicePackageItem | null {
  const name = input.name.trim();
  if (!name || input.priceFromCedis <= 0) return null;

  return {
    name: name.slice(0, 120),
    description: input.description.trim().slice(0, 400),
    priceFromCedis: input.priceFromCedis,
  };
}
