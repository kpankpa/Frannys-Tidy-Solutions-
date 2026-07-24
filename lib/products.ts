export type ProductCategory =
  | "Detergents"
  | "Eco-Friendly"
  | "Specialty"
  | "Disinfectants";

export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  price: number;
  category: ProductCategory;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: "Best Seller" | "New" | "Eco" | "Top Rated";
  image: string;
  images: string[];
  imageAlt: string;
};

export const categories: Array<"All" | ProductCategory> = [
  "All",
  "Detergents",
  "Eco-Friendly",
  "Specialty",
  "Disinfectants",
];

export const products: Product[] = [
  {
    id: "multi-surface",
    name: "Multi-Surface Cleaner",
    description:
      "Everyday cleaner for kitchens, counters, and hard surfaces with a fresh finish.",
    longDescription:
      "Our Multi-Surface Cleaner is formulated for Ghanaian homes and workplaces. It lifts everyday dirt, grease, and fingerprints while leaving a crisp, fresh scent, without harsh residues.",
    features: [
      "Safe for sealed wood, tile, and laminate",
      "Fresh citrus finish",
      "Concentrated formula",
      "Made for daily use",
    ],
    price: 45,
    category: "Detergents",
    rating: 4.9,
    reviews: 128,
    inStock: true,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Multi-surface cleaning solution bottle",
  },
  {
    id: "floor-shine",
    name: "Floor Shine Detergent",
    description:
      "Powerful floor wash that lifts dirt and leaves a lasting clean shine.",
    longDescription:
      "Engineered for tile, terrazzo, and sealed floors. Floor Shine Detergent removes dust and sticky residue while restoring a soft, polished look after mopping.",
    features: [
      "High-foaming clean",
      "Low-residue shine",
      "Works with mop & bucket",
      "Ideal for homes and offices",
    ],
    price: 55,
    category: "Detergents",
    rating: 4.8,
    reviews: 96,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Floor shine detergent",
  },
  {
    id: "glass-sparkle",
    name: "Glass Sparkle Spray",
    description:
      "Streak-free formula for windows, mirrors, and glass surfaces.",
    longDescription:
      "Glass Sparkle Spray delivers a crystal-clear finish on windows, mirrors, and glass partitions, perfect for homes, offices, and retail spaces.",
    features: [
      "Streak-free finish",
      "Fast-drying mist",
      "Ammonia-balanced",
      "Professional strength",
    ],
    price: 35,
    category: "Specialty",
    rating: 4.7,
    reviews: 74,
    inStock: true,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Glass sparkle spray",
  },
  {
    id: "bathroom-deep",
    name: "Bathroom Deep Clean",
    description:
      "Removes soap scum, limescale, and bathroom grime for a hygienic finish.",
    longDescription:
      "A targeted bathroom formula that tackles soap scum, hard-water marks, and lingering odours on tiles, taps, and basins.",
    features: [
      "Limescale control",
      "Soap-scum remover",
      "Fresh clean scent",
      "Thick cling formula",
    ],
    price: 50,
    category: "Specialty",
    rating: 4.6,
    reviews: 61,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Bathroom deep clean product",
  },
  {
    id: "laundry-fresh",
    name: "Laundry Fresh Liquid",
    description:
      "Effective laundry detergent that leaves clothes soft and fresh.",
    longDescription:
      "Laundry Fresh Liquid is designed for hand wash and machine wash. It lifts stains and leaves fabrics soft with a long-lasting fresh scent.",
    features: [
      "Works in cold water",
      "Colour-safe",
      "Soft fabric feel",
      "Family-sized value",
    ],
    price: 65,
    category: "Detergents",
    rating: 4.9,
    reviews: 142,
    inStock: true,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Laundry fresh liquid detergent",
  },
  {
    id: "dish-power",
    name: "Dish Power Gel",
    description:
      "Cuts through grease on pots, pans, and dishes with lasting foam.",
    longDescription:
      "Dish Power Gel cuts heavy kitchen grease quickly while remaining gentle on hands, ideal for busy households and commercial kitchens.",
    features: [
      "Grease-cutting power",
      "Long-lasting foam",
      "Gentle on hands",
      "Concentrated drops",
    ],
    price: 40,
    category: "Detergents",
    rating: 4.5,
    reviews: 88,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Dish power gel",
  },
  {
    id: "eco-all-purpose",
    name: "Eco All-Purpose Cleaner",
    description:
      "Gentle, eco-minded formula for homes that want effective everyday cleaning.",
    longDescription:
      "Eco All-Purpose Cleaner balances performance with a gentler profile, great for families seeking everyday freshness with fewer harsh additives.",
    features: [
      "Plant-inspired scent",
      "Gentle on surfaces",
      "Everyday versatility",
      "Refill-friendly bottle",
    ],
    price: 48,
    category: "Eco-Friendly",
    rating: 4.8,
    reviews: 53,
    inStock: true,
    badge: "Eco",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Eco all-purpose cleaner",
  },
  {
    id: "disinfectant",
    name: "Home Disinfectant",
    description:
      "Kills germs on high-touch surfaces for healthier homes and workplaces.",
    longDescription:
      "Home Disinfectant is built for high-touch zones like door handles, switches, desks, and shared spaces, helping keep households and offices healthier.",
    features: [
      "Broad-surface use",
      "Fast contact clean",
      "Fresh hygienic scent",
      "Office & home ready",
    ],
    price: 58,
    category: "Disinfectants",
    rating: 4.7,
    reviews: 67,
    inStock: true,
    badge: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
    ],
    imageAlt: "Home disinfectant spray",
  },
];

export function formatPrice(amount: number): string {
  return `GH₵ ${amount.toFixed(2)}`;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, limit = 4): Product[] {
  const current = getProduct(id);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.id !== id && p.category === current.category)
    .concat(products.filter((p) => p.id !== id && p.category !== current.category))
    .slice(0, limit);
}
