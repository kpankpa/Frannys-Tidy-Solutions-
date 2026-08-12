"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminImageField } from "@/components/admin/AdminImageFieldDynamic";
import { Button } from "@/components/ui/Button";
import { saveCleaningServiceAction } from "@/server/services-admin";

type ServiceFormValues = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type ServiceFormProps = {
  service?: ServiceFormValues;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(formData: FormData) {
    setError("");
    if (service?.id) {
      formData.set("existingId", service.id);
    }
    startTransition(async () => {
      const result = await saveCleaningServiceAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/services");
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
    >
      <label className="block">
        <span className="text-sm font-medium">Service name</span>
        <input
          name="title"
          required
          defaultValue={service?.title}
          placeholder="e.g. Office Cleaning"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">URL id</span>
        <input
          name="id"
          defaultValue={service?.id}
          placeholder="auto-from-name-if-empty"
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-muted">
          Used internally and in booking links. Lowercase letters, numbers, and
          dashes only.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Short description</span>
        <textarea
          name="description"
          rows={3}
          required
          defaultValue={service?.description}
          className={fieldClass}
        />
      </label>

      <AdminImageField
        name="image"
        label="Card image"
        defaultValue={service?.image}
        hint="Upload or pick from the media library. Shown on Home and Services."
      />

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : service ? "Save service" : "Add service"}
        </Button>
        <Button href="/admin/services" variant="outline">
          Cancel
        </Button>
        {service ? (
          <Link
            href="/services"
            target="_blank"
            className="inline-flex h-10 items-center text-sm font-semibold text-primary hover:underline"
          >
            View services page
          </Link>
        ) : null}
      </div>
    </form>
  );
}
