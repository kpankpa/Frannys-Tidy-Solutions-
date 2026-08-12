import Link from "next/link";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ensureAdminPage } from "@/lib/auth/admin-page";

export default async function NewServicePage() {
  await ensureAdminPage();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Add cleaning service</h1>
          <p className="mt-1 text-sm text-muted">
            New services appear on Home, Services, and the booking form.
          </p>
        </div>
        <Link href="/admin/services" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>
      <ServiceForm />
    </div>
  );
}
