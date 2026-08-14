import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductReviewAdminList } from "@/components/admin/ProductReviewAdminList";
import { getProductByDbId, listCategories } from "@/lib/db/products";
import { ensureAdminPage } from "@/lib/auth/admin-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  await ensureAdminPage();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByDbId(id),
    listCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="mt-1 text-sm text-muted">{product.name}</p>
        </div>
        <Link href="/admin/products" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>
      <ProductForm
        categories={categories}
        product={{
          dbId: product.dbId,
          name: product.name,
          slug: product.id,
          description: product.description,
          longDescription: product.longDescription,
          features: product.features,
          priceCedis: product.compareAtPrice ?? product.price,
          salePriceCedis: product.compareAtPrice ? product.price : null,
          categoryName: product.category,
          rating: product.rating,
          reviewsCount: product.reviews,
          inStock: product.inStock,
          stockQuantity: product.stockQuantity,
          badge: product.badge ?? "",
          badgeExpiresAt: product.badgeExpiresAt ?? "",
          imageAlt: product.imageAlt,
          imageUrls: product.images,
        }}
      />
      <ProductReviewAdminList productDbId={product.dbId} />
      <p className="text-center text-sm text-muted">
        <Link
          href={`/shop/${product.id}`}
          target="_blank"
          className="text-primary hover:underline"
        >
          Open live shop page
        </Link>
      </p>
    </div>
  );
}
