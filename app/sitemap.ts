import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/db/products";
import { siteOrigin } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/services",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${origin}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority:
      path === ""
        ? 1
        : path === "/shop" || path === "/services"
          ? 0.9
          : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await listProducts();
    productRoutes = products.map((p) => ({
      url: `${origin}/shop/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB may be unavailable during build without env; keep static routes.
  }

  return [...staticRoutes, ...productRoutes];
}
