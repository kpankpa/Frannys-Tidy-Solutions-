import Link from "next/link";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";
import { Button } from "@/components/ui/Button";
import { ensureAdminPage } from "@/lib/auth/admin-page";
import { listUploadedMedia } from "@/lib/uploads";

export default async function AdminMediaPage() {
  await ensureAdminPage();
  const items = await listUploadedMedia();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Media library</h1>
          <p className="mt-1 text-sm text-muted">
            Uploaded product images on this server ({items.length}). Reuse them
            when editing products.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/admin/products/new" size="sm">
            Upload via product
          </Button>
          <Link
            href="/admin/products"
            className="text-sm text-primary hover:underline"
          >
            Products
          </Link>
        </div>
      </div>

      <MediaLibraryGrid items={items} />
    </div>
  );
}
