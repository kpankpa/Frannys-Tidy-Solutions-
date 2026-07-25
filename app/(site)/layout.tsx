import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { SiteConfigProvider } from "@/components/providers/SiteConfigProvider";
import {
  getDefaultSiteConfig,
  getSiteConfig,
} from "@/lib/db/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig().catch(() => getDefaultSiteConfig());

  return (
    <SiteConfigProvider value={site}>
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer site={site} />
      <WhatsAppFloat />
      <MobileBottomNav />
    </SiteConfigProvider>
  );
}
