"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteUploadedMedia } from "@/lib/uploads";

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const filename = String(formData.get("filename") ?? "").trim();
  if (!filename) {
    return { ok: false as const, error: "Missing file." };
  }

  try {
    await deleteUploadedMedia(filename);
    revalidatePath("/admin/media");
    revalidatePath("/admin/products");
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Could not delete file.",
    };
  }
}
