"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Upload,
} from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { uploadImageFiles } from "@/lib/admin-upload-client";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import {
  explainInvalidImageUrl,
  sanitizeImageUrl,
} from "@/lib/validation";

export type GalleryImageItem = {
  src: string;
  alt: string;
};

type AdminImageGalleryProps = {
  name: string;
  label: string;
  hint?: string;
  defaultItems?: GalleryImageItem[];
  maxImages?: number;
  defaultAlt?: string;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function AdminImageGallery({
  name,
  label,
  hint,
  defaultItems = [],
  maxImages = 24,
  defaultAlt = "Frannys team photo",
}: AdminImageGalleryProps) {
  const [items, setItems] = useState<GalleryImageItem[]>(defaultItems);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function addItems(urls: string[]) {
    setItems((prev) => {
      const next = [...prev];
      for (const url of urls) {
        if (next.length >= maxImages) break;
        if (next.some((item) => item.src === url)) continue;
        next.push({ src: url, alt: defaultAlt });
      }
      return next;
    });
  }

  async function onUpload(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length) return;

    const room = maxImages - items.length;
    if (room <= 0) {
      setMessage(`You can add up to ${maxImages} photos.`);
      return;
    }

    setMessage("");
    setUploading(true);

    try {
      const { uploaded, failures } = await uploadImageFiles(
        files.slice(0, room),
      );

      if (uploaded.length) {
        addItems(uploaded);
      }

      if (failures.length && uploaded.length) {
        setMessage(
          `Uploaded ${uploaded.length}. ${failures.length} file(s) failed.`,
        );
      } else if (failures.length) {
        setMessage(failures[0] || "Upload failed.");
      } else {
        setMessage(
          uploaded.length === 1
            ? "Photo uploaded."
            : `${uploaded.length} photos uploaded.`,
        );
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function addPastedUrl() {
    const safe = sanitizeImageUrl(urlDraft);
    if (!safe) {
      setMessage(explainInvalidImageUrl(urlDraft));
      return;
    }
    if (items.some((item) => item.src === safe)) {
      setMessage("That photo is already in the gallery.");
      return;
    }
    if (items.length >= maxImages) {
      setMessage(`You can add up to ${maxImages} photos.`);
      return;
    }
    addItems([safe]);
    setUrlDraft("");
    setMessage("Photo URL added.");
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      return next;
    });
  }

  function updateAlt(index: number, alt: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, alt } : item)),
    );
  }

  return (
    <div className="space-y-3 rounded-[8px] border border-border bg-surface-muted/40 p-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
        <p className="mt-1 text-xs text-muted">
          {items.length}/{maxImages} photos. Select multiple files at once from
          your device.
        </p>
      </div>

      <label className="block text-sm">
        <span className="text-muted">Upload from device (multiple OK)</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={uploading}
          onChange={(e) => {
            void onUpload(e.target.files);
            e.target.value = "";
          }}
          className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="text-sm font-medium">Paste image URL</span>
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://... or /flyers/... or /uploads/..."
            className={fieldClass}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPastedUrl();
              }
            }}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || !urlDraft.trim()}
          onClick={addPastedUrl}
          className="sm:mb-0.5"
        >
          Add URL
        </Button>
        <div className="sm:mb-0.5">
          <MediaPicker
            disabled={uploading || items.length >= maxImages}
            onSelect={(url) => {
              if (items.some((item) => item.src === url)) {
                setMessage("That photo is already in the gallery.");
                return;
              }
              if (items.length >= maxImages) {
                setMessage(`You can add up to ${maxImages} photos.`);
                return;
              }
              addItems([url]);
              setMessage("Photo added from library.");
            }}
          />
        </div>
      </div>

      {uploading ? (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Spinner size="sm" />
          Uploading...
        </p>
      ) : message ? (
        <p
          className={`text-xs ${
            message.toLowerCase().includes("fail") ||
            message.toLowerCase().includes("invalid")
              ? "text-danger"
              : "text-success"
          }`}
        >
          {message}
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={`${item.src}-${index}`}
              className="overflow-hidden rounded-[8px] border border-border bg-surface"
            >
              <div className="relative aspect-[4/3] bg-surface-muted">
                <Image
                  src={item.src}
                  alt={item.alt || "Gallery photo"}
                  fill
                  className="object-cover"
                  sizes="280px"
                  unoptimized={shouldUnoptimizeImage(item.src)}
                />
              </div>
              <div className="space-y-2 border-t border-border p-2">
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Alt text for accessibility"
                  className="w-full rounded-[6px] border border-border px-2 py-1.5 text-xs outline-none focus:border-primary"
                />
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveAt(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1.5 text-muted hover:bg-surface-muted disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAt(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded p-1.5 text-muted hover:bg-surface-muted disabled:opacity-30"
                    aria-label="Move later"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-border bg-surface px-4 py-8 text-center">
          <Upload className="h-6 w-6 text-muted" />
          <p className="text-sm text-muted">
            No photos yet. Upload multiple files, paste URLs, or pick from the
            media library.
          </p>
        </div>
      )}
    </div>
  );
}
