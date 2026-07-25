import Link from "next/link";
import { listCustomers } from "@/lib/db/customers";
import { formatPrice } from "@/lib/products";
import { EmptyState } from "@/components/ui/EmptyState";
import { ensureAdminPage } from "@/lib/auth/admin-page";

export default async function AdminCustomersPage() {
  await ensureAdminPage();
  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-muted">
          People who ordered or booked through the website ({customers.length}).
        </p>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="They appear automatically after a checkout or service booking."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/admin/customers/${c.id}`}
              className="rounded-[10px] border border-border bg-surface p-5 shadow-sm transition hover:border-primary/30"
            >
              <p className="font-bold text-foreground">{c.name}</p>
              <p className="mt-1 text-sm text-muted">{c.phone}</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted">{c.orderCount} orders</span>
                <span className="font-semibold text-primary">
                  {formatPrice(c.spendCedis)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
