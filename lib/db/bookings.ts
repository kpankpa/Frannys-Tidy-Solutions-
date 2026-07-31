import { desc, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, customers } from "@/lib/db/schema";
import { normalizeGhanaPhone, phonesMatch } from "@/lib/phone";
import { clampText, LIMITS } from "@/lib/validation";

export type BookingSource = "booking" | "contact";

export type CreateBookingInput = {
  name: string;
  phone: string;
  serviceType: string;
  location: string;
  preferredDate?: string;
  message?: string;
  source?: BookingSource;
  /** Honeypot — must be empty */
  website?: string;
};

export type BookingListItem = {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  location: string;
  preferredDate: string | null;
  message: string;
  status: string;
  source: string;
  createdAt: Date;
};

export async function createBooking(input: CreateBookingInput) {
  if (input.website?.trim()) {
    throw new Error("Could not save your booking.");
  }

  const name = clampText(input.name, LIMITS.name);
  const phone = normalizeGhanaPhone(input.phone);
  const serviceType = clampText(input.serviceType, LIMITS.serviceType);
  const location =
    clampText(input.location, LIMITS.location) || "Not specified";
  const preferredDate = clampText(input.preferredDate ?? "", 40) || null;
  const message = clampText(input.message ?? "", LIMITS.message);
  const source: BookingSource =
    input.source === "contact" ? "contact" : "booking";

  if (!name || !phone || !serviceType) {
    throw new Error(
      "Enter a valid name, Ghana phone number, and service type.",
    );
  }

  return db.transaction(async (tx) => {
    const existingCustomer = await tx.query.customers.findFirst({
      where: eq(customers.phone, phone),
    });

    let customerId: string | null = null;
    if (existingCustomer) {
      // Keep existing CRM name; public forms must not rename customers by phone alone.
      customerId = existingCustomer.id;
    } else {
      const [created] = await tx
        .insert(customers)
        .values({ name, phone })
        .returning();
      customerId = created.id;
    }

    const [booking] = await tx
      .insert(bookings)
      .values({
        customerId,
        name,
        phone,
        serviceType,
        location,
        preferredDate,
        message,
        status: "requested",
        source,
      })
      .returning();

    return {
      id: booking.id,
      status: booking.status,
      source: booking.source,
      name: booking.name,
      phone: booking.phone,
      serviceType: booking.serviceType,
      location: booking.location,
      preferredDate: booking.preferredDate,
      message: booking.message,
    };
  });
}

export async function listBookings(limit = 100): Promise<BookingListItem[]> {
  const rows = await db
    .select({
      id: bookings.id,
      name: bookings.name,
      phone: bookings.phone,
      serviceType: bookings.serviceType,
      location: bookings.location,
      preferredDate: bookings.preferredDate,
      message: bookings.message,
      status: bookings.status,
      source: bookings.source,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  return rows;
}

/** Bookings linked by customer id or matching phone. */
export async function listBookingsForCustomer(
  customerId: string,
  phone: string,
  limit = 40,
): Promise<BookingListItem[]> {
  const normalized = normalizeGhanaPhone(phone) ?? phone.replace(/[\s\-()+/]/g, "");

  const rows = await db
    .select({
      id: bookings.id,
      name: bookings.name,
      phone: bookings.phone,
      serviceType: bookings.serviceType,
      location: bookings.location,
      preferredDate: bookings.preferredDate,
      message: bookings.message,
      status: bookings.status,
      source: bookings.source,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .where(
      or(eq(bookings.customerId, customerId), eq(bookings.phone, normalized)),
    )
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  // Also catch alternate phone formats stored before normalize.
  if (rows.length > 0) return rows;

  const fallback = await listBookings(200);
  return fallback
    .filter((b) => phonesMatch(b.phone, phone))
    .slice(0, limit);
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));
}
