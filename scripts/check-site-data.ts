import "../lib/db/load-env";
import { getSiteConfig } from "../lib/db/settings";
import { listProducts } from "../lib/db/products";

async function main() {
  const [site, products] = await Promise.all([
    getSiteConfig(),
    listProducts(),
  ]);
  console.log("hero:", site.heroHomeImage);
  console.log("logo:", site.logoUrl);
  console.log("products:", products.length);
  if (products[0]) {
    console.log("first product:", products[0].name);
    console.log("first image:", products[0].image);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
