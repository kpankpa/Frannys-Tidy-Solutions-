import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/admin/PrintButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { findOrderByNumber } from "@/lib/db/orders";
import { getSiteConfig } from "@/lib/db/settings";
import { formatPrice } from "@/lib/products";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminOrderPrintPage({ params }: PageProps) {
  await ensureAdminPage();
  const { orderNumber } = await params;
  const [order, site] = await Promise.all([
    findOrderByNumber(decodeURIComponent(orderNumber)),
    getSiteConfig(),
  ]);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-8 text-black print:max-w-none print:px-0 print:py-0">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print mb-6 flex flex-wrap gap-3">
        <PrintButton />
        <Link
          href={`/admin/orders/${order.orderNumber}`}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          Back
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
        >
          Edit receipt settings
        </Link>
      </div>

      <header className="flex flex-wrap items-start gap-4 border-b border-black/15 pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.logoUrl}
          alt={site.name}
          width={72}
          height={72}
          className="h-16 w-16 shrink-0 object-contain print:h-14 print:w-14"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight">{site.name}</h1>
          {site.tagline ? (
            <p className="mt-0.5 text-sm text-black/70">{site.tagline}</p>
          ) : null}
          <p className="mt-2 text-sm">{site.address}</p>
          <p className="text-sm">
            Phone {site.phoneDisplay}
            {site.whatsapp ? ` · WhatsApp ${site.whatsapp}` : null}
          </p>
          <p className="text-sm">{site.email}</p>
          {site.hoursShort ? (
            <p className="text-sm text-black/70">{site.hoursShort}</p>
          ) : null}
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">
            {site.receiptTitle || "Receipt"}
          </h2>
          <p className="mt-1 text-lg font-semibold">{order.orderNumber}</p>
          <p className="text-sm">Status: {order.statusLabel}</p>
          <p className="text-sm">Date: {formatWhen(order.createdAt)}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Customer</h2>
          <p className="mt-1 font-semibold">{order.customer}</p>
          <p className="text-sm">{order.phone}</p>
          <p className="mt-2 text-sm">{order.deliveryAddress}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/20">
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Unit</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.lineItems.map((item, index) => (
            <tr key={`${item.name}-${index}`} className="border-b border-black/10">
              <td className="py-2">{item.name}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2 text-right">
                {formatPrice(item.unitPriceCedis)}
              </td>
              <td className="py-2 text-right">
                {formatPrice(item.unitPriceCedis * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd>{formatPrice(order.subtotalCedis)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd>{formatPrice(order.deliveryCedis)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-black/20 pt-2 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(order.totalCedis)}</dd>
        </div>
      </dl>

      {order.notes ? (
        <p className="mt-6 text-sm">
          <span className="font-semibold">Customer notes:</span> {order.notes}
        </p>
      ) : null}

      {site.receiptNote ? (
        <p className="mt-6 whitespace-pre-line text-sm text-black/80">
          {site.receiptNote}
        </p>
      ) : null}

      {site.receiptFooter ? (
        <p className="mt-8 whitespace-pre-line text-xs text-black/60">
          {site.receiptFooter}
        </p>
      ) : null}
    </div>
  );
}
