"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { bookingMessage, buildWhatsAppUrl, SITE } from "@/lib/constants";
import { cleaningServices } from "@/lib/services";

const field =
  "mt-1.5 w-full rounded-[16px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function BookingForm() {
  const searchParams = useSearchParams();
  const preset = searchParams.get("service") ?? cleaningServices[0].title;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceType: preset,
    location: "",
    preferredDate: "",
    message: "",
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.open(
      buildWhatsAppUrl(bookingMessage(form)),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[20px] border border-border bg-white p-6 shadow-sm sm:p-8"
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
            {cleaningServices.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
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
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full">
        Request Cleaning
        <Send className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Available {SITE.hoursShort}. Opens WhatsApp with your request.
      </p>
    </form>
  );
}
