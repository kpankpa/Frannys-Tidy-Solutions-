"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { sendContactEmailAction } from "@/server/contact";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ContactForm() {
  const params = useSearchParams();
  const site = useSiteConfig();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: params.get("service") ?? "General Enquiry",
    location: "",
    message: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<"smtp" | "mailto" | "">("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved("");
    setSubmitting(true);

    const result = await sendContactEmailAction({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      location: form.location,
      message: form.message,
      website: form.website,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.mode === "mailto") {
      window.location.href = result.mailtoUrl;
      setSaved("mailto");
    } else {
      setSaved("smtp");
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: params.get("service") ?? "General Enquiry",
      location: "",
      message: "",
      website: "",
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border/80 bg-surface p-6 soft-shadow sm:p-8"
    >
      <h2 className="text-lg font-bold text-foreground">Send an email</h2>
      <p className="mt-1 text-sm text-muted">
        Your message goes to {site.email}. We reply by email.
      </p>
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
          <span className="text-sm font-medium">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            className={field}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Phone (optional)</span>
          <input
            type="tel"
            className={field}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Subject</span>
          <input
            required
            className={field}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Location (optional)</span>
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
      {saved === "smtp" ? (
        <p className="mt-4 text-sm text-success">
          Email sent. We will reply to your inbox soon.
        </p>
      ) : null}
      {saved === "mailto" ? (
        <p className="mt-4 text-sm text-success">
          Your email app should open with the message ready to send to{" "}
          {site.email}.
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full" size="lg" disabled={submitting}>
        {submitting ? (
          <Spinner size="sm" className="border-white/30 border-t-white" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        {submitting ? "Sending..." : "Send Email"}
      </Button>
    </form>
  );
}
