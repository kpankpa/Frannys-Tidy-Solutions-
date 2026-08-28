"use client";

export function AdminFormFeedback({
  error,
  success,
  info,
}: {
  error?: string;
  success?: string;
  info?: string;
}) {
  if (error) {
    return (
      <p
        className="rounded-[8px] bg-danger/10 px-3 py-2 text-xs text-danger"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (success) {
    return (
      <p
        className="rounded-[8px] bg-success/10 px-3 py-2 text-xs text-success"
        role="status"
      >
        {success}
      </p>
    );
  }

  if (info) {
    return (
      <p
        className="rounded-[8px] bg-surface-muted px-3 py-2 text-xs text-muted"
        role="status"
      >
        {info}
      </p>
    );
  }

  return null;
}
