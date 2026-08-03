import { requireAdminApi } from "@/lib/auth/require-admin";
import { listCustomers } from "@/lib/db/customers";
import { csvDownloadResponse, csvFilename, toCsv } from "@/lib/csv";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const customers = await listCustomers();
  const csv = toCsv(
    ["name", "phone", "email", "order_count", "total_spend_cedis", "created_at"],
    customers.map((row) => [
      row.name,
      row.phone,
      row.email ?? "",
      String(row.orderCount),
      row.spendCedis.toFixed(2),
      row.createdAt,
    ]),
  );

  return csvDownloadResponse(csvFilename("frannys-customers"), csv);
}
