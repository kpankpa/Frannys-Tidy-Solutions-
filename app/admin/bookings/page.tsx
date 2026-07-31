import { AdminWhatsAppTemplates } from "@/components/admin/AdminWhatsAppTemplates";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { BOOKING_PIPELINE, bookingStatusLabel } from "@/lib/booking-status";
import { listBookings } from "@/lib/db/bookings";
import { getSiteConfig } from "@/lib/db/settings";
import { customerBookingWaTemplates } from "@/lib/wa-templates";
import { updateBookingStatusAction } from "@/server/admin";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminBookingsPage() {
  await ensureAdminPage();
  const [bookings, site] = await Promise.all([listBookings(), getSiteConfig()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="mt-1 text-sm text-muted">
          Cleaning bookings and contact enquiries from the website ({bookings.length}).
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => {
          const waTemplates = customerBookingWaTemplates({
            customerName: b.name,
            customerPhone: b.phone,
            serviceType: b.serviceType,
            status: b.status,
            preferredDate: b.preferredDate,
            businessName: site.name,
          });

          return (
            <article
              key={b.id}
              className="rounded-[10px] border border-border bg-surface p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-sm text-muted">{b.phone}</p>
                  <p className="mt-1 text-xs text-muted">{formatWhen(b.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    b.source === "contact"
                      ? "bg-surface-muted text-muted"
                      : "bg-secondary/15 text-primary"
                  }`}
                >
                  {b.source === "contact" ? "Enquiry" : "Booking"}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted">Service / subject</dt>
                  <dd className="font-medium">{b.serviceType}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Location</dt>
                  <dd className="font-medium">{b.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Preferred</dt>
                  <dd className="font-medium">{b.preferredDate || "Flexible"}</dd>
                  <p className="mt-0.5 text-xs font-semibold text-primary">
                    {bookingStatusLabel(b.status)}
                  </p>
                </div>
              </dl>

              {b.message ? (
                <p className="mt-3 text-sm text-muted">{b.message}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-4">
                <form
                  action={updateBookingStatusAction}
                  className="flex flex-wrap gap-2"
                >
                  <input type="hidden" name="bookingId" value={b.id} />
                  <select
                    name="status"
                    defaultValue={b.status}
                    className="rounded-[8px] border border-border px-2 py-1.5 text-xs"
                  >
                    {BOOKING_PIPELINE.map((step) => (
                      <option key={step.key} value={step.key}>
                        {step.label}
                      </option>
                    ))}
                  </select>
                  <PendingSaveButton />
                </form>
                <AdminWhatsAppTemplates
                  title="WhatsApp templates"
                  templates={waTemplates}
                />
              </div>
            </article>
          );
        })}

        {bookings.length === 0 ? (
          <div className="rounded-[10px] border border-border bg-surface px-4 py-12 text-center text-sm text-muted shadow-sm">
            No bookings yet. They appear here after someone submits the booking
            or contact form.
          </div>
        ) : null}
      </div>
    </div>
  );
}
