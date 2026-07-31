"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Spinner } from "@/components/ui/PageSpinner";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { LOW_STOCK_THRESHOLD } from "@/lib/products";
import {
  explainInvalidImageUrl,
  sanitizeImageUrl,
} from "@/lib/validation";
import { saveProductAction } from "@/server/products";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFormValues = {
  dbId?: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  priceCedis: number;
  categoryName: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  badge: string;
  badgeExpiresAt?: string;
  imageAlt: string;
  imageUrls: string[];
};

type ProductFormProps = {
  categories: CategoryOption[];
  product?: ProductFormValues;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

const MAX_IMAGES = 8;

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.imageUrls ?? [],
  );
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const defaultCategoryId =
    categories.find((c) => c.name === product?.categoryName)?.id ??
    categories[0]?.id ??
    "";

  function addImageUrl(url: string, prepend = true) {
    setImageUrls((prev) => {
      if (prev.includes(url)) return prev;
      const next = prepend ? [url, ...prev] : [...prev, url];
      return next.slice(0, MAX_IMAGES);
    });
  }

  async function onUpload(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length) return;

    const room = MAX_IMAGES - imageUrls.length;
    if (room <= 0) {
      setUploadMessage(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploadMessage("");
    setUploading(true);
    const toUpload = files.slice(0, room);
    const uploaded: string[] = [];
    const failures: string[] = [];

    try {
      for (const file of toUpload) {
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
        setImageUrls((prev) => [...uploaded, ...prev].slice(0, MAX_IMAGES));
      }

      if (failures.length && uploaded.length) {
        setUploadMessage(
          `Uploaded ${uploaded.length}. ${failures.length} file(s) failed.`,
        );
      } else if (failures.length) {
        setUploadMessage(failures[0] || "Upload failed.");
      } else {
        setUploadMessage(
          uploaded.length === 1
            ? "Image uploaded. It is first in the gallery."
            : `${uploaded.length} images uploaded.`,
        );
      }
    } catch (err) {
      setUploadMessage(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function addPastedUrl() {
    const safe = sanitizeImageUrl(urlDraft);
    if (!safe) {
      setUploadMessage(explainInvalidImageUrl(urlDraft));
      return;
    }
    if (imageUrls.includes(safe)) {
      setUploadMessage("That image is already in the gallery.");
      return;
    }
    if (imageUrls.length >= MAX_IMAGES) {
      setUploadMessage(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }
    addImageUrl(safe, false);
    setUrlDraft("");
    setUploadMessage("Image URL added.");
  }

  function removeAt(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    setImageUrls((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      return next;
    });
  }

  function setPrimary(index: number) {
    setImageUrls((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      return [picked!, ...next];
    });
  }

  function onSubmit(formData: FormData) {
    setError("");
    formData.set("imageUrls", imageUrls.join("\n"));
    startTransition(async () => {
      const result = await saveProductAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm"
    >
      {product?.dbId ? (
        <input type="hidden" name="dbId" value={product.dbId} />
      ) : null}
      <input type="hidden" name="imageUrls" value={imageUrls.join("\n")} />

      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Slug (URL)</span>
        <input
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-from-name-if-empty"
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Price (GH₵)</span>
          <input
            name="priceCedis"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.priceCedis ?? 45}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          {categories.length === 0 ? (
            <p className="mt-1.5 text-sm text-danger">
              No categories yet.{" "}
              <Link href="/admin/categories" className="underline">
                Create one
              </Link>{" "}
              first.
            </p>
          ) : (
            <select
              name="categoryId"
              required
              defaultValue={defaultCategoryId}
              className={fieldClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Short description</span>
        <textarea
          name="description"
          required
          rows={2}
          defaultValue={product?.description}
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Long description</span>
        <textarea
          name="longDescription"
          required
          rows={4}
          defaultValue={product?.longDescription}
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Features (one per line)</span>
        <textarea
          name="features"
          rows={4}
          defaultValue={product?.features.join("\n")}
          className={fieldClass}
        />
      </label>

      <div className="space-y-3 rounded-[8px] border border-border bg-surface-muted/40 p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Product images</p>
            <p className="mt-0.5 text-xs text-muted">
              First image is the shop cover. Upload files or paste https URLs
              ({imageUrls.length}/{MAX_IMAGES}).
            </p>
          </div>
          {product?.slug ? (
            <Link
              href={`/shop/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View on shop
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : null}
        </div>

        <label className="block text-sm">
          <span className="text-muted">Upload from device (multiple OK)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading || pending}
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
              placeholder="https://... or /uploads/..."
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
            disabled={uploading || pending || !urlDraft.trim()}
            onClick={addPastedUrl}
            className="sm:mb-0.5"
          >
            Add URL
          </Button>
          <div className="sm:mb-0.5">
            <MediaPicker
              disabled={uploading || pending || imageUrls.length >= MAX_IMAGES}
              onSelect={(url) => {
                if (imageUrls.includes(url)) {
                  setUploadMessage("That image is already in the gallery.");
                  return;
                }
                if (imageUrls.length >= MAX_IMAGES) {
                  setUploadMessage(`You can add up to ${MAX_IMAGES} images.`);
                  return;
                }
                addImageUrl(url, false);
                setUploadMessage("Image added from library.");
              }}
            />
          </div>
        </div>

        {uploading ? (
          <p className="flex items-center gap-2 text-xs text-muted">
            <Spinner size="sm" />
            Uploading...
          </p>
        ) : uploadMessage ? (
          <p
            className={`text-xs ${
              uploadMessage.toLowerCase().includes("fail") ||
              uploadMessage.toLowerCase().includes("invalid") ||
              uploadMessage.toLowerCase().includes("use ")
                ? "text-danger"
                : "text-success"
            }`}
          >
            {uploadMessage}
          </p>
        ) : null}

        {imageUrls.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {imageUrls.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="overflow-hidden rounded-[8px] border border-border bg-surface"
              >
                <div className="relative aspect-[4/3] bg-surface-muted">
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="280px"
                    unoptimized={shouldUnoptimizeImage(url)}
                  />
                  {index === 0 ? (
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Cover
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-1 border-t border-border p-2">
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
                    disabled={index === imageUrls.length - 1}
                    className="rounded p-1.5 text-muted hover:bg-surface-muted disabled:opacity-30"
                    aria-label="Move later"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-muted"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Cover
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-border bg-surface px-4 py-8 text-center">
            <Upload className="h-6 w-6 text-muted" />
            <p className="text-sm text-muted">
              No images yet. Upload from your device or paste a https URL.
            </p>
          </div>
        )}
      </div>

      <label className="block">
        <span className="text-sm font-medium">Image alt text</span>
        <input
          name="imageAlt"
          defaultValue={product?.imageAlt}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-sm font-medium">Badge</span>
          <input
            name="badge"
            defaultValue={product?.badge}
            placeholder="Best Seller"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Badge ends</span>
          <input
            name="badgeExpiresAt"
            type="date"
            defaultValue={
              product?.badgeExpiresAt
                ? product.badgeExpiresAt.slice(0, 10)
                : ""
            }
            className={fieldClass}
          />
          <span className="mt-1 block text-xs text-muted">
            Optional. Leave empty for no end date.
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Rating</span>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={product?.rating ?? 4.8}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Reviews</span>
          <input
            name="reviewsCount"
            type="number"
            min="0"
            defaultValue={product?.reviewsCount ?? 0}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Stock quantity</span>
        <input
          name="stockQuantity"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={product?.stockQuantity ?? 25}
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-muted">
          Set to 0 for out of stock. {LOW_STOCK_THRESHOLD} or fewer counts as low
          stock. Checkout reduces this automatically.
        </span>
      </label>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={pending || uploading || categories.length === 0}
          className="w-full sm:w-auto"
        >
          {pending ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Saving...
            </>
          ) : product ? (
            "Save changes"
          ) : (
            "Create product"
          )}
        </Button>
        <Button href="/admin/products" variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  );
}
