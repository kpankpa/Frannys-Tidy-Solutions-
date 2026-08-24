import Link from "next/link";
import { NewOrderForm } from "@/components/admin/NewOrderForm";
import { listProducts } from "@/lib/db/products";
import { getSiteConfig } from "@/lib/db/settings";
import { ensureAdminPage } from "@/lib/auth/admin-page";

export default async function NewAdminOrderPage() {
  await ensureAdminPage();
  const [products, site] = await Promise.all([listProducts(), getSiteConfig()]);

  const options = products
    // Out-of-stock products cannot be ordered; the server rejects them too.
    .filter((product) => product.inStock && product.stockQuantity > 0)
    .map((product) => ({
      dbId: product.dbId,
      name: product.name,
      category: product.category,
      unitPriceCedis: product.price,
      stockQuantity: product.stockQuantity,
    }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">New Order</h1>
          <p className="mt-1 text-sm text-muted">
            Create an order for a phone or walk-in customer. Stock is reserved
            immediately.
          </p>
        </div>
        <Link href="/admin/orders" className="text-sm text-primary hover:underline">
          Back to orders
        </Link>
      </div>
      <NewOrderForm
        products={options}
        defaultDeliveryFeeCedis={site.deliveryFee}
      />
    </div>
  );
}
