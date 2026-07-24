"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl, SITE } from "@/lib/constants";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppUrl(
        `Hello ${SITE.name}! I'd like to learn more about your products and services.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
