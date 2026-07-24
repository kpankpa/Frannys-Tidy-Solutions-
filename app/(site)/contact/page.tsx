"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { bookingMessage, buildWhatsAppUrl, SITE, SOCIAL } from "@/lib/constants";

const field =
  "mt-1.5 w-full rounded-[16px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

function ContactInner() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceType: params.get("service") ?? "General Enquiry",
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
    <div className="container-page py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        Contact Us
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Reach the Frannys team by phone, WhatsApp, or email, every day of the
        week.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="rounded-[20px] border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-lg font-bold">Send a Message</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <span className="text-sm font-medium">Subject / Service</span>
              <input
                className={field}
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value })
                }
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Location</span>
              <input
                className={field}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Message</span>
              <textarea
                required
                rows={4}
                className={field}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg">
            Send via WhatsApp
          </Button>
        </form>

        <div className="space-y-4">
          {[
            { icon: MapPin, label: "Address", value: SITE.address },
            { icon: Phone, label: "Phone", value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
            { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: Clock, label: "Working Hours", value: SITE.hours },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 rounded-[20px] border border-border bg-surface p-5 shadow-sm"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-secondary/15 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                {"href" in item && item.href ? (
                  <a href={item.href} className="mt-1 block text-sm text-muted hover:text-primary">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-muted">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          <Button
            href={buildWhatsAppUrl(`Hello ${SITE.name}!`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="w-full"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </Button>

          <div className="overflow-hidden rounded-[20px] border border-border">
            <iframe
              title="Map"
              src="https://maps.google.com/maps?q=East%20Legon%20Hills%2C%20Accra%2C%20Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-56 w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="flex gap-3 text-sm text-muted">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Instagram
            </a>
            <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading...</div>}>
      <ContactInner />
    </Suspense>
  );
}
