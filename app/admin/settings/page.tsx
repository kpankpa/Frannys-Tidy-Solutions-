import { getSiteConfig } from "@/lib/db/settings";
import { saveBusinessSettingsAction } from "@/server/admin";
import { AdminImageField } from "@/components/admin/AdminImageFieldDynamic";
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
          Contact details, logo, delivery fee, social links, and printable
          receipt branding used across the site and admin.
        </p>
      </div>

      {params.error === "InvalidSocialUrl" ? (
        <p className="max-w-2xl rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
          Social links must be blank or valid https URLs.
        </p>
      ) : null}
      {params.error === "InvalidMapsUrl" ? (
        <p className="max-w-2xl rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
          Google Maps URL must be blank or a valid https link.
        </p>
      ) : null}
      {params.error === "InvalidLogoUrl" ? (
        <p className="max-w-2xl rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
          Logo must be a site path (for example /frannystidy.png or
          /uploads/...), a https image URL, or blank for the default logo.
        </p>
      ) : null}

      <form
        action={saveBusinessSettingsAction}
        className="max-w-2xl space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Business name</span>
            <input name="businessName" defaultValue={site.name} className={field} required />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Short name</span>
            <input name="shortName" defaultValue={site.shortName} className={field} />
          </label>
        </div>
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

        <div className="rounded-[8px] border border-border/80 bg-surface-muted/40 p-4">
          <AdminImageField
            name="logoUrl"
            label="Logo"
            defaultValue={site.logoUrl}
            hint="Used on the website, admin hub, and printable receipts. Upload, pick from library, or paste a URL."
            placeholder="/frannystidy.png"
          />
        </div>

        <label className="block text-sm">
          <span className="font-medium">Address</span>
          <input name="address" defaultValue={site.address} className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Location blurb (maps / About captions)</span>
          <input
            name="locationBlurb"
            defaultValue={site.locationBlurb}
            placeholder="East Legon Hills, Accra"
            className={field}
          />
        </label>
        <AdminImageField
          name="heroHomeImage"
          label="Home hero image"
          defaultValue={site.heroHomeImage}
          hint="Large background photo on the home page."
          placeholder="/hero-home.png"
        />
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
          <span className="font-medium">Typical delivery fee (GH₵)</span>
          <p className="mt-1 text-xs text-muted">
            Shown as a guide on cart and checkout only. Not added to the order.
            After you agree a fee on WhatsApp, set it on that order in Admin.
          </p>
          <input
            name="deliveryFeeCedis"
            type="number"
            step="0.01"
            min="0"
            defaultValue={site.deliveryFee}
            className={`${field} mt-2`}
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
        <label className="block text-sm">
          <span className="font-medium">Google Maps / Business Profile URL</span>
          <input
            name="googleMapsUrl"
            defaultValue={site.googleMapsUrl}
            placeholder="https://maps.google.com/... or your Business Profile link"
            className={field}
          />
        </label>

        <div className="space-y-4 rounded-[8px] border border-border/80 bg-surface-muted/40 p-4">
          <div>
            <p className="text-sm font-bold">Printable receipt</p>
            <p className="mt-1 text-xs text-muted">
              Shown on Admin → Orders → Print receipt. Business name, logo,
              address, phone, email, and hours come from the fields above.
            </p>
          </div>
          <label className="block text-sm">
            <span className="font-medium">Receipt title</span>
            <input
              name="receiptTitle"
              defaultValue={site.receiptTitle}
              placeholder="Receipt"
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Footer message</span>
            <textarea
              name="receiptFooter"
              rows={3}
              defaultValue={site.receiptFooter}
              className={field}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Payment / extra note</span>
            <textarea
              name="receiptNote"
              rows={3}
              defaultValue={site.receiptNote}
              placeholder="MoMo number, bank details, or delivery terms"
              className={field}
            />
          </label>
        </div>

        <p className="text-xs text-muted">
          Leave social fields blank to hide those icons. Claim your Google
          Business Profile, add real photos, then paste the public Maps link
          here for Contact and About.
        </p>
        <PendingSubmitButton>Save settings</PendingSubmitButton>
      </form>
    </div>
  );
}
