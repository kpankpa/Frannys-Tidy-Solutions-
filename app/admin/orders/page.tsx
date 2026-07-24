import { demoOrders } from "@/lib/services";
import { formatPrice } from "@/lib/products";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-muted">Track fulfilment status.</p>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-muted text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {demoOrders.map((o) => (
              <tr key={o.orderNumber} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div>{o.customer}</div>
                  <div className="text-xs text-muted">{o.phone}</div>
                </td>
                <td className="px-4 py-3 text-muted">{o.items}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
