"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/PageSpinner";

export function PendingSaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-[8px] bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <Spinner size="sm" className="border-white/30 border-t-white" />
          Saving...
        </>
      ) : (
        label
      )}
    </button>
  );
}
