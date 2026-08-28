import { asc, desc, eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import {
  customers,
  orderEvents,
  orderItems,
  orders,
  products,
} from "@/lib/db/schema";
import { cedisToPesewas, pesewasToCedis } from "@/lib/money";
import {
  isOrderCancelled,
  normalizeOrderStatus,
  ORDER_ADMIN_STATUSES,
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

/** Order created by an admin from the dashboard (e.g. phone or walk-in sale). */
export type ManualOrderInput = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: CreateOrderItemInput[];
  status: string;
  deliveryFeeCedis: number;
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

function generateOrderNumber() {
  return `FTS-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/** Shared item cleanup for website checkout and admin-created orders. */
function cleanOrderItems(items: CreateOrderItemInput[]) {
  return items
    .map((item) => ({
      productId: item.productId.trim(),
      quantity: Math.min(
        LIMITS.maxQtyPerLine,
        Math.max(0, Math.floor(Number(item.quantity))),
      ),
    }))
    .filter((item) => item.productId && item.quantity > 0)
    .slice(0, LIMITS.maxCartLines);
}

/** Shared customer field parsing and validation. */
function parseCustomerDetails(
  name: string,
  phone: string,
  address: string,
  notes: string,
) {
  const cleanName = clampText(name, LIMITS.name);
  const cleanPhone = normalizeGhanaPhone(phone);
  const cleanAddress = clampText(address, LIMITS.address);
  const cleanNotes = clampText(notes, LIMITS.notes);

  if (!cleanName || !cleanPhone || !cleanAddress) {
    throw new Error(
      "Enter a valid name, Ghana phone number (e.g. 0201234567), and delivery address.",
    );
  }

  return { cleanName, cleanPhone, cleanAddress, cleanNotes };
}

type SaveNewOrderOptions = {
  name: string;
  phone: string;
  address: string;
  notes: string;
  items: CreateOrderItemInput[];
  status: string;
  deliveryPesewas: number;
  orderEventNote: string;
  /** Admin-created orders may correct the stored customer name. Public checkout cannot prove identity by phone, so it never renames. */
  syncCustomerName: boolean;
};

/** Prices line items, checks stock, saves order + items + first timeline event. */
async function saveNewOrder(
  options: SaveNewOrderOptions,
): Promise<CreateOrderResult> {
  if (!options.items.length) {
    throw new Error("Your cart is empty.");
  }

  const cleanedItems = cleanOrderItems(options.items);

  if (!cleanedItems.length) {
    throw new Error("Your cart has no valid items.");
  }

  const name = options.name;
  const phone = options.phone;
  const address = options.address;
  const notes = options.notes;
  const status = options.status;
  const deliveryPesewas = options.deliveryPesewas;

  return db.transaction(async (tx) => {
    const pricedLines: Array<{
      productId: string;
      productName: string;
      unitPricePesewas: number;
      quantity: number;
      stockAfter: number;
    }> = [];

    for (const item of cleanedItems) {
      const product = await tx.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        throw new Error("One or more products are no longer available.");
      }
      if (product.stockQuantity <= 0 || !product.inStock) {
        throw new Error(`${product.name} is currently out of stock.`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `${product.name} only has ${product.stockQuantity} left in stock.`,
        );
      }

      pricedLines.push({
        productId: product.id,
        productName: product.name,
        unitPricePesewas:
          product.salePricePesewas != null &&
          product.salePricePesewas > 0 &&
          product.salePricePesewas < product.pricePesewas
            ? product.salePricePesewas
            : product.pricePesewas,
        quantity: item.quantity,
        stockAfter: product.stockQuantity - item.quantity,
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
      customerId = existingCustomer.id;
      // Only admin-created orders may correct the stored CRM name.
      // Public checkout cannot prove identity by phone alone.
      if (options.syncCustomerName && existingCustomer.name !== name) {
        await tx
          .update(customers)
          .set({ name })
          .where(eq(customers.id, customerId));
      }
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
            status,
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

    for (const line of pricedLines) {
      await tx
        .update(products)
        .set({
          stockQuantity: line.stockAfter,
          inStock: line.stockAfter > 0,
          updatedAt: new Date(),
        })
        .where(eq(products.id, line.productId));
    }

    await tx.insert(orderEvents).values({
      orderId: createdOrder.id,
      status,
      note: options.orderEventNote,
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

/** Website checkout: honeypot check, pending status, no delivery fee yet. */
export async function createOrderFromCart(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  if (input.website?.trim()) {
    throw new Error("Could not place your order.");
  }

  const details = parseCustomerDetails(
    input.name,
    input.phone,
    input.address,
    input.notes ?? "",
  );

  return saveNewOrder({
    name: details.cleanName,
    phone: details.cleanPhone,
    address: details.cleanAddress,
    notes: details.cleanNotes,
    items: input.items,
    status: "pending",
    deliveryPesewas: 0,
    orderEventNote: "Order placed via website checkout.",
    syncCustomerName: false,
  });
}

/**
 * Admin-created order from the dashboard (phone or walk-in sale).
 * Admin picks the starting status and delivery fee.
 */
export async function createManualOrder(
  input: ManualOrderInput,
): Promise<{ orderNumber: string }> {
  const details = parseCustomerDetails(
    input.name,
    input.phone,
    input.address,
    input.notes ?? "",
  );

  const statusKey = normalizeOrderStatus(input.status);
  const status = ORDER_ADMIN_STATUSES.some((step) => step.key === statusKey)
    ? statusKey
    : "confirmed";

  if (!Number.isFinite(input.deliveryFeeCedis) || input.deliveryFeeCedis < 0) {
    throw new Error("Enter a valid delivery fee.");
  }
  const roundedDeliveryCedis = Math.round(input.deliveryFeeCedis * 100) / 100;

  const result = await saveNewOrder({
    name: details.cleanName,
    phone: details.cleanPhone,
    address: details.cleanAddress,
    notes: details.cleanNotes,
    items: input.items,
    status,
    deliveryPesewas: cedisToPesewas(roundedDeliveryCedis),
    orderEventNote: "Order created from admin dashboard.",
    syncCustomerName: true,
  });

  return { orderNumber: result.orderNumber };
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

export async function findOrderByNumber(
  orderNumber: string,
): Promise<TrackedOrder | null> {
  const normalizedNumber = clampText(orderNumber, LIMITS.orderNumber).toUpperCase();
  if (!normalizedNumber) return null;

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

/** Restore stock when cancelling; re-reserve when un-cancelling. */
async function adjustStockForOrderStatusChange(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  orderId: string,
  previousStatus: string,
  nextStatus: string,
) {
  const wasCancelled = isOrderCancelled(previousStatus);
  const nowCancelled = isOrderCancelled(nextStatus);

  if (wasCancelled === nowCancelled) return;

  const items = await tx.query.orderItems.findMany({
    where: eq(orderItems.orderId, orderId),
  });

  for (const item of items) {
    if (!item.productId || item.quantity <= 0) continue;

    const product = await tx.query.products.findFirst({
      where: eq(products.id, item.productId),
      columns: { id: true, name: true, stockQuantity: true },
    });
    if (!product) continue;

    if (nowCancelled) {
      // Order cancelled: put reserved units back on the shelf.
      const stockAfter = product.stockQuantity + item.quantity;
      await tx
        .update(products)
        .set({
          stockQuantity: stockAfter,
          inStock: stockAfter > 0,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id));
    } else {
      // Order un-cancelled: reserve stock again like a new order.
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Cannot reopen this order. ${product.name} only has ${product.stockQuantity} left in stock.`,
        );
      }
      const stockAfter = product.stockQuantity - item.quantity;
      await tx
        .update(products)
        .set({
          stockQuantity: stockAfter,
          inStock: stockAfter > 0,
          updatedAt: new Date(),
        })
        .where(eq(products.id, product.id));
    }
  }
}

export type UpdateOrderStatusResult = {
  orderNumber: string;
  status: string;
  unchanged?: boolean;
};

export async function updateOrderStatus(
  orderNumber: string,
  status: string,
  note = "",
): Promise<UpdateOrderStatusResult> {
  const normalized = normalizeOrderStatus(status);
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber.trim().toUpperCase()),
  });
  if (!order) {
    throw new Error("Order not found.");
  }

  const previousStatus = normalizeOrderStatus(order.status);
  if (previousStatus === normalized && !note.trim()) {
    return {
      orderNumber: order.orderNumber,
      status: normalized,
      unchanged: true,
    };
  }

  await db.transaction(async (tx) => {
    await adjustStockForOrderStatusChange(
      tx,
      order.id,
      previousStatus,
      normalized,
    );
    await tx
      .update(orders)
      .set({ status: normalized, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    const stockNote =
      !isOrderCancelled(previousStatus) && isOrderCancelled(normalized)
        ? " Stock returned to inventory."
        : isOrderCancelled(previousStatus) && !isOrderCancelled(normalized)
          ? " Stock reserved again for this order."
          : "";

    await tx.insert(orderEvents).values({
      orderId: order.id,
      status: normalized,
      note:
        note.trim() ||
        `Status updated to ${orderStatusLabel(normalized)}.${stockNote}`,
    });
  });

  return { orderNumber: order.orderNumber, status: normalized };
}

export type UpdateOrderDeliveryFeeResult = {
  orderNumber: string;
  deliveryCedis: number;
  unchanged?: boolean;
};

export async function updateOrderDeliveryFee(
  orderNumber: string,
  deliveryFeeCedis: number,
): Promise<UpdateOrderDeliveryFeeResult> {
  if (!Number.isFinite(deliveryFeeCedis) || deliveryFeeCedis < 0) {
    throw new Error("Enter a valid delivery fee.");
  }

  const rounded = Math.round(deliveryFeeCedis * 100) / 100;
  const deliveryPesewas = cedisToPesewas(rounded);

  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber.trim().toUpperCase()),
  });
  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.deliveryPesewas === deliveryPesewas) {
    return {
      orderNumber: order.orderNumber,
      deliveryCedis: rounded,
      unchanged: true,
    };
  }

  const totalPesewas = order.subtotalPesewas + deliveryPesewas;

  await db
    .update(orders)
    .set({
      deliveryPesewas,
      totalPesewas,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  return {
    orderNumber: order.orderNumber,
    deliveryCedis: pesewasToCedis(deliveryPesewas),
  };
}
