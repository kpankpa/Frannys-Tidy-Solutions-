import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { listCustomers } from "@/lib/db/customers";
import { listRecentOrders } from "@/lib/db/orders";
import { listProducts } from "@/lib/db/products";
import { createStoreZip } from "@/lib/zip-store";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(header: string[], rows: string[][]) {
  return [
    header.join(","),
    ...rows.map((row) => row.map((cell) => csvEscape(cell)).join(",")),
  ].join("\n");
}

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, customers, orders] = await Promise.all([
    listProducts(),
    listCustomers(),
    listRecentOrders(2000),
  ]);

  const productsCsv = toCsv(
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
    products.map((p) => [
      p.id,
      p.name,
      p.category,
      String(p.price),
      String(p.stockQuantity),
      p.inStock ? "yes" : "no",
      p.badge ?? "",
      p.badgeExpiresAt ?? "",
    ]),
  );

  const customersCsv = toCsv(
    ["id", "name", "phone", "email", "order_count", "spend_cedis", "created_at"],
    customers.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.email ?? "",
      String(c.orderCount),
      String(c.spendCedis),
      c.createdAt,
    ]),
  );

  const ordersCsv = toCsv(
    [
      "order_number",
      "customer",
      "phone",
      "status",
      "total_cedis",
      "items",
      "created_at",
    ],
    orders.map((order) => [
      order.orderNumber,
      order.customer,
      order.phone,
      order.status,
      String(order.totalCedis),
      order.itemsSummary,
      order.createdAt,
    ]),
  );

  const stamp = new Date().toISOString().slice(0, 10);
  const zip = createStoreZip([
    { name: `products-${stamp}.csv`, content: productsCsv },
    { name: `customers-${stamp}.csv`, content: customersCsv },
    { name: `orders-${stamp}.csv`, content: ordersCsv },
  ]);

  return new NextResponse(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="frannys-backup-${stamp}.zip"`,
    },
  });
}
