"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { PromoImageFraming } from "@/components/admin/PromoImageFraming";
import { Button } from "@/components/ui/Button";
import type { PromoBanner } from "@/lib/promotions";
import { savePromoBannerAction } from "@/server/promotions-admin";
import { sanitizeLogoUrl } from "@/lib/validation";

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

type PromoBannerFormProps = {
  promo: PromoBanner;
};

export function PromoBannerForm({ promo }: PromoBannerFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(promo.image);
  const [focusX, setFocusX] = useState(promo.imageFocusX);
  const [focusY, setFocusY] = useState(promo.imageFocusY);
  const [zoom, setZoom] = useState(promo.imageZoom);
  const [fit, setFit] = useState(promo.imageFit);

  function onImageChange(next: string) {
    setImageUrl(next);
    if (next !== promo.image) {
      setFocusX(50);
      setFocusY(50);
      setZoom(100);
      setFit("cover");
    }
  }

  function onSubmit(formData: FormData) {
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await savePromoBannerAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Promotion saved.");
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
    >
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="enabled"
          value="on"
          defaultChecked={promo.enabled}
          className="h-4 w-4 rounded border-border"
        />
        <span className="font-medium">Show this promotion on the website</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Campaign title (optional)</span>
        <input
          name="title"
          defaultValue={promo.title}
          placeholder="e.g. Easter cleaning sale"
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-muted">
          Small label above the home spotlight. Also used on the site ribbon.
        </span>
      </label>

      <AdminImageField
        name="image"
        label="Flyer or poster image"
        defaultValue={promo.image}
        hint="Upload your seasonal flyer or poster from the media library."
        onChange={onImageChange}
      />

      {imageUrl.trim() && sanitizeLogoUrl(imageUrl.trim()) ? (
        <PromoImageFraming
          imageUrl={imageUrl.trim()}
          focusX={focusX}
          focusY={focusY}
          zoom={zoom}
          fit={fit}
          onChange={({ focusX: x, focusY: y, zoom: z, fit: f }) => {
            setFocusX(x);
            setFocusY(y);
            setZoom(z);
            setFit(f);
          }}
        />
      ) : null}

      <label className="block">
        <span className="text-sm font-medium">Image description (accessibility)</span>
        <input
          name="alt"
          defaultValue={promo.alt}
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Link when clicked (optional)</span>
        <input
          name="link"
          defaultValue={promo.link}
          placeholder="/shop or https://..."
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Where to show</span>
        <select
          name="placement"
          defaultValue={promo.placement}
          className={fieldClass}
        >
          <option value="home">Home spotlight only (large banner after Why Choose)</option>
          <option value="everywhere">Site ribbon only (all pages, dismissible)</option>
          <option value="both">Both home spotlight and site ribbon</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Show from (optional)</span>
          <input
            type="date"
            name="showFrom"
            defaultValue={promo.showFrom}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Show until (optional)</span>
          <input
            type="date"
            name="showUntil"
            defaultValue={promo.showUntil}
            className={fieldClass}
          />
        </label>
      </div>

      <p className="rounded-[8px] bg-surface-muted px-3 py-2 text-sm text-muted">
        <strong className="text-foreground">Tip:</strong> Use{" "}
        <em>Home spotlight</em> for big seasonal posters. Use{" "}
        <em>Site ribbon</em> when you want the offer visible on Shop, Services,
        and every page. Set dates to auto-hide after the season ends.
      </p>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save promotion"}
      </Button>
    </form>
  );
}
