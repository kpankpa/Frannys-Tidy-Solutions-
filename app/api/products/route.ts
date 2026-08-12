import { NextResponse } from "next/server";
import {
  CATALOG_CACHE_SECONDS,
  publicCacheControl,
  SITE_CACHE_SECONDS,
} from "@/lib/cache";
import {
  getCachedProductBySlug,
  getCachedProducts,
} from "@/lib/db/cached-public";
import type { Product } from "@/lib/products";

function filterProducts(
  products: Product[],
  searchParams: URLSearchParams,
): Product[] {
  const category = searchParams.get("category");
  const query = searchParams.get("query")?.trim().toLowerCase();
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const availability = searchParams.get("availability") || "all";

  return products.filter((product) => {
    if (category && category !== "All" && product.category !== category) {
      return false;
    }
    if (maxPrice != null && !Number.isNaN(maxPrice) && product.price > maxPrice) {
      return false;
    }
    if (availability === "in" && !product.inStock) return false;
    if (availability === "out" && product.inStock) return false;
    if (
      query &&
      !`${product.name} ${product.description}`.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await getCachedProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product, {
      headers: {
        "Cache-Control": publicCacheControl(CATALOG_CACHE_SECONDS),
      },
    });
  }

  const products = filterProducts(await getCachedProducts(), searchParams);

  return NextResponse.json(products, {
    headers: {
      "Cache-Control": publicCacheControl(CATALOG_CACHE_SECONDS),
    },
  });
}
