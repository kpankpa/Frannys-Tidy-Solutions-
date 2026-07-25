import Image from "next/image";
import Link from "next/link";
import { countProducts, listCategories, listProducts } from "@/lib/db/products";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import {
  deleteProductAction,
  toggleStockAction,
} from "@/server/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";

export default async function AdminProductsPage() {
  await ensureAdminPage();
  const [products, categories, total] = await Promise.all([
    listProducts(),
    listCategories(),
    countProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted">
            Manage catalogue, pricing, and stock ({total} products).
          </p>
        </div>
        <Button href="/admin/products/new">Add Product</Button>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
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
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-muted">/{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    {p.inStock ? (
                      <span className="text-success">In stock</span>
                    ) : (
                      <span className="text-danger">Out</span>
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
                      <form action={toggleStockAction}>
                        <input type="hidden" name="dbId" value={p.dbId} />
                        <button
                          type="submit"
                          className="text-muted hover:text-primary hover:underline"
                        >
                          Toggle stock
                        </button>
                      </form>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="dbId" value={p.dbId} />
                        <button
                          type="submit"
                          className="text-danger hover:underline"
                        >
                          Delete
                        </button>
                      </form>
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
                    No products yet. Add your first product to populate the shop.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted">
        Categories in use: {categories.map((c) => c.name).join(", ") || "none"}.
        Upload images in the product form, or paste image URLs.
      </p>
    </div>
  );
}
