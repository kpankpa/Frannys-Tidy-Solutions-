"use client";

import dynamic from "next/dynamic";
import type { AdminImageFieldProps } from "@/components/admin/AdminImageField";

const AdminImageFieldInner = dynamic(
  () =>
    import("@/components/admin/AdminImageField").then(
      (mod) => mod.AdminImageField,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2" aria-hidden>
        <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
        <div className="flex gap-3">
          <div className="h-20 w-28 shrink-0 animate-pulse rounded-[8px] bg-surface-muted" />
          <div className="h-10 min-w-0 flex-1 animate-pulse rounded-[8px] bg-surface-muted" />
        </div>
      </div>
    ),
  },
);

export function AdminImageField(props: AdminImageFieldProps) {
  return <AdminImageFieldInner {...props} />;
}
