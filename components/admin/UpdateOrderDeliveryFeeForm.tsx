"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import { formatPrice } from "@/lib/products";
import {
  updateOrderDeliveryFeeAction,
  type UpdateOrderDeliveryFeeState,
} from "@/server/admin";

function buildFeedback(state: UpdateOrderDeliveryFeeState | null) {
  if (!state) return null;

  if (!state.ok) {
    return { error: state.error };
  }

  if (state.unchanged) {
    return {
      info: `Delivery fee is already ${formatPrice(state.deliveryCedis)}.`,
    };
  }

  return {
    success: `Delivery fee saved: ${formatPrice(state.deliveryCedis)}.`,
  };
}

export function UpdateOrderDeliveryFeeForm({
  orderNumber,
  deliveryCedis,
  defaultDeliveryFeeCedis,
}: {
  orderNumber: string;
  deliveryCedis: number;
  defaultDeliveryFeeCedis: number;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateOrderDeliveryFeeAction, null);
  const feedback = buildFeedback(state);
  const inputDefault =
    deliveryCedis > 0 ? deliveryCedis : defaultDeliveryFeeCedis;

  useEffect(() => {
    if (state?.ok && !state.unchanged) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-border pt-4">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <label className="block">
        <span className="text-sm font-medium">Set delivery fee (GH₵)</span>
        <p className="mt-1 text-xs text-muted">
          Enter the fee you agreed with the customer on WhatsApp.
        </p>
        <input
          name="deliveryFeeCedis"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={inputDefault}
          key={`${orderNumber}-${inputDefault}`}
          className="mt-2 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm"
        />
      </label>
      <PendingSaveButton label="Save delivery fee" />
      <AdminFormFeedback {...(feedback ?? {})} />
    </form>
  );
}
