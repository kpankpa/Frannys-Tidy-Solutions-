import Link from "next/link";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { listCategories, listProducts } from "@/lib/db/products";

export default async function AdminCategoriesPage() {
  await ensureAdminPage();
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts(),
  ]);

  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  const rows = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: counts.get(c.name) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted">
            Organise the shop catalogue. Products must belong to a category.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-primary hover:underline"
        >
          Back to products
        </Link>
      </div>
      <CategoriesManager categories={rows} />
    </div>
  );
}
