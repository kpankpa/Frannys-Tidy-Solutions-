/** Local uploads and non-Unsplash remotes need unoptimized Next/Image. */
export function shouldUnoptimizeImage(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("/uploads/")) return true;
  if (src.startsWith("/")) return false;
  try {
    const host = new URL(src).hostname.toLowerCase();
    return host !== "images.unsplash.com";
  } catch {
    return true;
  }
}
