"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Images, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import type { MediaLibraryItem } from "@/lib/uploads";

type MediaPickerProps = {
  disabled?: boolean;
  onSelect: (url: string) => void;
};

export function MediaPicker({ disabled, onSelect }: MediaPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  function loadItems() {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/media");
        const data = (await response.json()) as {
          items?: MediaLibraryItem[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error || "Could not load media.");
        }
        setItems(data.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load media.");
      }
    });
  }

  function openPicker() {
    setOpen(true);
    setUploadMessage("");
    loadItems();
  }

  async function onUpload(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length) return;

    setUploading(true);
    setUploadMessage("");
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
          throw new Error(data.error || "Upload failed.");
        }
      }
      setUploadMessage(
        files.length === 1 ? "Uploaded." : `${files.length} files uploaded.`,
      );
      loadItems();
    } catch (err) {
      setUploadMessage(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={openPicker}
      >
        <Images className="h-4 w-4" />
        From library
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary-dark/40 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Media library"
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[12px] border border-border bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <p className="font-bold">Media library</p>
                <p className="text-xs text-muted">
                  Upload new files or pick a saved image.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="sr-only"
                  disabled={uploading || pending}
                  onChange={(e) => {
                    void onUpload(e.target.files);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading || pending}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <Spinner size="sm" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-muted hover:bg-surface-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              </div>
            </div>

            {uploadMessage ? (
              <p
                className={`border-b border-border px-4 py-2 text-xs ${
                  uploadMessage.toLowerCase().includes("fail")
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {uploadMessage}
              </p>
            ) : null}

            <div className="flex-1 overflow-y-auto p-4">
              {pending ? (
                <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
                  <Spinner size="sm" />
                  Loading uploads...
                </p>
              ) : error ? (
                <p className="py-10 text-center text-sm text-danger">{error}</p>
              ) : items.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">
                  No uploads yet. Upload a file above, or use Admin → Media.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((item) => (
                    <li key={item.filename}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item.url);
                          setOpen(false);
                        }}
                        className="group w-full overflow-hidden rounded-[8px] border border-border text-left transition hover:border-primary"
                      >
                        <div className="relative aspect-square bg-surface-muted">
                          <Image
                            src={item.url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="160px"
                            unoptimized
                          />
                        </div>
                        <span className="block truncate px-2 py-1.5 text-[10px] text-muted group-hover:text-primary">
                          {item.filename}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
