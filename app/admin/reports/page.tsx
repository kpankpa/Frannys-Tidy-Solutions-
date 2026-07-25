import {
  getBookingsByStatus,
  getOrdersByDay,
  getTopProducts,
  getDashboardStats,
} from "@/lib/db/stats";
import { formatPrice } from "@/lib/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";

export default async function AdminReportsPage() {
  await ensureAdminPage();
  const [stats, byDay, topProducts, bookingsByStatus] = await Promise.all([
    getDashboardStats(),
    getOrdersByDay(7),
    getTopProducts(6),
    getBookingsByStatus(),
  ]);

  const maxDayRevenue = Math.max(...byDay.map((d) => d.revenueCedis), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Live sales and booking performance from your database.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-muted">Total revenue</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {formatPrice(stats.salesTotalCedis)}
          </p>
        </div>
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-muted">Orders</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {stats.orderCount}
          </p>
        </div>
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-muted">Bookings</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            {stats.bookingCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[10px] border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-bold">Orders last 7 days</h2>
          <div className="mt-6 flex h-40 items-end gap-2">
            {byDay.length === 0 ? (
              <p className="text-sm text-muted">No orders in this window.</p>
            ) : (
              byDay.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-[8px] bg-gradient-to-t from-primary to-secondary"
                    style={{
                      height: `${Math.max(8, (day.revenueCedis / maxDayRevenue) * 100)}%`,
                    }}
                    title={`${day.count} orders · ${formatPrice(day.revenueCedis)}`}
                  />
                  <span className="text-[10px] text-muted">
                    {day.day.slice(5)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-bold">Top products</h2>
          <ul className="mt-4 space-y-3">
            {topProducts.map((product) => (
              <li
                key={product.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">{product.quantity} sold</p>
                </div>
                <p className="font-semibold text-primary">
                  {formatPrice(product.revenueCedis)}
                </p>
              </li>
            ))}
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted">No product sales yet.</p>
            ) : null}
          </ul>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <h2 className="font-bold">Bookings by status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {bookingsByStatus.map((row) => (
              <div
                key={row.status}
                className="rounded-[8px] bg-surface-muted px-3 py-3 text-center"
              >
                <p className="text-xs text-muted">{row.label}</p>
                <p className="mt-1 text-lg font-bold">{row.count}</p>
              </div>
            ))}
            {bookingsByStatus.length === 0 ? (
              <p className="text-sm text-muted">No bookings yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
