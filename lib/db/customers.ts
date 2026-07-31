import { count, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, orders } from "@/lib/db/schema";
import { listBookingsForCustomer } from "@/lib/db/bookings";
import { bookingStatusLabel } from "@/lib/booking-status";
import { pesewasToCedis } from "@/lib/money";
import { orderStatusLabel } from "@/lib/order-status";

export type CustomerSummary = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  orderCount: number;
  spendCedis: number;
  createdAt: string;
};

export async function listCustomers(): Promise<CustomerSummary[]> {
  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      phone: customers.phone,
      email: customers.email,
      createdAt: customers.createdAt,
      orderCount: count(orders.id),
      spend: sum(orders.totalPesewas),
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .groupBy(
      customers.id,
      customers.name,
      customers.phone,
      customers.email,
      customers.createdAt,
    )
    .orderBy(desc(sql`coalesce(sum(${orders.totalPesewas}), 0)`));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    orderCount: Number(row.orderCount ?? 0),
    spendCedis: pesewasToCedis(Number(row.spend ?? 0)),
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getCustomerById(id: string) {
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, id),
  });
  if (!customer) return null;

  const [customerOrders, customerBookings] = await Promise.all([
    db.query.orders.findMany({
      where: eq(orders.customerId, id),
      with: { items: true },
      orderBy: [desc(orders.createdAt)],
    }),
    listBookingsForCustomer(id, customer.phone),
  ]);

  return {
    ...customer,
    orders: customerOrders.map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: orderStatusLabel(order.status),
      totalCedis: pesewasToCedis(order.totalPesewas),
      createdAt: order.createdAt.toISOString(),
      itemsSummary: order.items
        .map((item) => `${item.productName} x${item.quantity}`)
        .join(", "),
    })),
    bookings: customerBookings.map((booking) => ({
      id: booking.id,
      serviceType: booking.serviceType,
      location: booking.location,
      preferredDate: booking.preferredDate,
      status: booking.status,
      statusLabel: bookingStatusLabel(booking.status),
      source: booking.source,
      message: booking.message,
      createdAt: booking.createdAt.toISOString(),
    })),
  };
}
