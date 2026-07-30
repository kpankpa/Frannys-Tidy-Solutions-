"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import type { MediaLibraryItem } from "@/lib/uploads";
import { deleteMediaAction } from "@/server/media";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function MediaLibraryGrid({ items }: { items: MediaLibraryItem[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage(`Copied ${url}`);
      setError("");
    } catch {
      setError("Could not copy. Select the URL manually.");
    }
  }

  return (
    <div className="space-y-4">
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {items.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-border bg-surface px-4 py-16 text-center text-sm text-muted">
          No uploaded files yet. Upload images from a product form, then reuse
          them here.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.filename}
              className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-surface-muted">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="320px"
                  unoptimized
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate text-sm font-semibold">{item.filename}</p>
                <p className="text-xs text-muted">
                  {formatBytes(item.sizeBytes)} · {formatWhen(item.modifiedAt)}
                </p>
                <p className="text-xs text-muted">
                  {item.usedByProducts > 0
                    ? `Used on ${item.usedByProducts} product image${item.usedByProducts === 1 ? "" : "s"}`
                    : "Not used on any product"}
                </p>
                <p className="truncate rounded bg-surface-muted px-2 py-1 font-mono text-[11px] text-muted">
                  {item.url}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => void copyUrl(item.url)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Copy URL
                  </button>
                  {item.usedByProducts > 0 ? (
                    <span className="text-xs text-muted">In use</span>
                  ) : (
                    <ConfirmDeleteButton
                      action={async (formData) => {
                        const result = await deleteMediaAction(formData);
                        if (!result.ok) {
                          setError(result.error);
                          return;
                        }
                        setMessage("File deleted.");
                        startTransition(() => router.refresh());
                      }}
                      hiddenFields={{ filename: item.filename }}
                      confirmMessage={`Delete ${item.filename}?`}
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
