import { NextResponse } from "next/server";
import { getProductBySlug, listProducts } from "@/lib/db/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  const products = await listProducts({
    category: searchParams.get("category") ?? undefined,
    query: searchParams.get("query") ?? undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    availability: (searchParams.get("availability") as "all" | "in" | "out") || "all",
  });

  return NextResponse.json(products);
}
