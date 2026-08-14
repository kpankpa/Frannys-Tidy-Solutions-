import Image from "next/image";
import Link from "next/link";
import { countProducts, listCategories, listProducts } from "@/lib/db/products";
import { isLowStock, isProductOnSale } from "@/lib/products";
import { ProductPrice } from "@/components/shop/ProductPrice";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { DuplicateProductButton } from "@/components/admin/DuplicateProductButton";
import {
  deleteProductAction,
  toggleStockAction,
} from "@/server/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    stock?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await ensureAdminPage();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() || "All";
  const stock = params.stock?.trim() || "all";

  const [products, categories, total] = await Promise.all([
    listProducts({
      query: q || undefined,
      category: category === "All" ? undefined : category,
      availability:
        stock === "in" || stock === "out" || stock === "low" ? stock : "all",
    }),
    listCategories(),
    countProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted">
            Manage catalogue, pricing, images, and stock ({total} total
            {products.length !== total ? `, showing ${products.length}` : ""}).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/admin/media" variant="outline" size="sm">
            Media
          </Button>
          <Button href="/admin/categories" variant="outline" size="sm">
            Categories
          </Button>
          <Button href="/admin/products/new">Add Product</Button>
        </div>
      </div>

      <form
        className="flex flex-wrap items-end gap-3 rounded-[10px] border border-border bg-surface p-4 shadow-sm"
        method="get"
      >
        <label className="min-w-[12rem] flex-1">
          <span className="text-xs font-medium text-muted">Search</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Name or description"
            className="mt-1 w-full rounded-[8px] border border-border px-3 py-2 text-sm"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-muted">Category</span>
          <select
            name="category"
            defaultValue={category}
            className="mt-1 block rounded-[8px] border border-border px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-medium text-muted">Stock</span>
          <select
            name="stock"
            defaultValue={stock}
            className="mt-1 block rounded-[8px] border border-border px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
        <Button type="submit" size="sm">
          Filter
        </Button>
        {q || category !== "All" || stock !== "all" ? (
          <Button href="/admin/products" variant="ghost" size="sm">
            Clear
          </Button>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.dbId} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-surface-muted">
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized={shouldUnoptimizeImage(p.image)}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-muted">
                          /{p.id}
                          {p.images.length
                            ? ` · ${p.images.length} image${p.images.length === 1 ? "" : "s"}`
                            : " · no images"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    <ProductPrice
                      price={p.price}
                      compareAtPrice={p.compareAtPrice}
                      size="sm"
                    />
                    {isProductOnSale(p) ? (
                      <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-highlight">
                        On sale
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {!p.inStock || p.stockQuantity <= 0 ? (
                      <span className="text-danger">Out (0)</span>
                    ) : isLowStock(p.stockQuantity) ? (
                      <span className="font-semibold text-amber-700">
                        Low ({p.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-success">{p.stockQuantity} left</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/products/${p.dbId}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/shop/${p.id}`}
                        target="_blank"
                        className="text-muted hover:text-primary hover:underline"
                      >
                        View
                      </Link>
                      <DuplicateProductButton dbId={p.dbId} />
                      <form action={toggleStockAction}>
                        <input type="hidden" name="dbId" value={p.dbId} />
                        <button
                          type="submit"
                          className="text-muted hover:text-primary hover:underline"
                        >
                          {p.inStock ? "Mark out" : "Restock 10"}
                        </button>
                      </form>
                      <ConfirmDeleteButton
                        action={deleteProductAction}
                        hiddenFields={{ dbId: p.dbId }}
                        confirmMessage={`Delete ${p.name}? This cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted"
                  >
                    No products match this filter.{" "}
                    <Link
                      href="/admin/products/new"
                      className="text-primary hover:underline"
                    >
                      Add a product
                    </Link>
                    .
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
