"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { PendingSaveButton } from "@/components/admin/PendingSaveButton";
import {
  ORDER_ADMIN_STATUSES,
  orderStatusLabel,
} from "@/lib/order-status";
import {
  updateOrderStatusAction,
  type UpdateOrderStatusState,
} from "@/server/admin";

function resolveDefaultStatus(status: string) {
  return ORDER_ADMIN_STATUSES.some((step) => step.key === status)
    ? status
    : "pending";
}

function buildFeedback(state: UpdateOrderStatusState | null) {
  if (!state) return null;

  if (!state.ok) {
    return { error: state.error };
  }

  if (state.unchanged) {
    return {
      info: `Status is already ${state.statusLabel}.`,
    };
  }

  let success = `Order ${state.orderNumber} updated to ${state.statusLabel}.`;
  if (state.leftFilter) {
    success += " It no longer appears in this filtered list.";
  }

  return { success };
}

export function UpdateOrderStatusForm({
  orderNumber,
  currentStatus,
  variant = "detail",
  activeStatusFilter,
  showDetailsLink = false,
}: {
  orderNumber: string;
  currentStatus: string;
  variant?: "compact" | "detail";
  activeStatusFilter?: string;
  showDetailsLink?: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateOrderStatusAction, null);
  const compact = variant === "compact";
  const defaultStatus = resolveDefaultStatus(currentStatus);
  const feedback = buildFeedback(state);

  useEffect(() => {
    if (state?.ok && !state.unchanged) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className={compact ? "flex min-w-[16rem] flex-col gap-2" : "mt-4 space-y-3"}
    >
      <input type="hidden" name="orderNumber" value={orderNumber} />
      {activeStatusFilter ? (
        <input type="hidden" name="activeStatusFilter" value={activeStatusFilter} />
      ) : null}

      {compact ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <select
              name="status"
              defaultValue={defaultStatus}
              key={`${orderNumber}-${defaultStatus}`}
              className="rounded-[8px] border border-border px-2 py-1.5 text-xs"
            >
              {ORDER_ADMIN_STATUSES.map((step) => (
                <option key={step.key} value={step.key}>
                  {step.label}
                </option>
              ))}
            </select>
            <PendingSaveButton />
            {showDetailsLink ? (
              <Link
                href={`/admin/orders/${orderNumber}`}
                className="text-xs text-muted hover:text-primary hover:underline"
              >
                Details
              </Link>
            ) : null}
          </div>
          <input
            name="note"
            placeholder="Optional note for timeline"
            className="w-full rounded-[8px] border border-border px-2 py-1.5 text-xs"
          />
        </>
      ) : (
        <>
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select
              name="status"
              defaultValue={defaultStatus}
              key={`${orderNumber}-${defaultStatus}`}
              className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm"
            >
              {ORDER_ADMIN_STATUSES.map((step) => (
                <option key={step.key} value={step.key}>
                  {step.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Internal note (optional)</span>
            <input
              name="note"
              placeholder="e.g. Called customer, payment confirmed"
              className="mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm"
            />
          </label>
          <PendingSaveButton />
        </>
      )}

      <AdminFormFeedback {...(feedback ?? {})} />

      {compact && activeStatusFilter ? (
        <p className="text-[11px] text-muted">
          Viewing {orderStatusLabel(activeStatusFilter)} orders. Changing status
          may remove this row from the list.
        </p>
      ) : null}
    </form>
  );
}
