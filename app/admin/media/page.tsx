import Link from "next/link";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";
import { MediaLibraryUpload } from "@/components/admin/MediaLibraryUpload";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { getUploadStorageMode, listUploadedMedia } from "@/lib/uploads";

export default async function AdminMediaPage() {
  await ensureAdminPage();
  const items = await listUploadedMedia();
  const storageMode = getUploadStorageMode();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Media library</h1>
          <p className="mt-1 text-sm text-muted">
            Upload and reuse product images ({items.length}). Storage:{" "}
            {storageMode === "object"
              ? "Neon / S3 bucket"
              : "local disk (public/uploads)"}
            .
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-primary hover:underline"
        >
          Products
        </Link>
      </div>

      <MediaLibraryUpload />
      <MediaLibraryGrid items={items} />
    </div>
  );
}
