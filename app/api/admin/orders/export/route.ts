import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { listRecentOrders } from "@/lib/db/orders";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() || undefined;
  const orders = await listRecentOrders(500, status);

  const header = [
    "order_number",
    "customer",
    "phone",
    "status",
    "total_cedis",
    "items",
    "created_at",
  ];

  const lines = [
    header.join(","),
    ...orders.map((order) =>
      [
        order.orderNumber,
        order.customer,
        order.phone,
        order.status,
        String(order.totalCedis),
        order.itemsSummary,
        order.createdAt,
      ]
        .map((cell) => csvEscape(cell))
        .join(","),
    ),
  ];

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="frannys-orders-${stamp}.csv"`,
    },
  });
}
