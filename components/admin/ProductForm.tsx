"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
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

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const defaultCategoryId =
    categories.find((c) => c.name === product?.categoryName)?.id ??
    categories[0]?.id ??
    "";

  function onSubmit(formData: FormData) {
    setError("");
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
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Slug (URL)</span>
        <input
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-from-name-if-empty"
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
            className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            name="categoryId"
            required
            defaultValue={defaultCategoryId}
            className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Long description</span>
        <textarea
          name="longDescription"
          required
          rows={4}
          defaultValue={product?.longDescription}
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Features (one per line)</span>
        <textarea
          name="features"
          rows={4}
          defaultValue={product?.features.join("\n")}
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Image URLs (one per line)</span>
        <textarea
          name="imageUrls"
          rows={3}
          defaultValue={product?.imageUrls.join("\n")}
          placeholder="https://..."
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Image alt text</span>
        <input
          name="imageAlt"
          defaultValue={product?.imageAlt}
          className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium">Badge</span>
          <input
            name="badge"
            defaultValue={product?.badge}
            placeholder="Best Seller"
            className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
            className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Reviews</span>
          <input
            name="reviewsCount"
            type="number"
            min="0"
            defaultValue={product?.reviewsCount ?? 0}
            className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Saving..." : product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
