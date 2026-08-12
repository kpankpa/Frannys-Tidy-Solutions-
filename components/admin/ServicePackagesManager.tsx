"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { MAX_SERVICE_PACKAGES } from "@/lib/cleaning-services-admin";
import { saveServicePackagesAction } from "@/server/services-admin";
import type { ServicePackageItem } from "@/lib/site-config";

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

type PackageRow = {
  name: string;
  description: string;
  price: string;
};

function rowsFromPackages(packages: ServicePackageItem[]): PackageRow[] {
  return packages.map((item) => ({
    name: item.name,
    description: item.description,
    price: String(item.priceFromCedis),
  }));
}

function emptyRow(): PackageRow {
  return { name: "", description: "", price: "" };
}

type ServicePackagesManagerProps = {
  packages: ServicePackageItem[];
};

export function ServicePackagesManager({
  packages,
}: ServicePackagesManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<PackageRow[]>(() => rowsFromPackages(packages));

  function updateRow(index: number, patch: Partial<PackageRow>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    if (rows.length >= MAX_SERVICE_PACKAGES) return;
    setRows((current) => [...current, emptyRow()]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData();
    rows.forEach((row, i) => {
      formData.set(`packageName${i}`, row.name);
      formData.set(`packageDesc${i}`, row.description);
      formData.set(`packagePrice${i}`, row.price);
    });

    startTransition(async () => {
      const result = await saveServicePackagesAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Packages saved.");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[10px] border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">Service packages</h2>
          <p className="mt-1 text-sm text-muted">
            Optional fixed-price packages shown on the Services page as
            &quot;from GH₵&quot; cards. Add up to {MAX_SERVICE_PACKAGES}{" "}
            packages.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={rows.length >= MAX_SERVICE_PACKAGES}
          onClick={addRow}
        >
          <Plus className="h-4 w-4" />
          Add package
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No packages yet. Click &quot;Add package&quot; to create one.
          </p>
        ) : null}

        {rows.map((item, i) => (
          <div
            key={`package-row-${i}`}
            className="space-y-3 rounded-[8px] border border-border/80 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Package {i + 1}
              </p>
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
            <label className="block text-sm">
              <span className="text-muted">Name</span>
              <input
                value={item.name}
                onChange={(e) => updateRow(i, { name: e.target.value })}
                className={fieldClass}
                placeholder="e.g. 2-bedroom deep clean"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Description</span>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">From price (GH₵)</span>
              <input
                type="number"
                min={0}
                step="1"
                value={item.price}
                onChange={(e) => updateRow(i, { price: e.target.value })}
                className={fieldClass}
              />
            </label>
          </div>
        ))}
      </div>

      {rows.length >= MAX_SERVICE_PACKAGES ? (
        <p className="mt-4 text-xs text-muted">
          Maximum of {MAX_SERVICE_PACKAGES} packages reached.
        </p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-success">{message}</p> : null}

      <Button type="submit" disabled={pending} className="mt-5">
        {pending ? "Saving..." : "Save packages"}
      </Button>
    </form>
  );
}
