"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";
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
  badge: string;
  imageAlt: string;
  imageUrls: string[];
};

type ProductFormProps = {
  categories: CategoryOption[];
  product?: ProductFormValues;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [imageUrlsText, setImageUrlsText] = useState(
    product?.imageUrls.join("\n") ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const defaultCategoryId =
    categories.find((c) => c.name === product?.categoryName)?.id ??
    categories[0]?.id ??
    "";

  const previewUrl =
    imageUrlsText
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) ?? "";

  async function onUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploadMessage("");
    setUploading(true);
    try {
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
      setImageUrlsText((prev) =>
        prev.trim() ? `${data.url}\n${prev.trim()}` : data.url!,
      );
      setUploadMessage("Image uploaded. It is listed first below.");
    } catch (err) {
      setUploadMessage(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(formData: FormData) {
    setError("");
    formData.set("imageUrls", imageUrlsText);
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
    <form action={onSubmit} className="space-y-4 rounded-[10px] border border-border bg-surface p-6 shadow-sm">
      {product?.dbId ? (
        <input type="hidden" name="dbId" value={product.dbId} />
      ) : null}

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
        <p className="text-sm font-medium">Product images</p>
        <label className="block text-sm">
          <span className="text-muted">Upload from device</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading || pending}
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
            className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </label>
        {uploading ? (
          <p className="flex items-center gap-2 text-xs text-muted">
            <Spinner size="sm" />
            Uploading...
          </p>
        ) : uploadMessage ? (
          <p
            className={`text-xs ${
              uploadMessage.includes("uploaded") ? "text-success" : "text-danger"
            }`}
          >
            {uploadMessage}
          </p>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium">Image URLs (one per line)</span>
          <textarea
            name="imageUrls"
            rows={3}
            value={imageUrlsText}
            onChange={(e) => setImageUrlsText(e.target.value)}
            placeholder="/uploads/... or https://..."
            className={fieldClass}
          />
        </label>

        {previewUrl ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-[8px] border border-border bg-surface">
            <Image
              src={previewUrl}
              alt="Product preview"
              fill
              className="object-cover"
              sizes="112px"
              unoptimized={previewUrl.startsWith("/uploads/")}
            />
          </div>
        ) : null}
      </div>

      <label className="block">
        <span className="text-sm font-medium">Image alt text</span>
        <input
          name="imageAlt"
          defaultValue={product?.imageAlt}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product?.inStock ?? true}
          className="accent-primary"
        />
        In stock
      </label>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" disabled={pending || uploading} className="w-full sm:w-auto">
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
    </form>
  );
}
