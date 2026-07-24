import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { SITE } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Premium Cleaning Products & Services`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "cleaning products Ghana",
    "cleaning services Accra",
    "Frannys Tidy Solutions",
    "detergents Ghana",
    "WhatsApp checkout",
  ],
  openGraph: {
    title: `${SITE.name} | Cleaning Made Easy`,
    description: SITE.description,
    locale: "en_GH",
    type: "website",
    siteName: SITE.name,
  },
};

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
