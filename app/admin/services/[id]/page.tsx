import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { getCleaningServiceById } from "@/lib/db/cleaning-services";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  await ensureAdminPage();
  const { id } = await params;
  const service = await getCleaningServiceById(id);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Edit service</h1>
          <p className="mt-1 text-sm text-muted">{service.title}</p>
        </div>
        <Link href="/admin/services" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>
      <ServiceForm
        service={{
          ...service,
          image: service.image ?? "",
        }}
      />
    </div>
  );
}
