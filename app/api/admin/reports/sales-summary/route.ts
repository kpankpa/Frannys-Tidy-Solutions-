import { requireAdminApi } from "@/lib/auth/require-admin";
import { csvDownloadResponse, csvFilename, toCsv } from "@/lib/csv";
import { getOrdersByDay, getTopProducts } from "@/lib/db/stats";

export async function GET(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(request.url);
  const daysRaw = Number(searchParams.get("days") ?? 7);
  const days = Number.isFinite(daysRaw)
    ? Math.min(90, Math.max(1, Math.floor(daysRaw)))
    : 7;

  const [byDay, topProducts] = await Promise.all([
    getOrdersByDay(days),
    getTopProducts(20),
  ]);

  const dailyRows = byDay.map((row) => [
    "daily",
    row.day,
    String(row.count),
    row.revenueCedis.toFixed(2),
    "",
    "",
  ]);

  const productRows = topProducts.map((row) => [
    "top_product",
    "",
    "",
    row.revenueCedis.toFixed(2),
    row.name,
    String(row.quantity),
  ]);

  const csv = toCsv(
    ["report_type", "day", "order_count", "revenue_cedis", "product_name", "quantity_sold"],
    [...dailyRows, ...productRows],
  );

  return csvDownloadResponse(csvFilename(`frannys-sales-summary-${days}d`), csv);
}
