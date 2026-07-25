import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { getSiteConfig } from "@/lib/db/settings";
import { SITE } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function siteOrigin() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig().catch(() => null);
  const name = site?.name ?? SITE.name;
  const description = site?.description ?? SITE.description;
  const origin = siteOrigin();

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${name} | Premium Cleaning Products & Services`,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      "cleaning products Ghana",
      "cleaning services Accra",
      name,
      "detergents Ghana",
      "WhatsApp checkout",
    ],
    icons: {
      icon: "/frannystidy.png",
      apple: "/frannystidy.png",
    },
    openGraph: {
      title: `${name} | Cleaning Made Easy`,
      description,
      locale: "en_GH",
      type: "website",
      siteName: name,
      url: origin,
      images: [
        {
          url: "/frannystidy.png",
          alt: name,
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${name} | Cleaning Made Easy`,
      description,
      images: ["/frannystidy.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
