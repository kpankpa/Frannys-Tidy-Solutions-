"use server";

import { bookingMessage } from "@/lib/constants";
import { createBooking, type CreateBookingInput } from "@/lib/db/bookings";
import { getSiteConfig } from "@/lib/db/settings";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { normalizeGhanaPhone } from "@/lib/phone";
import { isHoneypotFilled } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type PlaceBookingState =
  | { ok: true; bookingId: string; whatsappMessage: string }
  | { ok: false; error: string };

export async function placeBookingAction(
  input: CreateBookingInput,
): Promise<PlaceBookingState> {
  const ip = await getClientIp();
  const phoneKey = normalizeGhanaPhone(input.phone) ?? "unknown";
  const source = input.source === "contact" ? "contact" : "booking";

  const ipLimit = rateLimit({
    key: `${source}:ip:${ip}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!ipLimit.ok) {
    return { ok: false, error: rateLimitMessage(ipLimit.retryAfterSec) };
  }

  const phoneLimit = rateLimit({
    key: `${source}:phone:${phoneKey}`,
    limit: 6,
    windowMs: 60 * 60 * 1000,
  });
  if (!phoneLimit.ok) {
    return { ok: false, error: rateLimitMessage(phoneLimit.retryAfterSec) };
  }

  if (isHoneypotFilled(input.website)) {
    return {
      ok: false,
      error:
        source === "contact"
          ? "Could not send your message."
          : "Could not save your booking.",
    };
  }

  try {
    const site = await getSiteConfig();
    const booking = await createBooking({ ...input, source });

    const whatsappMessage =
      source === "contact"
        ? [
            `Hello ${site.name}! I have an enquiry.`,
            "",
            `Name: ${booking.name}`,
            `Phone: ${booking.phone}`,
            `Subject: ${booking.serviceType}`,
            booking.location !== "Not specified"
              ? `Location: ${booking.location}`
              : null,
            booking.message ? `Message: ${booking.message}` : null,
            "",
            `Reference: ${booking.id.slice(0, 8).toUpperCase()}`,
          ]
            .filter(Boolean)
            .join("\n")
        : [
            bookingMessage(
              {
                name: booking.name,
                phone: booking.phone,
                serviceType: booking.serviceType,
                location: booking.location,
                preferredDate: booking.preferredDate ?? "",
                message: booking.message,
              },
              site.name,
            ),
            "",
            `Booking reference: ${booking.id.slice(0, 8).toUpperCase()}`,
            `(Saved for ${site.shortName} team)`,
          ].join("\n");

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return {
      ok: true,
      bookingId: booking.id,
      whatsappMessage,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save your request.";
    const safe =
      message.includes("phone") ||
      message.includes("valid") ||
      message.includes("required") ||
      message.includes("service")
        ? message
        : source === "contact"
          ? "Could not send your message. Please try again."
          : "Could not save your booking. Please try again.";
    return { ok: false, error: safe };
  }
}
