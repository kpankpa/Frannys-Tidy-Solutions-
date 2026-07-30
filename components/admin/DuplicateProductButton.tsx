"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { duplicateProductAction } from "@/server/products";

export function DuplicateProductButton({ dbId }: { dbId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-muted hover:text-primary hover:underline disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          const formData = new FormData();
          formData.set("dbId", dbId);
          const result = await duplicateProductAction(formData);
          if (result.ok && result.id) {
            router.push(`/admin/products/${result.id}`);
            router.refresh();
          }
        });
      }}
    >
      {pending ? "Copying..." : "Duplicate"}
    </button>
  );
}
