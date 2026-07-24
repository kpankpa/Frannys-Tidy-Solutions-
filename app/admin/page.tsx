import { demoOrders } from "@/lib/services";
import { countProducts } from "@/lib/db/products";
import { formatPrice } from "@/lib/products";

export default async function AdminOverviewPage() {
  const productCount = await countProducts();

  const stats = [
    { label: "Total Sales", value: "GH₵ 24,680" },
    { label: "Orders", value: "186" },
    { label: "Customers", value: "142" },
    { label: "Products", value: String(productCount) },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Snapshot of Frannys Tidy Solutions performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[10px] border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-bold text-foreground">Recent Orders</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-muted">
                <tr className="border-b border-border">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {demoOrders.map((order) => (
                  <tr key={order.orderNumber} className="border-b border-border/70">
                    <td className="py-3 font-semibold">{order.orderNumber}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-bold text-foreground">Sales Trend</h2>
          <div className="mt-6 flex h-48 items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-[10px] bg-gradient-to-t from-primary to-secondary"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
