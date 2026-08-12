import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { PromoRibbon } from "@/components/promo/PromoRibbon";
import { SiteConfigProvider } from "@/components/providers/SiteConfigProvider";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { ForegroundPattern } from "@/components/ui/ForegroundPattern";
import {
  getDefaultSiteConfig,
} from "@/lib/db/settings";
import { getCachedSiteConfig } from "@/lib/db/cached-public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getCachedSiteConfig().catch(() => getDefaultSiteConfig());

  return (
    <SiteConfigProvider value={site}>
      <ForegroundPattern />
      <div className="relative z-[1] flex min-h-full flex-col">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <Navbar />
        <PromoRibbon promo={site.promoBanner} />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
        <WhatsAppFloat />
      </div>
    </SiteConfigProvider>
  );
}
