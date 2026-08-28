import Link from "next/link";
import { listRecentOrders } from "@/lib/db/orders";
import { formatPrice } from "@/lib/products";
import { ORDER_ADMIN_STATUSES } from "@/lib/order-status";
import { UpdateOrderStatusForm } from "@/components/admin/UpdateOrderStatusForm";
import { Button } from "@/components/ui/Button";
import { ensureAdminPage } from "@/lib/auth/admin-page";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  await ensureAdminPage();
  const params = await searchParams;
  const status = params.status?.trim() || undefined;
  const orders = await listRecentOrders(80, status);
  const exportHref = status
    ? `/api/admin/orders/export?status=${encodeURIComponent(status)}`
    : "/api/admin/orders/export";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-muted">
            Fulfilment queue. Status changes update customer track-order.
          </p>
        </div>
        <div className="flex gap-2">
          <Button href="/admin/orders/new" variant="outline" size="sm">
            New Order
          </Button>
          <Button href={exportHref} variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            !status ? "bg-primary text-white" : "bg-surface-muted text-muted"
          }`}
        >
          All
        </Link>
        {ORDER_ADMIN_STATUSES.map((step) => (
          <Link
            key={step.key}
            href={`/admin/orders?status=${step.key}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              status === step.key
                ? "bg-primary text-white"
                : "bg-surface-muted text-muted"
            }`}
          >
            {step.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Update status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderNumber} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-muted">{o.statusLabel}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted">{o.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{o.itemsSummary || "-"}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(o.totalCedis)}
                  </td>
                  <td className="px-4 py-3">
                    <UpdateOrderStatusForm
                      orderNumber={o.orderNumber}
                      currentStatus={o.status}
                      variant="compact"
                      activeStatusFilter={status}
                      showDetailsLink
                    />
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted">
                    No orders in this view.
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
