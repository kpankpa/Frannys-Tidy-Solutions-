import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id);

  return <ProductDetail product={product} related={related} />;
}
