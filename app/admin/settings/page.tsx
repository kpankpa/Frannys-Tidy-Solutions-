import { getSiteConfig } from "@/lib/db/settings";
import { saveBusinessSettingsAction } from "@/server/admin";
import { PendingSubmitButton } from "@/components/ui/PendingSubmitButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

type PageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  await ensureAdminPage();
  const site = await getSiteConfig();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business settings</h1>
        <p className="mt-1 text-sm text-muted">
          Contact details, delivery fee, and social links used across the site and checkout.
        </p>
      </div>

      {params.error === "InvalidSocialUrl" ? (
        <p className="max-w-2xl rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
          Social links must be blank or valid https URLs.
        </p>
      ) : null}

      <form
        action={saveBusinessSettingsAction}
        className="max-w-2xl space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
      >
        <label className="block text-sm">
          <span className="font-medium">Business name</span>
          <input name="businessName" defaultValue={site.name} className={field} required />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Tagline</span>
          <input name="tagline" defaultValue={site.tagline} className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Short description</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={site.description}
            className={field}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Address</span>
          <input name="address" defaultValue={site.address} className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Phone (digits)</span>
            <input name="phone" defaultValue={site.phone} className={field} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Phone display</span>
            <input name="phoneDisplay" defaultValue={site.phoneDisplay} className={field} />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">WhatsApp number</span>
            <input name="whatsapp" defaultValue={site.whatsapp} className={field} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">WhatsApp E.164</span>
            <input
              name="whatsappE164"
              defaultValue={site.whatsappE164}
              placeholder="233200928400"
              className={field}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input name="email" type="email" defaultValue={site.email} className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Hours (full)</span>
            <input name="hours" defaultValue={site.hours} className={field} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Hours (short)</span>
            <input name="hoursShort" defaultValue={site.hoursShort} className={field} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium">Delivery fee (GH₵)</span>
          <input
            name="deliveryFeeCedis"
            type="number"
            step="0.01"
            min="0"
            defaultValue={site.deliveryFee}
            className={field}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Instagram URL</span>
            <input name="instagramUrl" defaultValue={site.instagramUrl} className={field} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">TikTok URL</span>
            <input name="tiktokUrl" defaultValue={site.tiktokUrl} className={field} />
          </label>
        </div>
        <p className="text-xs text-muted">
          Leave social fields blank to hide those icons on the site.
        </p>
        <PendingSubmitButton>Save settings</PendingSubmitButton>
      </form>
    </div>
  );
}
