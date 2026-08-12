import Link from "next/link";
import { PromoBannerForm } from "@/components/admin/PromoBannerForm";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { getSiteConfig } from "@/lib/db/settings";
import { isPromoLive, showPromoRibbon, showPromoSpotlight } from "@/lib/promotions";

export default async function AdminPromotionsPage() {
  await ensureAdminPage();
  const site = await getSiteConfig();
  const promo = site.promoBanner;
  const live = isPromoLive(promo);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Promotions</h1>
        <p className="mt-1 text-sm text-muted">
          Seasonal flyers and posters for product sales. Upload an image, choose
          where it appears, and set optional start and end dates.
        </p>
      </div>

      <div className="rounded-[10px] border border-border bg-surface-muted/50 px-4 py-3 text-sm">
        <p>
          Status:{" "}
          <span className={live ? "font-semibold text-success" : "text-muted"}>
            {live ? "Live on the website" : "Hidden or scheduled"}
          </span>
        </p>
        {live ? (
          <ul className="mt-2 list-inside list-disc text-muted">
            {showPromoSpotlight(promo) ? <li>Home spotlight active</li> : null}
            {showPromoRibbon(promo) ? <li>Site ribbon active</li> : null}
          </ul>
        ) : null}
        <p className="mt-2">
          <Link href="/" target="_blank" className="font-medium text-primary hover:underline">
            Preview homepage
          </Link>
        </p>
      </div>

      <PromoBannerForm promo={promo} />
    </div>
  );
}
