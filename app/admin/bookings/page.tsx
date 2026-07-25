import { listBookings } from "@/lib/db/bookings";
import { BOOKING_PIPELINE, bookingStatusLabel } from "@/lib/booking-status";
import { updateBookingStatusAction } from "@/server/admin";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminBookingsPage() {
  await ensureAdminPage();
  const bookings = await listBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="mt-1 text-sm text-muted">
          Cleaning bookings and contact enquiries from the website ({bookings.length}).
        </p>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Service / Subject</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Preferred</th>
                <th className="px-4 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 text-muted">{formatWhen(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-muted">{b.phone}</p>
                    {b.message ? (
                      <p className="mt-1 max-w-xs text-xs text-muted line-clamp-2">
                        {b.message}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        b.source === "contact"
                          ? "bg-surface-muted text-muted"
                          : "bg-secondary/15 text-primary"
                      }`}
                    >
                      {b.source === "contact" ? "Enquiry" : "Booking"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.serviceType}</td>
                  <td className="px-4 py-3 text-muted">{b.location}</td>
                  <td className="px-4 py-3 text-muted">
                    {b.preferredDate || "Flexible"}
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {bookingStatusLabel(b.status)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateBookingStatusAction} className="flex flex-wrap gap-2">
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
                  </td>
                </tr>
              ))}
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    No bookings or enquiries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
