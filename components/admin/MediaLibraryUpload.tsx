"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";

export function MediaLibraryUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onUpload(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length) return;

    setUploading(true);
    setMessage("");
    setError("");
    const uploaded: string[] = [];
    const failures: string[] = [];

    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/uploads", {
          method: "POST",
          body,
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          failures.push(data.error || file.name);
          continue;
        }
        uploaded.push(data.url);
      }

      if (uploaded.length) {
        setMessage(
          uploaded.length === 1
            ? "Image uploaded to the library."
            : `${uploaded.length} images uploaded.`,
        );
        router.refresh();
      }
      if (failures.length) {
        setError(failures[0] || "Some uploads failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-[10px] border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Upload images</p>
          <p className="mt-0.5 text-xs text-muted">
            JPEG, PNG, WebP, or GIF up to 5 MB. On Vercel/shared hosting, configure
            Neon Object Storage (see Settings / docs) or paste https image URLs on
            products.
          </p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Uploading...
              </>
            ) : (
              "Upload files"
            )}
          </Button>
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
