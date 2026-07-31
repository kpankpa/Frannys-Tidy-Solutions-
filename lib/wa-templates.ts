import { buildWhatsAppUrl } from "@/lib/constants";
import { bookingStatusLabel } from "@/lib/booking-status";
import { orderStatusLabel } from "@/lib/order-status";
import { toWhatsAppE164 } from "@/lib/phone";

export type WaTemplateLink = {
  id: string;
  label: string;
  href: string;
};

export function customerOrderWaTemplates(input: {
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  status: string;
  businessName?: string;
}): WaTemplateLink[] {
  const brand = input.businessName ?? "Frannys Tidy Solutions";
  const name = input.customerName.trim() || "there";
  const to = toWhatsAppE164(input.customerPhone) ?? "";

  const templates = [
    {
      id: "confirmed",
      label: "Order confirmed",
      text: [
        `Hello ${name},`,
        "",
        `Your ${brand} order ${input.orderNumber} is confirmed.`,
        "We will update you as we prepare and deliver it.",
        "",
        "Thank you for shopping with us.",
      ].join("\n"),
    },
    {
      id: "awaiting_payment",
      label: "Awaiting payment",
      text: [
        `Hello ${name},`,
        "",
        `Your order ${input.orderNumber} is awaiting payment.`,
        "Please confirm payment details so we can continue packaging.",
        "",
        `Reply here or call us. ${brand}`,
      ].join("\n"),
    },
    {
      id: "out_for_delivery",
      label: "Out for delivery",
      text: [
        `Hello ${name},`,
        "",
        `Good news: order ${input.orderNumber} is out for delivery.`,
        "Please keep your phone nearby.",
        "",
        brand,
      ].join("\n"),
    },
    {
      id: "delivered",
      label: "Delivered",
      text: [
        `Hello ${name},`,
        "",
        `Order ${input.orderNumber} has been delivered.`,
        "We hope you love your Frannys products. Reply if you need anything else.",
        "",
        brand,
      ].join("\n"),
    },
    {
      id: "cancelled",
      label: "Order cancelled",
      text: [
        `Hello ${name},`,
        "",
        `Order ${input.orderNumber} has been cancelled.`,
        "Contact us if you would like to place a new order.",
        "",
        brand,
      ].join("\n"),
    },
    {
      id: "status_update",
      label: `Status: ${orderStatusLabel(input.status)}`,
      text: [
        `Hello ${name},`,
        "",
        `Update on your ${brand} order ${input.orderNumber}:`,
        `Current status: ${orderStatusLabel(input.status)}.`,
        "",
        "Reply here if you have any questions.",
      ].join("\n"),
    },
  ];

  if (!to) return [];

  return templates.map((t) => ({
    id: t.id,
    label: t.label,
    href: buildWhatsAppUrl(t.text, to),
  }));
}

export function customerBookingWaTemplates(input: {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  status: string;
  preferredDate?: string | null;
  businessName?: string;
}): WaTemplateLink[] {
  const brand = input.businessName ?? "Frannys Tidy Solutions";
  const name = input.customerName.trim() || "there";
  const to = toWhatsAppE164(input.customerPhone) ?? "";
  const when = input.preferredDate?.trim() || "your preferred date";

  const templates = [
    {
      id: "booking_confirmed",
      label: "Booking confirmed",
      text: [
        `Hello ${name},`,
        "",
        `Your ${brand} cleaning booking for ${input.serviceType} is confirmed.`,
        `Preferred timing: ${when}.`,
        "We will share final arrival details soon.",
        "",
        "Thank you.",
      ].join("\n"),
    },
    {
      id: "booking_scheduled",
      label: "Scheduled",
      text: [
        `Hello ${name},`,
        "",
        `Your ${input.serviceType} appointment is scheduled for ${when}.`,
        "Our team will arrive as planned. Please ensure access to the space.",
        "",
        brand,
      ].join("\n"),
    },
    {
      id: "booking_completed",
      label: "Completed",
      text: [
        `Hello ${name},`,
        "",
        `Thank you for choosing ${brand}. Your ${input.serviceType} service is marked completed.`,
        "We would love your feedback anytime.",
      ].join("\n"),
    },
    {
      id: "booking_status",
      label: `Status: ${bookingStatusLabel(input.status)}`,
      text: [
        `Hello ${name},`,
        "",
        `Update on your ${input.serviceType} request:`,
        `Status: ${bookingStatusLabel(input.status)}.`,
        "",
        brand,
      ].join("\n"),
    },
  ];

  if (!to) return [];

  return templates.map((t) => ({
    id: t.id,
    label: t.label,
    href: buildWhatsAppUrl(t.text, to),
  }));
}

export function lowStockAlertMessage(
  items: Array<{ name: string; stockQuantity: number }>,
  businessName = "Frannys Tidy Solutions",
) {
  const lines = items.map((item) => `• ${item.name}: ${item.stockQuantity} left`);
  return [
    `${businessName} low stock alert`,
    "",
    ...lines,
    "",
    "Please restock these products in admin.",
  ].join("\n");
}
