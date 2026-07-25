"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { AccentCircles } from "@/components/ui/AccentCircles";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ShopCatalogProps = {
  products: Product[];
  categories: string[];
};

export function ShopCatalog({ products, categories }: ShopCatalogProps) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(80);
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryOptions = ["All", ...categories];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (availability === "in" && !p.inStock) return false;
      if (availability === "out" && p.inStock) return false;
      if (
        query &&
        !`${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [products, category, maxPrice, availability, query]);

  const Filters = (
    <aside className="space-y-8 rounded-[10px] border border-border bg-surface p-5 shadow-sm">
      <div>
        <p className="text-sm font-bold text-foreground">Categories</p>
        <ul className="mt-3 space-y-2">
          {categoryOptions.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="radio"
                  name="category"
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className="accent-primary"
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-bold text-foreground">Price Range</p>
        <p className="mt-2 text-sm text-muted">Up to GH₵ {maxPrice}</p>
        <input
          type="range"
          min={20}
          max={80}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-primary"
        />
      </div>

      <div>
        <p className="text-sm font-bold text-foreground">Availability</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["in", "In Stock"],
              ["out", "Upcoming"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setAvailability(value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                availability === value
                  ? "bg-secondary/20 text-primary"
                  : "bg-surface-muted text-muted hover:bg-surface-soft",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[8px] relative overflow-hidden bg-primary p-4 text-white">
        <AccentCircles />
        <p className="relative text-sm font-bold">Save on your first bundle</p>
        <p className="relative mt-1 text-xs text-white/75">
          Ask about detergent subscription packs when you order.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Detergents & Solutions
          </h1>
          <p className="mt-2 text-muted">
            Clinical-grade freshness for your home and business.
          </p>
        </div>
        <p className="text-sm text-muted">
          Showing {filtered.length} of {products.length} items
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-[8px] border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-border bg-surface px-4 text-sm font-semibold lg:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          {Filters}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product, i) => (
            <FadeIn key={product.id} delay={(i % 6) * 0.04}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-[10px] border border-dashed border-border p-10 text-center">
              <p className="font-semibold text-foreground">
                {products.length === 0
                  ? "No products in the shop yet"
                  : "No products match your filters"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {products.length === 0
                  ? "Check back soon, or contact us on WhatsApp for availability."
                  : "Try clearing search or widening the price range."}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
