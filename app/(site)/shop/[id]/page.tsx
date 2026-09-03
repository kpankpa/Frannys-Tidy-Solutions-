import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/shop/ProductDetail";
import {
  getCachedProductBySlug,
  getCachedRelatedProducts,
} from "@/lib/db/cached-public";
import { listApprovedProductReviews } from "@/lib/db/product-reviews";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProductBySlug(id).catch(() => null);
  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/shop/${id}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getCachedProductBySlug(id);

  if (!product) {
    notFound();
  }

  const related = await getCachedRelatedProducts(product.id);
  const reviewRows = await listApprovedProductReviews(product.dbId);
  const reviews = reviewRows.map((review) => ({
    id: review.id,
    authorName: review.authorName,
    comment: review.comment,
    rating: review.rating,
    createdAt: review.createdAt.toISOString(),
  }));

  return <ProductDetail product={product} related={related} reviews={reviews} />;
}
