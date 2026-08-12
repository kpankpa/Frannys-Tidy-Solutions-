/** Static catalogue used only by `db:seed`. Runtime shop reads Postgres. */

import {
  PRODUCT_IMAGE_FILES,
  productNameForSlug,
  publicProductImagePath,
} from "@/lib/product-images";

function catalogName(slug: string) {
  return productNameForSlug(slug);
}

function catalogImageAlt(slug: string) {
  return `Frannys ${catalogName(slug)}`;
}

function productImage(slug: string, fallback: string) {
  const file = PRODUCT_IMAGE_FILES[slug];
  return file ? publicProductImagePath(file) : fallback;
}

function buildFeatures(keyFeatures: string[], idealFor: string[]): string[] {
  return [...keyFeatures, `Ideal for: ${idealFor.join(", ")}`];
}

export type SeedProduct = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  price: number;
  category: "Detergents" | "Eco-Friendly" | "Specialty" | "Disinfectants";
  rating: number;
  reviews: number;
  inStock: boolean;
  /** Optional seed stock. Defaults to 25 when in stock. */
  stockQuantity?: number;
  badge?: "Best Seller" | "New" | "Eco" | "Top Rated";
  image: string;
  images: string[];
  imageAlt: string;
};

export const seedCatalog: SeedProduct[] = [
  {
    id: "fabric-softener",
    name: catalogName("fabric-softener"),
    description:
      "Keeps clothes soft, fresh, and comfortable after every wash with a pleasant fragrance.",
    longDescription:
      "Our Fabric Softener keeps your clothes soft, fresh, and comfortable after every wash. It helps reduce wrinkles and static while leaving a pleasant fragrance on fabrics.",
    features: buildFeatures(
      [
        "Long-lasting fragrance",
        "Softens fabrics",
        "Gentle on clothes",
        "Helps reduce wrinkles",
        "Suitable for all fabric types",
      ],
      [
        "Laundry at home",
        "Hotels",
        "Laundry services",
        "Schools",
        "Hospitals",
      ],
    ),
    price: 30,
    category: "Detergents",
    rating: 4.8,
    reviews: 64,
    inStock: true,
    image: productImage("fabric-softener", "/flyers/fabric-softner.jpg"),
    images: [productImage("fabric-softener", "/flyers/fabric-softner.jpg")],
    imageAlt: catalogImageAlt("fabric-softener"),
  },
  {
    id: "toilet-cleaner",
    name: catalogName("toilet-cleaner"),
    description:
      "Removes tough stains, kills bacteria, and eliminates odours for a sparkling clean toilet.",
    longDescription:
      "A powerful toilet cleaner formulated to remove tough stains, kill bacteria, and eliminate unpleasant odours, leaving your toilet sparkling clean.",
    features: buildFeatures(
      [
        "Kills 99.9% of germs",
        "Removes stubborn stains",
        "Eliminates bad odours",
        "Thick formula for better cleaning",
        "Leaves toilet fresh and hygienic",
      ],
      ["Homes", "Offices", "Hotels", "Schools", "Public washrooms"],
    ),
    price: 30,
    category: "Specialty",
    rating: 4.7,
    reviews: 58,
    inStock: true,
    image: productImage("toilet-cleaner", "/flyers/toilet-cleaner.jpeg"),
    images: [productImage("toilet-cleaner", "/flyers/toilet-cleaner.jpeg")],
    imageAlt: catalogImageAlt("toilet-cleaner"),
  },
  {
    id: "bathroom-cleaner",
    name: catalogName("bathroom-cleaner"),
    description:
      "Removes soap scum, dirt, and bathroom stains while disinfecting surfaces.",
    longDescription:
      "Our Bathroom Cleaner easily removes soap scum, dirt, and bathroom stains while disinfecting surfaces and leaving a refreshing scent.",
    features: buildFeatures(
      [
        "Removes soap scum",
        "Kills germs",
        "Cleans tiles and sinks",
        "Removes stains",
        "Fresh fragrance",
        "Easy spray application",
      ],
      [
        "Bathroom tiles",
        "Wash basins",
        "Shower areas",
        "Bathtubs",
        "Bathroom fixtures",
      ],
    ),
    price: 25,
    category: "Specialty",
    rating: 4.8,
    reviews: 72,
    inStock: true,
    badge: "Best Seller",
    image: productImage("bathroom-cleaner", "/flyers/bathroom-cleaner.jpeg"),
    images: [productImage("bathroom-cleaner", "/flyers/bathroom-cleaner.jpeg")],
    imageAlt: catalogImageAlt("bathroom-cleaner"),
  },
  {
    id: "multi-purpose-bleach",
    name: catalogName("multi-purpose-bleach"),
    description:
      "Whitens, disinfects, and removes stains to keep your home hygienic and germ-free.",
    longDescription:
      "Our Multi-Purpose Bleach is specially formulated for effective whitening, disinfecting, and stain removal. It helps keep your home hygienic and germ-free.",
    features: buildFeatures(
      [
        "Whitens clothes",
        "Kills germs and bacteria",
        "Removes stains",
        "Disinfects surfaces",
        "Suitable for household cleaning",
      ],
      [
        "Laundry",
        "Toilets",
        "Bathrooms",
        "Kitchen surfaces",
        "Floors",
        "General household disinfection",
      ],
    ),
    price: 30,
    category: "Disinfectants",
    rating: 4.9,
    reviews: 81,
    inStock: true,
    badge: "Top Rated",
    image: productImage(
      "multi-purpose-bleach",
      "/flyers/multi-purpose-bleach.jpg",
    ),
    images: [
      productImage("multi-purpose-bleach", "/flyers/multi-purpose-bleach.jpg"),
    ],
    imageAlt: catalogImageAlt("multi-purpose-bleach"),
  },
  {
    id: "fresh-clean-liquid-soap-4-5l",
    name: catalogName("fresh-clean-liquid-soap-4-5l"),
    description:
      "Advanced formula cuts grease 3x more effectively and kills 99% of germs in a 4.5L jerry can.",
    longDescription:
      "Our Fresh + Clean Liquid Soap is an advanced-formula cleaner that cuts through grease 3x more effectively than regular liquid soap, while killing 99% of germs. Packed in a durable 4.5L jerry can, it is a versatile all-purpose cleaner for the home, office, or shop.",
    features: buildFeatures(
      [
        "Cleans 3x more greasy dishes",
        "Kills 99% of germs",
        "Advanced Fresh + Clean formula",
        "Large 4.5L size for extended use",
      ],
      [
        "Dish washing",
        "Car washing",
        "Hand washing",
        "Washing clothes",
        "Cleaning floors",
      ],
    ),
    price: 60,
    category: "Detergents",
    rating: 4.9,
    reviews: 124,
    inStock: true,
    badge: "Best Seller",
    image: productImage(
      "fresh-clean-liquid-soap-4-5l",
      "/flyers/liquid-soap fresh +clean.jpeg",
    ),
    images: [
      productImage(
        "fresh-clean-liquid-soap-4-5l",
        "/flyers/liquid-soap fresh +clean.jpeg",
      ),
    ],
    imageAlt: catalogImageAlt("fresh-clean-liquid-soap-4-5l"),
  },
  {
    id: "glass-cleaner",
    name: catalogName("glass-cleaner"),
    description:
      "Fast-acting, streak-free shine safe for tinted glass, windows, and mirrors.",
    longDescription:
      "Our Glass Cleaner delivers a fast-acting, streak-free shine on all glass surfaces. Formulated to be safe on tinted glass, it is an easy spray-and-wipe solution for sparkling windows and mirrors.",
    features: buildFeatures(
      [
        "Streak-free finish",
        "Fast-acting formula",
        "Safe for tinted glass",
        "Convenient trigger spray bottle",
        "Ingredients: Aqua, Ethanol, colourant",
      ],
      [
        "Windows",
        "Mirrors",
        "Glass doors",
        "Car windshields",
        "General glass surfaces",
      ],
    ),
    price: 25,
    category: "Specialty",
    rating: 4.7,
    reviews: 49,
    inStock: true,
    image: productImage("glass-cleaner", "/flyers/glass-cleaner.jpeg"),
    images: [productImage("glass-cleaner", "/flyers/glass-cleaner.jpeg")],
    imageAlt: catalogImageAlt("glass-cleaner"),
  },
  {
    id: "liquid-soap-750ml",
    name: catalogName("liquid-soap-750ml"),
    description:
      "Travel and home-friendly Fresh + Clean liquid soap in a convenient 750ml pump bottle.",
    longDescription:
      "The travel and home-friendly size of our Fresh + Clean Liquid Soap. Same advanced formula that cuts grease 3x more effectively and kills 99% of germs, now in a convenient 750ml pump bottle.",
    features: buildFeatures(
      [
        "Cleans 3x more greasy dishes",
        "Kills 99% of germs",
        "Advanced Fresh + Clean formula",
        "Compact, easy-to-use pump bottle",
      ],
      [
        "Dish washing",
        "Car washing",
        "Hand washing",
        "Washing clothes",
        "Cleaning floors",
      ],
    ),
    price: 12,
    category: "Detergents",
    rating: 4.6,
    reviews: 37,
    inStock: true,
    badge: "New",
    image: productImage("liquid-soap-750ml", "/flyers/liquid-soap.jpeg"),
    images: [productImage("liquid-soap-750ml", "/flyers/liquid-soap.jpeg")],
    imageAlt: catalogImageAlt("liquid-soap-750ml"),
  },
];
