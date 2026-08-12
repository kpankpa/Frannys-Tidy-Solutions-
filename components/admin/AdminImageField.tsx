"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { explainInvalidImageUrl, sanitizeLogoUrl } from "@/lib/validation";

const inputClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

type AdminImageFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  placeholder?: string;
  onChange?: (url: string) => void;
};

export function AdminImageField({
  name,
  label,
  defaultValue = "",
  hint,
  placeholder = "https://... or /uploads/...",
  onChange,
}: AdminImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  async function onUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setMessage(data.error || "Upload failed.");
        return;
      }
      setUrl(data.url);
      setMessage("Image uploaded.");
      onChange?.(data.url);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onUrlChange(next: string) {
    setUrl(next);
    setMessage("");
    onChange?.(next);
  }

  const previewOk = url.trim() && sanitizeLogoUrl(url.trim()) !== null;
  const messageIsError =
    message.toLowerCase().includes("fail") ||
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("cannot") ||
    message.toLowerCase().includes("configure");

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}

      <div className="flex flex-wrap items-start gap-3">
        <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-border bg-surface-muted">
          {previewOk ? (
            <Image
              src={url.trim()}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
              unoptimized={shouldUnoptimizeImage(url.trim())}
            />
          ) : (
            <Upload className="h-5 w-5 text-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            name={name}
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                void onUpload(e.target.files);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Spinner size="sm" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
            <MediaPicker
              disabled={uploading}
              onSelect={(picked) => {
                setUrl(picked);
                setMessage("Image selected from library.");
                onChange?.(picked);
              }}
            />
            {url ? (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setMessage("Image cleared.");
                  onChange?.("");
                }}
                className="text-xs font-semibold text-muted hover:text-danger"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {message ? (
        <p
          className={`text-xs ${messageIsError ? "text-danger" : "text-success"}`}
        >
          {message}
        </p>
      ) : null}

      {url.trim() && !previewOk ? (
        <p className="text-xs text-danger">{explainInvalidImageUrl(url)}</p>
      ) : null}
    </div>
  );
}
