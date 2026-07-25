import { count, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookings,
  complaints,
  customers,
  orderItems,
  orders,
  products,
} from "@/lib/db/schema";
import { bookingStatusLabel } from "@/lib/booking-status";
import { pesewasToCedis } from "@/lib/money";

export type DashboardStats = {
  salesTotalCedis: number;
  orderCount: number;
  pendingOrders: number;
  customerCount: number;
  productCount: number;
  bookingCount: number;
  requestedBookings: number;
  openComplaints: number;
  inStockProducts: number;
  outOfStockProducts: number;
};

export type AdminNavBadges = {
  pendingOrders: number;
  requestedBookings: number;
  openComplaints: number;
  outOfStockProducts: number;
};

/** Lightweight counts for admin sidebar badges. */
export async function getAdminNavBadges(): Promise<AdminNavBadges> {
  const [pendingOrdersRow, requestedBookingsRow, openComplaintsRow, outOfStockRow] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(orders)
        .where(eq(orders.status, "pending")),
      db
        .select({ value: count() })
        .from(bookings)
        .where(eq(bookings.status, "requested")),
      db
        .select({ value: count() })
        .from(complaints)
        .where(eq(complaints.status, "open")),
      db
        .select({ value: count() })
        .from(products)
        .where(eq(products.inStock, false)),
    ]);

  return {
    pendingOrders: pendingOrdersRow[0]?.value ?? 0,
    requestedBookings: requestedBookingsRow[0]?.value ?? 0,
    openComplaints: openComplaintsRow[0]?.value ?? 0,
    outOfStockProducts: outOfStockRow[0]?.value ?? 0,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    salesRow,
    orderCountRow,
    pendingOrdersRow,
    customerCountRow,
    productCountRow,
    bookingCountRow,
    requestedBookingsRow,
    openComplaintsRow,
    inStockRow,
    outOfStockRow,
  ] = await Promise.all([
    db.select({ total: sum(orders.totalPesewas) }).from(orders),
    db.select({ value: count() }).from(orders),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, "pending")),
    db.select({ value: count() }).from(customers),
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(bookings),
    db
      .select({ value: count() })
      .from(bookings)
      .where(eq(bookings.status, "requested")),
    db
      .select({ value: count() })
      .from(complaints)
      .where(eq(complaints.status, "open")),
    db
      .select({ value: count() })
      .from(products)
      .where(eq(products.inStock, true)),
    db
      .select({ value: count() })
      .from(products)
      .where(eq(products.inStock, false)),
  ]);

  return {
    salesTotalCedis: pesewasToCedis(Number(salesRow[0]?.total ?? 0)),
    orderCount: orderCountRow[0]?.value ?? 0,
    pendingOrders: pendingOrdersRow[0]?.value ?? 0,
    customerCount: customerCountRow[0]?.value ?? 0,
    productCount: productCountRow[0]?.value ?? 0,
    bookingCount: bookingCountRow[0]?.value ?? 0,
    requestedBookings: requestedBookingsRow[0]?.value ?? 0,
    openComplaints: openComplaintsRow[0]?.value ?? 0,
    inStockProducts: inStockRow[0]?.value ?? 0,
    outOfStockProducts: outOfStockRow[0]?.value ?? 0,
  };
}

export type OrdersByDay = { day: string; count: number; revenueCedis: number };

export async function getOrdersByDay(days = 7): Promise<OrdersByDay[]> {
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`,
      count: count(),
      revenue: sum(orders.totalPesewas),
    })
    .from(orders)
    .where(
      sql`${orders.createdAt} >= now() - (${days}::int * interval '1 day')`,
    )
    .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
    .orderBy(sql`date_trunc('day', ${orders.createdAt})`);

  return rows.map((row) => ({
    day: row.day,
    count: row.count,
    revenueCedis: pesewasToCedis(Number(row.revenue ?? 0)),
  }));
}

export type TopProductRow = {
  name: string;
  quantity: number;
  revenueCedis: number;
};

export async function getTopProducts(limit = 5): Promise<TopProductRow[]> {
  const rows = await db
    .select({
      name: orderItems.productName,
      quantity: sum(orderItems.quantity),
      revenue: sum(
        sql<number>`${orderItems.unitPricePesewas} * ${orderItems.quantity}`,
      ),
    })
    .from(orderItems)
    .groupBy(orderItems.productName)
    .orderBy(
      desc(
        sql`sum(${orderItems.unitPricePesewas} * ${orderItems.quantity})`,
      ),
    )
    .limit(limit);

  return rows.map((row) => ({
    name: row.name,
    quantity: Number(row.quantity ?? 0),
    revenueCedis: pesewasToCedis(Number(row.revenue ?? 0)),
  }));
}

export type BookingsByStatus = { status: string; label: string; count: number };

export async function getBookingsByStatus(): Promise<BookingsByStatus[]> {
  const rows = await db
    .select({
      status: bookings.status,
      count: count(),
    })
    .from(bookings)
    .groupBy(bookings.status);

  return rows.map((row) => ({
    status: row.status,
    label: bookingStatusLabel(row.status),
    count: row.count,
  }));
}
