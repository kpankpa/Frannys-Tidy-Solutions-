import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { listCategories, listProducts } from "@/lib/db/products";

export default async function ShopPage() {
  const [products, categoryRows] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <ShopCatalog
      products={products}
      categories={categoryRows.map((c) => c.name)}
    />
  );
}
