import Image from "next/image";
import { formatPrice, products } from "@/lib/products";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted">
            Manage catalogue, pricing, and imagery (UI demo).
          </p>
        </div>
        <Button type="button">Upload Product</Button>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
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
                <tr key={p.id} className="border-t border-border">
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
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.inStock ? (
                      <span className="text-success">In stock</span>
                    ) : (
                      <span className="text-danger">Out</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="text-primary hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[20px] border border-dashed border-border bg-surface p-6">
        <h2 className="font-bold">Upload multiple images</h2>
        <p className="mt-2 text-sm text-muted">
          Drag & drop area placeholder for future product image management.
        </p>
        <div className="mt-4 flex h-32 items-center justify-center rounded-[16px] bg-surface-muted text-sm text-muted">
          Drop images here or browse
        </div>
      </div>
    </div>
  );
}
