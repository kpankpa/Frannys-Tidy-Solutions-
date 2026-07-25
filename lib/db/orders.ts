import { asc, desc, eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import {
  customers,
  orderEvents,
  orderItems,
  orders,
  products,
  settings,
} from "@/lib/db/schema";
import { SITE } from "@/lib/constants";
import { cedisToPesewas, pesewasToCedis } from "@/lib/money";
import {
  orderStatusIndex,
  orderStatusLabel,
} from "@/lib/order-status";
import { normalizeGhanaPhone, phonesMatch } from "@/lib/phone";
import { clampText, LIMITS } from "@/lib/validation";

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: CreateOrderItemInput[];
  /** Honeypot — must be empty */
  website?: string;
};

export type CreateOrderResult = {
  orderNumber: string;
  subtotalCedis: number;
  deliveryCedis: number;
  totalCedis: number;
  items: Array<{
    name: string;
    qty: number;
    unitPriceCedis: number;
  }>;
};

async function getDeliveryFeePesewas() {
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, "delivery_fee_pesewas"),
  });
  if (row && Number.isFinite(Number(row.value))) {
    return Number(row.value);
  }
  return cedisToPesewas(SITE.deliveryFee);
}

function generateOrderNumber() {
  return `FTS-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function createOrderFromCart(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  if (input.website?.trim()) {
    throw new Error("Could not place your order.");
  }

  const name = clampText(input.name, LIMITS.name);
  const phone = normalizeGhanaPhone(input.phone);
  const address = clampText(input.address, LIMITS.address);
  const notes = clampText(input.notes ?? "", LIMITS.notes);

  if (!name || !phone || !address) {
    throw new Error(
      "Enter a valid name, Ghana phone number (e.g. 0201234567), and delivery address.",
    );
  }

  if (!input.items.length) {
    throw new Error("Your cart is empty.");
  }

  const cleanedItems = input.items
    .map((item) => ({
      productId: item.productId.trim(),
      quantity: Math.min(
        LIMITS.maxQtyPerLine,
        Math.max(0, Math.floor(Number(item.quantity))),
      ),
    }))
    .filter((item) => item.productId && item.quantity > 0)
    .slice(0, LIMITS.maxCartLines);

  if (!cleanedItems.length) {
    throw new Error("Your cart has no valid items.");
  }

  const deliveryPesewas = await getDeliveryFeePesewas();

  return db.transaction(async (tx) => {
    const pricedLines: Array<{
      productId: string;
      productName: string;
      unitPricePesewas: number;
      quantity: number;
    }> = [];

    for (const item of cleanedItems) {
      const product = await tx.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        throw new Error("One or more products are no longer available.");
      }
      if (!product.inStock) {
        throw new Error(`${product.name} is currently out of stock.`);
      }

      pricedLines.push({
        productId: product.id,
        productName: product.name,
        unitPricePesewas: product.pricePesewas,
        quantity: item.quantity,
      });
    }

    const subtotalPesewas = pricedLines.reduce(
      (sum, line) => sum + line.unitPricePesewas * line.quantity,
      0,
    );
    const totalPesewas = subtotalPesewas + deliveryPesewas;

    const existingCustomer = await tx.query.customers.findFirst({
      where: eq(customers.phone, phone),
    });

    let customerId: string;
    if (existingCustomer) {
      // Do not overwrite CRM name from public checkout (phone is not proof of identity).
      customerId = existingCustomer.id;
    } else {
      const [createdCustomer] = await tx
        .insert(customers)
        .values({ name, phone })
        .returning();
      customerId = createdCustomer.id;
    }

    let createdOrder: typeof orders.$inferSelect | undefined;

    for (let attempt = 0; attempt < 8; attempt++) {
      const orderNumber = generateOrderNumber();
      try {
        const [row] = await tx
          .insert(orders)
          .values({
            orderNumber,
            customerId,
            status: "pending",
            subtotalPesewas,
            deliveryPesewas,
            totalPesewas,
            deliveryAddress: address,
            notes,
          })
          .returning();
        createdOrder = row;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("unique") || message.includes("23505")) {
          continue;
        }
        throw error;
      }
    }

    if (!createdOrder) {
      throw new Error("Could not create order. Please try again.");
    }

    await tx.insert(orderItems).values(
      pricedLines.map((line) => ({
        orderId: createdOrder!.id,
        productId: line.productId,
        productName: line.productName,
        unitPricePesewas: line.unitPricePesewas,
        quantity: line.quantity,
      })),
    );

    await tx.insert(orderEvents).values({
      orderId: createdOrder.id,
      status: "pending",
      note: "Order placed via website checkout.",
    });

    return {
      orderNumber: createdOrder.orderNumber,
      subtotalCedis: pesewasToCedis(subtotalPesewas),
      deliveryCedis: pesewasToCedis(deliveryPesewas),
      totalCedis: pesewasToCedis(totalPesewas),
      items: pricedLines.map((line) => ({
        name: line.productName,
        qty: line.quantity,
        unitPriceCedis: pesewasToCedis(line.unitPricePesewas),
      })),
    };
  });
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80";

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  statusLabel: string;
  statusIndex: number;
  customer: string;
  phone: string;
  deliveryAddress: string;
  notes: string;
  subtotalCedis: number;
  deliveryCedis: number;
  totalCedis: number;
  createdAt: string;
  lineItems: Array<{
    productId: string | null;
    name: string;
    quantity: number;
    unitPriceCedis: number;
    image: string;
    category: string;
  }>;
  events: Array<{
    status: string;
    statusLabel: string;
    note: string;
    createdAt: string;
  }>;
};

export type RecentOrderSummary = {
  orderNumber: string;
  customer: string;
  phone: string;
  status: string;
  statusLabel: string;
  totalCedis: number;
  itemsSummary: string;
  createdAt: string;
};

export async function findOrderByNumberAndPhone(
  orderNumber: string,
  phone: string,
): Promise<TrackedOrder | null> {
  const normalizedNumber = clampText(orderNumber, LIMITS.orderNumber).toUpperCase();
  const lookupPhone = normalizeGhanaPhone(phone) ?? phone.replace(/[\s\-()+/]/g, "").trim();

  if (!normalizedNumber || !lookupPhone) {
    return null;
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, normalizedNumber),
    with: {
      customer: true,
      items: {
        with: {
          product: {
            with: {
              category: true,
              images: true,
            },
          },
        },
      },
      events: {
        orderBy: [asc(orderEvents.createdAt)],
      },
    },
  });

  if (!order) return null;

  if (!phonesMatch(order.customer.phone, phone)) {
    return null;
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: orderStatusLabel(order.status),
    statusIndex: orderStatusIndex(order.status),
    customer: order.customer.name,
    phone: order.customer.phone,
    deliveryAddress: order.deliveryAddress,
    notes: order.notes,
    subtotalCedis: pesewasToCedis(order.subtotalPesewas),
    deliveryCedis: pesewasToCedis(order.deliveryPesewas),
    totalCedis: pesewasToCedis(order.totalPesewas),
    createdAt: order.createdAt.toISOString(),
    lineItems: order.items.map((item) => {
      const images = item.product?.images ?? [];
      const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
      return {
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        unitPriceCedis: pesewasToCedis(item.unitPricePesewas),
        image: sorted[0]?.url ?? FALLBACK_IMAGE,
        category: item.product?.category?.name ?? "Product",
      };
    }),
    events: order.events.map((event) => ({
      status: event.status,
      statusLabel: orderStatusLabel(event.status),
      note: event.note,
      createdAt: event.createdAt.toISOString(),
    })),
  };
}

export async function listRecentOrders(
  limit = 20,
  statusFilter?: string,
): Promise<RecentOrderSummary[]> {
  const rows = await db.query.orders.findMany({
    with: {
      customer: true,
      items: true,
    },
    where: statusFilter ? eq(orders.status, statusFilter) : undefined,
    orderBy: [desc(orders.createdAt)],
    limit,
  });

  return rows.map((order) => ({
    orderNumber: order.orderNumber,
    customer: order.customer.name,
    phone: order.customer.phone,
    status: order.status,
    statusLabel: orderStatusLabel(order.status),
    totalCedis: pesewasToCedis(order.totalPesewas),
    itemsSummary: order.items
      .map((item) => `${item.productName} x${item.quantity}`)
      .join(", "),
    createdAt: order.createdAt.toISOString(),
  }));
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string,
  note = "",
) {
  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber.trim().toUpperCase()),
  });
  if (!order) {
    throw new Error("Order not found.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: normalized, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    await tx.insert(orderEvents).values({
      orderId: order.id,
      status: normalized,
      note: note.trim() || `Status updated to ${orderStatusLabel(normalized)}.`,
    });
  });

  return { orderNumber: order.orderNumber, status: normalized };
}
