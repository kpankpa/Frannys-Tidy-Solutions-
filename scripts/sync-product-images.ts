import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import "../lib/db/load-env";
import { db } from "../lib/db";
import { productImages, products } from "../lib/db/schema";
import { putObject, isObjectStorageConfigured } from "../lib/object-storage";
import {
  mimeForProductFile,
  PRODUCT_IMAGE_FILES,
  publicProductImagePath,
  storageKeyForProduct,
} from "../lib/product-images";

async function main() {
  if (!isObjectStorageConfigured()) {
    console.error("FAIL: Neon storage is not configured in .env.local");
    process.exit(1);
  }

  console.log("Syncing product images to Neon storage...\n");

  let ok = 0;
  let failed = 0;

  for (const [slug, relativePath] of Object.entries(PRODUCT_IMAGE_FILES)) {
    const localPath = path.join(process.cwd(), "public", relativePath);

    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!product) {
      console.log(`  SKIP ${slug}: product not found in database`);
      failed++;
      continue;
    }

    let body: Buffer;
    try {
      body = await readFile(localPath);
    } catch {
      console.log(`  FAIL ${slug}: missing file public/${relativePath}`);
      failed++;
      continue;
    }

    const key = storageKeyForProduct(slug, relativePath);
    const contentType = mimeForProductFile(relativePath);

    try {
      const uploaded = await putObject({ key, body, contentType });

      await db.transaction(async (tx) => {
        await tx
          .delete(productImages)
          .where(eq(productImages.productId, product.id));
        await tx.insert(productImages).values({
          productId: product.id,
          url: uploaded.url,
          sortOrder: 0,
        });
      });

      console.log(`  OK  ${slug}`);
      console.log(`      ${uploaded.url}`);
      ok++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  FAIL ${slug}: ${message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${ok} updated, ${failed} skipped/failed.`);
  if (ok === 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
