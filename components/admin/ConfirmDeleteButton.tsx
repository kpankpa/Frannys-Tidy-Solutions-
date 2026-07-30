"use client";

import { useState, useTransition } from "react";

type ConfirmDeleteButtonProps = {
  action: (formData: FormData) => Promise<void> | void;
  hiddenFields?: Record<string, string>;
  label?: string;
  confirmMessage?: string;
  className?: string;
};

export function ConfirmDeleteButton({
  action,
  hiddenFields = {},
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
  className = "text-danger hover:underline",
}: ConfirmDeleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={className}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted">{confirmMessage}</span>
      <form
        action={(formData) => {
          startTransition(async () => {
            await action(formData);
            setConfirming(false);
          });
        }}
        className="inline"
      >
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <button
          type="submit"
          disabled={pending}
          className="font-semibold text-danger hover:underline disabled:opacity-60"
        >
          {pending ? "Deleting..." : "Yes, delete"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-muted hover:underline"
      >
        Cancel
      </button>
    </span>
  );
}
