import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";
import { AdminWhatsAppTemplates } from "@/components/admin/AdminWhatsAppTemplates";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import { Button } from "@/components/ui/Button";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { findOrderByNumber } from "@/lib/db/orders";
import { getSiteConfig } from "@/lib/db/settings";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { ORDER_ADMIN_STATUSES } from "@/lib/order-status";
import { formatPrice } from "@/lib/products";
import { customerOrderWaTemplates } from "@/lib/wa-templates";
import { updateOrderStatusAction } from "@/server/admin";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await ensureAdminPage();
  const { orderNumber } = await params;
  const [order, site] = await Promise.all([
    findOrderByNumber(decodeURIComponent(orderNumber)),
    getSiteConfig(),
  ]);
  if (!order) notFound();

  const waTemplates = customerOrderWaTemplates({
    customerName: order.customer,
    customerPhone: order.phone,
    orderNumber: order.orderNumber,
    status: order.status,
    businessName: site.name,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Order detail
          </p>
          <h1 className="mt-1 text-2xl font-bold">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">
            {order.statusLabel} · Placed {formatWhen(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/orders/${order.orderNumber}/print`}
            target="_blank"
            variant="outline"
            size="sm"
          >
            <Printer className="h-4 w-4" />
            Print receipt
          </Button>
          <Button href="/admin/orders" variant="outline" size="sm">
            Back to orders
          </Button>
        </div>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <AdminWhatsAppTemplates
          title="WhatsApp customer templates"
          templates={waTemplates}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-bold">Customer</h2>
          <p className="mt-2 font-semibold">{order.customer}</p>
          <p className="text-sm text-muted">{order.phone}</p>
          <p className="mt-3 text-sm">
            <span className="font-medium">Delivery address</span>
            <br />
            {order.deliveryAddress}
          </p>
          {order.notes ? (
            <p className="mt-3 text-sm">
              <span className="font-medium">Customer notes</span>
              <br />
              {order.notes}
            </p>
          ) : null}
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-bold">Totals</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(order.subtotalCedis)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-semibold">{formatPrice(order.deliveryCedis)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-2">
              <dt className="font-medium">Total</dt>
              <dd className="text-lg font-bold text-primary">
                {formatPrice(order.totalCedis)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-bold">Line items</h2>
        <ul className="mt-4 space-y-3">
          {order.lineItems.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 border-b border-border/70 pb-3 last:border-0"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized={shouldUnoptimizeImage(item.image)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.category} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                {formatPrice(item.unitPriceCedis * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-bold">Update status</h2>
        <p className="mt-1 text-sm text-muted">
          Changes appear on the customer track-order page.
        </p>
        <form action={updateOrderStatusAction} className="mt-4 space-y-3">
          <input type="hidden" name="orderNumber" value={order.orderNumber} />
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select
              name="status"
              defaultValue={order.status}
              className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm"
            >
              {ORDER_ADMIN_STATUSES.map((step) => (
                <option key={step.key} value={step.key}>
                  {step.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Internal note (optional)</span>
            <input
              name="note"
              placeholder="e.g. Called customer, payment confirmed"
              className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm"
            />
          </label>
          <PendingSaveButton />
        </form>
      </div>

      <div className="rounded-[10px] border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-bold">Timeline</h2>
        <ol className="mt-4 space-y-4">
          {order.events.map((event, index) => (
            <li key={`${event.createdAt}-${index}`} className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="font-semibold">{event.statusLabel}</p>
                <p className="text-xs text-muted">{formatWhen(event.createdAt)}</p>
                {event.note ? (
                  <p className="mt-1 text-sm text-muted">{event.note}</p>
                ) : null}
              </div>
            </li>
          ))}
          {order.events.length === 0 ? (
            <li className="text-sm text-muted">No events yet.</li>
          ) : null}
        </ol>
      </div>

      <p className="text-xs text-muted">
        Public tracking:{" "}
        <Link href="/track-order" className="text-primary hover:underline">
          /track-order
        </Link>
      </p>
    </div>
  );
}
