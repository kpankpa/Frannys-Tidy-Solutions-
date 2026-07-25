"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  getDefaultSiteConfig,
  type SiteConfig,
} from "@/lib/site-config";
import {
  bookingMessage as buildBookingMessage,
  buildWhatsAppUrl as buildWaUrl,
  productOrderMessage as buildProductOrderMessage,
} from "@/lib/constants";

export type PublicSiteConfig = SiteConfig;

const SiteConfigContext = createContext<PublicSiteConfig | null>(null);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: PublicSiteConfig;
  children: ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): PublicSiteConfig {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    // Fallback for rare cases outside provider (should not happen on public site).
    return getDefaultSiteConfig();
  }
  return ctx;
}

export function useWhatsAppHelpers() {
  const site = useSiteConfig();

  const buildWhatsAppUrl = useCallback(
    (message: string) => buildWaUrl(message, site.whatsappE164),
    [site.whatsappE164],
  );

  const productOrderMessage = useCallback(
    (productName: string, qty = 1) =>
      buildProductOrderMessage(productName, qty, site.name),
    [site.name],
  );

  const bookingMessage = useCallback(
    (data: Parameters<typeof buildBookingMessage>[0]) =>
      buildBookingMessage(data, site.name),
    [site.name],
  );

  return useMemo(
    () => ({ buildWhatsAppUrl, productOrderMessage, bookingMessage, site }),
    [buildWhatsAppUrl, productOrderMessage, bookingMessage, site],
  );
}
