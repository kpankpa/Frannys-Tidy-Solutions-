import path from "path";

/** Product slug → file under `public/` (named to match Frannys products). */
export const PRODUCT_IMAGE_FILES: Record<string, string> = {
  "fabric-softener": "flyers/fabric-softner.jpg",
  "toilet-cleaner": "flyers/toilet-cleaner.jpeg",
  "bathroom-cleaner": "flyers/bathroom-cleaner.jpeg",
  "multi-purpose-bleach": "flyers/multi-purpose-bleach.jpg",
  "fresh-clean-liquid-soap-4-5l": "flyers/liquid-soap fresh +clean.jpeg",
  "glass-cleaner": "flyers/glass-cleaner.jpeg",
  "liquid-soap-750ml": "flyers/liquid-soap.jpeg",
};

/** Optional size suffix when the image filename alone is not unique enough. */
export const PRODUCT_NAME_SUFFIX: Partial<Record<string, string>> = {
  "liquid-soap-750ml": " (750ml)",
  "fresh-clean-liquid-soap-4-5l": " (4.5L)",
};

/** Turn an image filename into a display name (matches how files are saved under public/). */
export function productNameFromImageFile(relativePath: string): string {
  const stem = path.basename(relativePath, path.extname(relativePath));

  return stem
    .split(/\s+/)
    .map((segment) =>
      segment
        .split("-")
        .map((word) => {
          if (word.startsWith("+")) {
            const rest = word.slice(1);
            return (
              "+" +
              (rest
                ? rest.charAt(0).toUpperCase() + rest.slice(1).toLowerCase()
                : "")
            );
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" "),
    )
    .join(" ");
}

export function productNameForSlug(slug: string): string {
  const file = PRODUCT_IMAGE_FILES[slug];
  if (!file) {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const base = productNameFromImageFile(file);
  const suffix = PRODUCT_NAME_SUFFIX[slug];
  return suffix ? `${base}${suffix}` : base;
}

export function publicProductImagePath(relativePath: string) {
  return `/${relativePath
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

export function mimeForProductFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

export function storageKeyForProduct(slug: string, filePath: string) {
  const ext = path.extname(filePath).toLowerCase() || ".jpg";
  return `media/products/${slug}${ext}`;
}
