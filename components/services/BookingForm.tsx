"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { useWhatsAppHelpers } from "@/components/providers/SiteConfigProvider";
import { placeBookingAction } from "@/server/bookings";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

const OTHER_SERVICE_OPTION = "Others";

export function BookingForm() {
  const searchParams = useSearchParams();
  const { buildWhatsAppUrl, site } = useWhatsAppHelpers();
  const serviceOptions = site.serviceItems;
  const serviceParam = searchParams.get("service");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceType: serviceParam ?? serviceOptions[0]?.title ?? "Professional Cleaning",
    location: "",
    preferredDate: "",
    message: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!serviceParam) return;
    // Sync when "Select Service" updates the query string without remounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync URL → form
    setForm((prev) =>
      prev.serviceType === serviceParam
        ? prev
        : { ...prev, serviceType: serviceParam },
    );
  }, [serviceParam]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await placeBookingAction({
      ...form,
      source: "booking",
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    window.open(
      buildWhatsAppUrl(result.whatsappMessage),
      "_blank",
      "noopener,noreferrer",
    );
    setSaved(true);
    setForm({
      name: "",
      phone: "",
      serviceType: serviceParam ?? serviceOptions[0]?.title ?? "Professional Cleaning",
      location: "",
      preferredDate: "",
      message: "",
      website: "",
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[10px] border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            required
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Phone</span>
          <input
            required
            type="tel"
            className={field}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Service Type</span>
          <select
            className={field}
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          >
            {serviceOptions.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value={OTHER_SERVICE_OPTION}>{OTHER_SERVICE_OPTION}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Location</span>
          <input
            required
            className={field}
            placeholder="East Legon Hills"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Preferred Date</span>
          <input
            type="date"
            className={field}
            value={form.preferredDate}
            onChange={(e) =>
              setForm({ ...form, preferredDate: e.target.value })
            }
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Message</span>
          <textarea
            rows={4}
            className={field}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        <label
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          aria-hidden
        >
          <span>Website</span>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {saved ? (
        <p className="mt-4 text-sm text-success">
          Request saved. WhatsApp should open so you can confirm with Frannys.
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Saving..." : "Request Cleaning"}
        {submitting ? (
          <Spinner size="sm" className="border-white/30 border-t-white" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Available {site.hoursShort}. We save your request, then open WhatsApp.
      </p>
    </form>
  );
}
