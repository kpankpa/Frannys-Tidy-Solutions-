"use server";

import {
  createOrderFromCart,
  findOrderByNumberAndPhone,
  type CreateOrderInput,
  type TrackedOrder,
} from "@/lib/db/orders";
import { getSiteConfig } from "@/lib/db/settings";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { normalizeGhanaPhone } from "@/lib/phone";
import { isHoneypotFilled } from "@/lib/validation";

/** Public track payload: omit address/notes/raw phone. */
export type TrackedOrderView = {
  orderNumber: string;
  status: string;
  statusLabel: string;
  statusIndex: number;
  customer: string;
  phoneMasked: string;
  subtotalCedis: number;
  deliveryCedis: number;
  totalCedis: number;
  lineItems: TrackedOrder["lineItems"];
  events: Array<{
    status: string;
    statusLabel: string;
    createdAt: string;
  }>;
};

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${digits.slice(0, 3)}****${digits.slice(-2)}`;
}

function toPublicTrackView(order: TrackedOrder): TrackedOrderView {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: order.statusLabel,
    statusIndex: order.statusIndex,
    customer: order.customer,
    phoneMasked: maskPhone(order.phone),
    subtotalCedis: order.subtotalCedis,
    deliveryCedis: order.deliveryCedis,
    totalCedis: order.totalCedis,
    lineItems: order.lineItems,
    events: order.events.map((event) => ({
      status: event.status,
      statusLabel: event.statusLabel,
      createdAt: event.createdAt,
    })),
  };
}

export type PlaceOrderState =
  | { ok: true; orderNumber: string; whatsappMessage: string }
  | { ok: false; error: string };

export async function placeOrderAction(
  input: CreateOrderInput,
): Promise<PlaceOrderState> {
  const ip = await getClientIp();
  const phoneKey = normalizeGhanaPhone(input.phone) ?? "unknown";

  const ipLimit = rateLimit({
    key: `order:ip:${ip}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!ipLimit.ok) {
    return { ok: false, error: rateLimitMessage(ipLimit.retryAfterSec) };
  }

  const phoneLimit = rateLimit({
    key: `order:phone:${phoneKey}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!phoneLimit.ok) {
    return { ok: false, error: rateLimitMessage(phoneLimit.retryAfterSec) };
  }

  if (isHoneypotFilled(input.website)) {
    return { ok: false, error: "Could not place your order." };
  }

  try {
    const site = await getSiteConfig();
    const order = await createOrderFromCart(input);

    const lines = order.items.map(
      (item) =>
        `• ${item.name} x ${item.qty}: GH₵ ${(item.unitPriceCedis * item.qty).toFixed(2)}`,
    );

    const whatsappMessage = [
      `Hello ${site.name}! I'd like to confirm order ${order.orderNumber}.`,
      "",
      `Name: ${input.name.trim()}`,
      `Phone: ${input.phone.trim()}`,
      `Delivery Address: ${input.address.trim()}`,
      input.notes?.trim() ? `Notes: ${input.notes.trim()}` : null,
      "",
      "Order:",
      ...lines,
      "",
      `Subtotal: GH₵ ${order.subtotalCedis.toFixed(2)}`,
      `Delivery: GH₵ ${order.deliveryCedis.toFixed(2)}`,
      `Grand Total: GH₵ ${order.totalCedis.toFixed(2)}`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      ok: true,
      orderNumber: order.orderNumber,
      whatsappMessage,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not place your order.";
    const safe =
      message.includes("stock") ||
      message.includes("cart") ||
      message.includes("phone") ||
      message.includes("address") ||
      message.includes("available") ||
      message.includes("valid")
        ? message
        : "Could not place your order. Please try again.";
    return { ok: false, error: safe };
  }
}

export type TrackOrderState =
  | { ok: true; order: TrackedOrderView }
  | { ok: false; error: string };

export async function trackOrderAction(input: {
  orderNumber: string;
  phone: string;
}): Promise<TrackOrderState> {
  const ip = await getClientIp();
  const limit = rateLimit({
    key: `track:ip:${ip}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) {
    return { ok: false, error: rateLimitMessage(limit.retryAfterSec) };
  }

  try {
    const order = await findOrderByNumberAndPhone(
      input.orderNumber,
      input.phone,
    );

    if (!order) {
      return {
        ok: false,
        error:
          "Order not found. Check the order number and phone used at checkout.",
      };
    }

    return { ok: true, order: toPublicTrackView(order) };
  } catch {
    return {
      ok: false,
      error: "Could not look up that order right now. Please try again.",
    };
  }
}
