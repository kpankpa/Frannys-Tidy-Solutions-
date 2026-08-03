import { requireAdminApi } from "@/lib/auth/require-admin";
import { listProducts } from "@/lib/db/products";
import { csvDownloadResponse, csvFilename, toCsv } from "@/lib/csv";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const products = await listProducts();
  const csv = toCsv(
    [
      "slug",
      "name",
      "category",
      "price_cedis",
      "stock_quantity",
      "in_stock",
      "badge",
      "badge_expires_at",
    ],
    products.map((row) => [
      row.id,
      row.name,
      row.category,
      row.price.toFixed(2),
      String(row.stockQuantity),
      row.inStock ? "yes" : "no",
      row.badge ?? "",
      row.badgeExpiresAt ?? "",
    ]),
  );

  return csvDownloadResponse(csvFilename("frannys-products"), csv);
}
