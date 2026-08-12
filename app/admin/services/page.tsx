import Image from "next/image";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { ServicePackagesManager } from "@/components/admin/ServicePackagesManager";
import { Button } from "@/components/ui/Button";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import {
  listCleaningServices,
  listServicePackages,
} from "@/lib/db/cleaning-services";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { deleteCleaningServiceFormAction } from "@/server/services-admin";

export default async function AdminServicesPage() {
  await ensureAdminPage();
  const [services, packages] = await Promise.all([
    listCleaningServices(),
    listServicePackages(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Cleaning services</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Manage the service cards on Home and Services, booking options, and
            fixed-price packages. Page headlines and process steps stay under{" "}
            <Link href="/admin/content" className="font-medium text-primary hover:underline">
              Site content
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/admin/bookings" variant="outline" size="sm">
            Bookings
          </Button>
          <Button href="/admin/services/new">Add service</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {service.image ? (
                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-surface-muted">
                          <Image
                            src={service.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={shouldUnoptimizeImage(service.image)}
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-surface-muted text-xs text-muted">
                          No image
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{service.title}</p>
                        <p className="text-xs text-muted">{service.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-md px-4 py-3 text-muted">
                    {service.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/services?service=${encodeURIComponent(service.title)}#book`}
                        target="_blank"
                        className="text-muted hover:text-primary hover:underline"
                      >
                        Preview
                      </Link>
                      <ConfirmDeleteButton
                        action={deleteCleaningServiceFormAction}
                        hiddenFields={{ id: service.id }}
                        confirmMessage={`Delete ${service.title}?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted">
                    No services yet.{" "}
                    <Link
                      href="/admin/services/new"
                      className="text-primary hover:underline"
                    >
                      Add your first service
                    </Link>
                    .
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <ServicePackagesManager packages={packages} />
    </div>
  );
}
