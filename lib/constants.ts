export const SITE = {
  name: "Frannys Tidy Solutions",
  shortName: "Frannys",
  tagline: "Freshness Guaranteed Every Time",
  description:
    "Frannys Tidy Solutions offers premium cleaning detergents and professional cleaning services in Accra and across Ghana. Shop cleaning products online or book home and office cleaning.",
  established: 2023,
  registered: 2025,
  address: "East Legon Hills, Accra, Ghana",
  phone: "0200928400",
  phoneDisplay: "020 092 8400",
  whatsapp: "0200928400",
  whatsappE164: "233200928400",
  email: "frannystidysolutions@gmail.com",
  hours: "Monday to Sunday, 8:00 AM to 8:00 PM",
  hoursShort: "Mon to Sun, 8:00 AM to 8:00 PM",
  deliveryFee: 20,
} as const;

export const SOCIAL = {
  tiktok: "https://www.tiktok.com/@frannys.tidy.solu",
  instagram: "https://www.instagram.com/frannys_tidysolutions",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cleaning Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Track Order", href: "/track-order" },
] as const;

export const MOBILE_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Cart", href: "/cart" },
  { label: "More", href: "/about" },
] as const;

export function buildWhatsAppUrl(
  message: string,
  whatsappE164: string = SITE.whatsappE164,
): string {
  return `https://wa.me/${whatsappE164}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(
  productName: string,
  qty = 1,
  businessName: string = SITE.name,
): string {
  return `Hello ${businessName}!\nI'd like to order:\n• ${productName} x ${qty}\nPlease confirm availability and delivery.`;
}

export function bookingMessage(
  data: {
    name: string;
    phone: string;
    serviceType: string;
    location: string;
    preferredDate: string;
    message: string;
  },
  businessName: string = SITE.name,
): string {
  return [
    `Hello ${businessName}! I'd like to request a cleaning service.`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${data.serviceType}`,
    `Location: ${data.location}`,
    `Preferred Date: ${data.preferredDate || "Flexible"}`,
    data.message ? `Message: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export type CheckoutPayload = {
  name: string;
  phone: string;
  address: string;
  notes: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  delivery: number;
  total: number;
};

export function checkoutWhatsAppMessage(
  data: CheckoutPayload,
  businessName: string = SITE.name,
): string {
  const lines = data.items.map(
    (item) => `• ${item.name} x ${item.qty}: GH₵ ${(item.price * item.qty).toFixed(2)}`,
  );
  return [
    `Hello ${businessName}! I'd like to place an order.`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Delivery Address: ${data.address}`,
    data.notes ? `Notes: ${data.notes}` : null,
    "",
    "Order:",
    ...lines,
    "",
    `Subtotal: GH₵ ${data.subtotal.toFixed(2)}`,
    "Delivery fee: to be confirmed on WhatsApp based on your address.",
  ]
    .filter(Boolean)
    .join("\n");
}
