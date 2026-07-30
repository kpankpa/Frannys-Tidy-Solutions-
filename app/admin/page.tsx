import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Package,
} from "lucide-react";
import { listRecentOrders } from "@/lib/db/orders";
import { listBookings } from "@/lib/db/bookings";
import { getDashboardStats } from "@/lib/db/stats";
import { formatPrice } from "@/lib/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { Button } from "@/components/ui/Button";

export default async function AdminOverviewPage() {
  await ensureAdminPage();
  const [stats, recentOrders, recentBookings] = await Promise.all([
    getDashboardStats(),
    listRecentOrders(6),
    listBookings(5),
  ]);

  const kpis = [
    {
      label: "Revenue",
      value: formatPrice(stats.salesTotalCedis),
      hint: "All product orders",
      href: "/admin/reports",
    },
    {
      label: "Orders",
      value: String(stats.orderCount),
      hint: `${stats.pendingOrders} need attention`,
      href: "/admin/orders",
    },
    {
      label: "Bookings",
      value: String(stats.bookingCount),
      hint: `${stats.requestedBookings} requested`,
      href: "/admin/bookings",
    },
    {
      label: "Customers",
      value: String(stats.customerCount),
      hint: "CRM contacts",
      href: "/admin/customers",
    },
  ];

  const attention = [
    {
      label: "Pending orders",
      value: stats.pendingOrders,
      href: "/admin/orders?status=pending",
      icon: ClipboardList,
    },
    {
      label: "New booking requests",
      value: stats.requestedBookings,
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Open complaints",
      value: stats.openComplaints,
      href: "/admin/complaints",
      icon: AlertTriangle,
    },
    {
      label: "Out of stock SKUs",
      value: stats.outOfStockProducts,
      href: "/admin/products?stock=out",
      icon: Package,
    },
    {
      label: "Low stock SKUs",
      value: stats.lowStockProducts,
      href: "/admin/products?stock=low",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Sales, jobs, stock, and website — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/admin/orders" size="sm">
            Manage orders
          </Button>
          <Button href="/admin/bookings" variant="outline" size="sm">
            Manage bookings
          </Button>
          <Button href="/admin/products/new" variant="outline" size="sm">
            Add product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-[10px] border border-border bg-surface p-5 shadow-sm transition hover:border-primary/35 hover:shadow-md"
          >
            <p className="text-sm text-muted">{kpi.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-primary">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted">{kpi.hint}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-foreground">Needs attention</h2>
          <Link
            href="/admin/reports"
            className="text-sm font-medium text-primary hover:underline"
          >
            Reports
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {attention.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 rounded-[8px] bg-surface-muted px-4 py-3 transition hover:bg-surface-soft"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="mt-0.5 text-xl font-bold text-foreground">
                    {item.value}
                  </p>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-foreground">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/admin/orders/${order.orderNumber}`}
                className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 hover:opacity-90"
              >
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatPrice(order.totalCedis)}
                  </p>
                  <p className="text-xs text-muted">{order.statusLabel}</p>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">
                No orders yet. They appear here after checkout.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-foreground">Recent requests</h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href="/admin/bookings"
                className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 hover:opacity-90"
              >
                <div>
                  <p className="font-semibold">{booking.serviceType}</p>
                  <p className="text-xs text-muted">
                    {booking.source === "contact" ? "Enquiry" : "Booking"} ·{" "}
                    {booking.name} · {booking.location}
                  </p>
                </div>
                <p className="text-xs font-semibold capitalize text-primary">
                  {booking.status}
                </p>
              </Link>
            ))}
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">
                No bookings or enquiries yet.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-bold text-foreground">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "/admin/customers", label: "Customers" },
            { href: "/admin/products", label: "Products" },
            { href: "/admin/categories", label: "Categories" },
            { href: "/admin/media", label: "Media" },
            { href: "/admin/content", label: "Site content" },
            { href: "/admin/settings", label: "Settings" },
            { href: "/", label: "View website" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-surface-soft"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
