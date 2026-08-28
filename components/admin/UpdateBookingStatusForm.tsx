"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import { BOOKING_PIPELINE } from "@/lib/booking-status";
import {
  updateBookingStatusAction,
  type UpdateBookingStatusState,
} from "@/server/admin";

function buildFeedback(state: UpdateBookingStatusState | null) {
  if (!state) return null;

  if (!state.ok) {
    return { error: state.error };
  }

  if (state.unchanged) {
    return { info: `Status is already ${state.statusLabel}.` };
  }

  return { success: `Booking updated to ${state.statusLabel}.` };
}

export function UpdateBookingStatusForm({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateBookingStatusAction, null);
  const feedback = buildFeedback(state);

  useEffect(() => {
    if (state?.ok && !state.unchanged) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex min-w-[12rem] flex-col gap-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="flex flex-wrap gap-2">
        <select
          name="status"
          defaultValue={currentStatus}
          key={`${bookingId}-${currentStatus}`}
          className="rounded-[8px] border border-border px-2 py-1.5 text-xs"
        >
          {BOOKING_PIPELINE.map((step) => (
            <option key={step.key} value={step.key}>
              {step.label}
            </option>
          ))}
        </select>
        <PendingSaveButton />
      </div>
      <AdminFormFeedback {...(feedback ?? {})} />
    </form>
  );
}
