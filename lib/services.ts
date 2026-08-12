import { serviceImageForId } from "@/lib/service-images";

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
    image: serviceImageForId(
      "professional",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Professional%20Cleaning",
  },
  {
    id: "office",
    title: "Office Cleaning",
    description:
      "Keep workspaces polished, hygienic, and ready for productive days.",
    image: serviceImageForId(
      "office",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Office%20Cleaning",
  },
  {
    id: "residential",
    title: "Residential Cleaning",
    description:
      "Homes, apartments, and family spaces cleaned with care and reliability.",
    image: serviceImageForId(
      "residential",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Residential%20Cleaning",
  },
  {
    id: "deep",
    title: "Deep Cleaning",
    description:
      "Intensive detail cleaning for kitchens, bathrooms, and neglected zones.",
    image: serviceImageForId(
      "deep",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Deep%20Cleaning",
  },
  {
    id: "move",
    title: "Move In / Move Out",
    description:
      "Make handovers spotless for landlords, tenants, and property managers.",
    image: serviceImageForId(
      "move",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Move%20In%2FOut",
  },
  {
    id: "commercial",
    title: "Commercial Cleaning",
    description:
      "Shops, churches, schools, and business premises, scheduled or one-off.",
    image: serviceImageForId(
      "commercial",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    ),
    href: "/contact?service=Commercial%20Cleaning",
  },
];

/** Build public service cards from CMS items. */
export function resolveCleaningServices(
  items: {
    id: string;
    title: string;
    description: string;
    image?: string;
  }[],
): Service[] {
  const defaults = new Map(cleaningServices.map((service) => [service.id, service]));

  return items
    .filter((item) => item.title.trim())
    .map((item) => {
      const fallback = defaults.get(item.id);
      const title = item.title.trim();
      const mappedLocal = serviceImageForId(item.id);
      const storedImage = item.image?.trim() || "";
      return {
        id: item.id,
        title,
        description:
          item.description.trim() || fallback?.description || "",
        image:
          mappedLocal ||
          storedImage ||
          fallback?.image ||
          cleaningServices[0]!.image,
        href: `/contact?service=${encodeURIComponent(title)}`,
      };
    });
}

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
