import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/db/customers";
import { formatPrice } from "@/lib/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  await ensureAdminPage();
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">{customer.phone}</p>
        </div>
        <Link href="/admin/customers" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-bold">Orders</h2>
        <div className="mt-4 space-y-3">
          {customer.orders.map((order) => (
            <div
              key={order.orderNumber}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0"
            >
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-muted">{order.itemsSummary}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.totalCedis)}</p>
                <p className="text-xs text-muted">{order.statusLabel}</p>
              </div>
            </div>
          ))}
          {customer.orders.length === 0 ? (
            <p className="text-sm text-muted">No product orders yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
