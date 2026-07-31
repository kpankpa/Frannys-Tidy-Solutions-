import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { getCustomerById } from "@/lib/db/customers";
import { toWhatsAppE164 } from "@/lib/phone";
import { formatPrice } from "@/lib/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  await ensureAdminPage();
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const customerWa = toWhatsAppE164(customer.phone);
  const waMessage = [
    `Hello ${customer.name},`,
    "",
    "This is Frannys Tidy Solutions. How can we help you today?",
  ].join("\n");
  const waUrl = customerWa
    ? `https://wa.me/${customerWa}?text=${encodeURIComponent(waMessage)}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">{customer.phone}</p>
          {customer.email ? (
            <p className="text-sm text-muted">{customer.email}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {waUrl ? (
            <Button
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          ) : null}
          <Link
            href="/admin/customers"
            className="inline-flex h-9 items-center text-sm text-primary hover:underline"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline"
          >
            All orders
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {customer.orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/admin/orders/${order.orderNumber}`}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 hover:opacity-90"
            >
              <div>
                <p className="font-semibold text-primary hover:underline">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-muted">{order.itemsSummary || "-"}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatWhen(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.totalCedis)}</p>
                <p className="text-xs text-muted">{order.statusLabel}</p>
              </div>
            </Link>
          ))}
          {customer.orders.length === 0 ? (
            <p className="text-sm text-muted">No product orders yet.</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Bookings and enquiries</h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-primary hover:underline"
          >
            All bookings
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {customer.bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-0"
            >
              <div>
                <p className="font-semibold">{booking.serviceType}</p>
                <p className="text-xs text-muted">
                  {booking.source === "contact" ? "Enquiry" : "Booking"} ·{" "}
                  {booking.location}
                  {booking.preferredDate
                    ? ` · Preferred ${booking.preferredDate}`
                    : ""}
                </p>
                {booking.message ? (
                  <p className="mt-1 max-w-md text-xs text-muted line-clamp-2">
                    {booking.message}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted">
                  {formatWhen(booking.createdAt)}
                </p>
              </div>
              <p className="text-xs font-semibold text-primary">
                {booking.statusLabel}
              </p>
            </div>
          ))}
          {customer.bookings.length === 0 ? (
            <p className="text-sm text-muted">No bookings or enquiries yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
