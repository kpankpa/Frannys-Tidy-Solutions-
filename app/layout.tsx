import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart";
import { getCachedSiteConfig } from "@/lib/db/cached-public";
import { getDefaultSiteConfig } from "@/lib/db/settings";
import { SITE_BRAND_ICON } from "@/lib/constants";
import "./globals.css";

function siteOrigin() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCachedSiteConfig().catch(() => getDefaultSiteConfig());
  const name = site.name;
  const description = site.description;
  const origin = siteOrigin();

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${name} | Premium Cleaning Products & Services`,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      "Frannys Tidy Solutions",
      "cleaning company Accra",
      "cleaning services Accra",
      "cleaning products Ghana",
      "cleaning detergents Ghana",
      "home cleaning Accra",
      "office cleaning Accra",
      "professional cleaning Accra",
      "East Legon Hills",
      "buy cleaning products Ghana",
      name,
      "WhatsApp checkout",
    ],
    icons: {
      icon: [
        { url: SITE_BRAND_ICON, type: "image/jpeg" },
        { url: SITE_BRAND_ICON, sizes: "512x512", type: "image/jpeg" },
      ],
      apple: [{ url: SITE_BRAND_ICON, type: "image/jpeg" }],
      shortcut: SITE_BRAND_ICON,
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
          url: SITE_BRAND_ICON,
          alt: `${name} logo`,
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${name} | Cleaning Made Easy`,
      description,
      images: [SITE_BRAND_ICON],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
