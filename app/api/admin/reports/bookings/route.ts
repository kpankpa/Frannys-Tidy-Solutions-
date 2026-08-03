import { requireAdminApi } from "@/lib/auth/require-admin";
import { bookingStatusLabel } from "@/lib/booking-status";
import { listBookings } from "@/lib/db/bookings";
import { csvDownloadResponse, csvFilename, toCsv } from "@/lib/csv";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const bookings = await listBookings(5000);
  const csv = toCsv(
    [
      "name",
      "phone",
      "service_type",
      "location",
      "preferred_date",
      "status",
      "source",
      "message",
      "created_at",
    ],
    bookings.map((row) => [
      row.name,
      row.phone,
      row.serviceType,
      row.location,
      row.preferredDate ?? "",
      bookingStatusLabel(row.status),
      row.source,
      row.message,
      row.createdAt.toISOString(),
    ]),
  );

  return csvDownloadResponse(csvFilename("frannys-bookings"), csv);
}
