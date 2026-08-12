/** Brand flyers from Frannys marketing materials (`public/flyers`). */

function flyerPath(filename: string) {
  return `/flyers/${encodeURIComponent(filename)}`;
}

export const FLYERS = {
  brandProducts: {
    src: "/flyers/brand-products.jpg",
    alt: "Frannys team member showcasing branded cleaning products",
  },
  freshness: {
    src: "/flyers/freshness.jpg",
    alt: "Fresh laundry and Frannys cleaning products",
  },
  productLineup: {
    src: "/flyers/product-lineup.jpg",
    alt: "Frannys Tidy Solutions product lineup",
  },
  dealerFlyer: {
    src: flyerPath("WhatsApp Image 2026-08-01 at 16.10.24 (2).jpeg"),
    alt: "Frannys Tidy Solutions product range: liquid soap, fabric softener, glass cleaner, bathroom cleaner, toilet cleaner, floor detergent, and multi-purpose bleach",
  },
  aboutHero: {
    src: flyerPath("WhatsApp Image 2026-08-01 at 16.10.24 (1).jpeg"),
    alt: "Frannys Tidy Solutions team member presenting Frannys cleaning products in Accra, Ghana",
  },
} as const;
