import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting.
 * Prefer platform-trusted headers; only use the first X-Forwarded-For hop
 * when TRUST_PROXY=true (or on Vercel where the edge sets these).
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const trustProxy =
    process.env.TRUST_PROXY === "true" || Boolean(process.env.VERCEL);

  if (trustProxy) {
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
    const realIp = h.get("x-real-ip")?.trim();
    if (realIp) return realIp;
    const vercel = h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
    if (vercel) return vercel;
  }

  // Without a trusted proxy, do not honor spoofable client headers.
  return h.get("x-real-ip")?.trim() || "local";
}
