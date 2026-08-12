/** Service id → file under `public/` (kebab-case filenames). */
export const SERVICE_IMAGE_FILES: Record<string, string> = {
  professional: "professional-cleaning.jpg",
  office: "office-cleaning.jpg",
  residential: "resedential-cleaning.jpg",
  deep: "deep-cleaning.png",
  move: "move-in/move-out-cleaning.jpg",
  commercial: "comercial-cleaning.jpg",
};

export function publicServiceImagePath(relativePath: string) {
  return `/${relativePath.replace(/^\/+/, "")}`;
}

export function serviceImageForId(serviceId: string, fallback = ""): string {
  const file = SERVICE_IMAGE_FILES[serviceId];
  return file ? publicServiceImagePath(file) : fallback;
}

export function hasLocalServiceImage(serviceId: string) {
  return Boolean(SERVICE_IMAGE_FILES[serviceId]);
}
