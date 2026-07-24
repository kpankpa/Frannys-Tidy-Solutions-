import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/db/products";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="mt-1 text-sm text-muted">
            Create a product that appears in the shop immediately.
          </p>
        </div>
        <Link href="/admin/products" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
