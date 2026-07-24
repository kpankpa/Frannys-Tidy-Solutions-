export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export const cleaningServices: Service[] = [
  {
    id: "professional",
    title: "Professional Cleaning",
    description:
      "Trained teams delivering consistent, hospitality-grade cleaning standards.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Professional%20Cleaning",
  },
  {
    id: "office",
    title: "Office Cleaning",
    description:
      "Keep workspaces polished, hygienic, and ready for productive days.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Office%20Cleaning",
  },
  {
    id: "residential",
    title: "Residential Cleaning",
    description:
      "Homes, apartments, and family spaces cleaned with care and reliability.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Residential%20Cleaning",
  },
  {
    id: "deep",
    title: "Deep Cleaning",
    description:
      "Intensive detail cleaning for kitchens, bathrooms, and neglected zones.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Deep%20Cleaning",
  },
  {
    id: "move",
    title: "Move In / Move Out",
    description:
      "Make handovers spotless for landlords, tenants, and property managers.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Move%20In%2FOut",
  },
  {
    id: "commercial",
    title: "Commercial Cleaning",
    description:
      "Shops, churches, schools, and business premises, scheduled or one-off.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    href: "/contact?service=Commercial%20Cleaning",
  },
];

export const whyChooseUs = [
  {
    title: "Quality Products",
    description:
      "Manufactured detergents designed for real Ghanaian homes and workplaces.",
  },
  {
    title: "Professional Team",
    description:
      "Reliable cleaners trained for residential and commercial excellence.",
  },
  {
    title: "Affordable Prices",
    description:
      "Premium results at accessible prices for households and businesses.",
  },
  {
    title: "Fast Delivery",
    description:
      "Quick product fulfilment across Accra with WhatsApp-first ordering.",
  },
] as const;

export const howItWorks = [
  {
    step: 1,
    title: "Browse",
    description: "Explore our premium catalog of cleaners and services.",
  },
  {
    step: 2,
    title: "Add to Cart",
    description: "Select your favorites and choose your quantities.",
  },
  {
    step: 3,
    title: "WhatsApp Pay",
    description: "Checkout instantly via our seamless WhatsApp link.",
  },
  {
    step: 4,
    title: "Receive",
    description: "Fast door-to-door delivery within 24 hours.",
  },
] as const;

export const testimonials = [
  {
    name: "Ama Mensah",
    role: "Homeowner, East Legon",
    quote:
      "Their detergents smell fresh and actually clean well. Booking a deep clean was also seamless on WhatsApp.",
    rating: 5,
  },
  {
    name: "Kwame Boateng",
    role: "Office Manager, Accra",
    quote:
      "Frannys keeps our office looking premium every week. Professional, on time, and trustworthy.",
    rating: 5,
  },
  {
    name: "Efua Addo",
    role: "Property Manager",
    quote:
      "Move-out cleans are thorough. Tenants and landlords both notice the difference.",
    rating: 5,
  },
] as const;

export const orderStatuses = [
  "Pending",
  "Confirmed",
  "Awaiting Payment",
  "Packaging",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type DemoOrderItem = {
  productId: string;
  name: string;
  image: string;
  category: string;
  quantity: number;
};

export const demoOrders: Array<{
  orderNumber: string;
  phone: string;
  status: OrderStatus;
  customer: string;
  total: number;
  items: string;
  lineItems: DemoOrderItem[];
}> = [
  {
    orderNumber: "FTS-1042",
    phone: "0200928400",
    status: "Out for Delivery",
    customer: "Ama Mensah",
    total: 165,
    items: "Multi-Surface x2, Glass Sparkle x1",
    lineItems: [
      {
        productId: "multi-surface",
        name: "Multi-Surface Cleaner",
        image:
          "https://images.unsplash.com/photo-1585421514738-17ce1bc2d45d?auto=format&fit=crop&w=900&q=80",
        category: "Detergents",
        quantity: 2,
      },
      {
        productId: "glass-sparkle",
        name: "Glass Sparkle",
        image:
          "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
        category: "Specialty",
        quantity: 1,
      },
    ],
  },
  {
    orderNumber: "FTS-1038",
    phone: "0244111222",
    status: "Packaging",
    customer: "Kwame Boateng",
    total: 120,
    items: "Laundry Fresh x1, Dish Power x2",
    lineItems: [
      {
        productId: "laundry-fresh",
        name: "Laundry Fresh",
        image:
          "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&q=80",
        category: "Detergents",
        quantity: 1,
      },
      {
        productId: "dish-power",
        name: "Dish Power",
        image:
          "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
        category: "Detergents",
        quantity: 2,
      },
    ],
  },
  {
    orderNumber: "FTS-1031",
    phone: "0277333444",
    status: "Delivered",
    customer: "Efua Addo",
    total: 210,
    items: "Floor Shine x2, Disinfectant x1",
    lineItems: [
      {
        productId: "floor-shine",
        name: "Floor Shine Detergent",
        image:
          "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
        category: "Detergents",
        quantity: 2,
      },
      {
        productId: "disinfectant",
        name: "Home Disinfectant",
        image:
          "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
        category: "Disinfectants",
        quantity: 1,
      },
    ],
  },
];
