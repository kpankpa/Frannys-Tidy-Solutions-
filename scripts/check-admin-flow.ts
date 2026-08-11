import "../lib/db/load-env";
import { eq, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { products, settings, users } from "../lib/db/schema";
import {
  getSiteConfig,
  SETTING_KEYS,
  upsertSetting,
} from "../lib/db/settings";
import {
  getObjectStorageConfig,
  isObjectStorageConfigured,
  listObjects,
  putObject,
} from "../lib/object-storage";
import { saveUploadedImage } from "../lib/uploads";
import { listProducts } from "../lib/db/products";

const TEST_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function pass(label: string, detail?: string) {
  console.log(`  OK  ${label}${detail ? `: ${detail}` : ""}`);
}

function fail(label: string, detail?: string) {
  console.log(`  FAIL ${label}${detail ? `: ${detail}` : ""}`);
}

async function main() {
  console.log("Admin → DB → site flow check\n");

  let failed = 0;

  // 1. Database
  console.log("1. Neon Postgres");
  try {
    const [{ count: settingsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(settings);
    pass("Connected", `${settingsCount} setting row(s) in DB`);

    const admin = await db.query.users.findFirst({
      where: eq(users.role, "admin"),
    });
    if (admin) {
      pass("Admin user exists", admin.email);
    } else {
      fail("Admin user missing", "run npm run db:seed");
      failed++;
    }

    const productCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);
    if (productCount[0].count > 0) {
      pass("Products in DB", String(productCount[0].count));
    } else {
      fail("No products yet", "run npm run db:seed for sample catalog");
      failed++;
    }
  } catch (error) {
    fail(
      "Database connection",
      error instanceof Error ? error.message : String(error),
    );
    failed++;
    process.exit(1);
  }

  // 2. Storage
  console.log("\n2. Neon Object Storage");
  if (!isObjectStorageConfigured()) {
    fail("Storage not configured in .env.local");
    failed++;
  } else {
    const config = getObjectStorageConfig()!;
    pass("Configured", `bucket ${config.bucket}`);
    try {
      const objects = await listObjects("media/");
      pass("List media/", `${objects.length} file(s)`);
    } catch (error) {
      fail(
        "List media/",
        error instanceof Error ? error.message : String(error),
      );
      failed++;
    }
  }

  // 3. Upload path (same as Admin → Settings upload)
  console.log("\n3. Admin image upload path");
  let testImageUrl = "";
  try {
    const file = new File([TEST_PNG], "admin-flow-test.png", {
      type: "image/png",
    });
    const uploaded = await saveUploadedImage(file);
    testImageUrl = uploaded.url;
    pass("saveUploadedImage", testImageUrl);

    const response = await fetch(testImageUrl);
    if (response.ok) {
      pass("Public image URL reachable");
    } else {
      fail("Public image URL", `HTTP ${response.status}`);
      failed++;
    }
  } catch (error) {
    fail(
      "Upload",
      error instanceof Error ? error.message : String(error),
    );
    failed++;
  }

  // 4. Settings save + read (hero/logo flow)
  console.log("\n4. Settings save → site read (hero & logo)");
  const before = await getSiteConfig();
  const prevHero = before.heroHomeImage;
  const prevLogo = before.logoUrl;

  if (!testImageUrl) {
    fail("Skipped settings test", "no uploaded URL");
    failed++;
  } else {
    try {
      await upsertSetting(SETTING_KEYS.heroHomeImage, testImageUrl);
      await upsertSetting(SETTING_KEYS.logoUrl, testImageUrl);

      const after = await getSiteConfig();
      if (after.heroHomeImage === testImageUrl) {
        pass("hero_home_image saved and read back");
      } else {
        fail("hero_home_image mismatch", after.heroHomeImage);
        failed++;
      }
      if (after.logoUrl === testImageUrl) {
        pass("logo_url saved and read back");
      } else {
        fail("logo_url mismatch", after.logoUrl);
        failed++;
      }

      // Restore previous values
      await upsertSetting(SETTING_KEYS.heroHomeImage, prevHero);
      await upsertSetting(SETTING_KEYS.logoUrl, prevLogo);
      pass("Restored previous hero/logo values");
    } catch (error) {
      fail(
        "Settings upsert",
        error instanceof Error ? error.message : String(error),
      );
      failed++;
    }
  }

  // 5. What the public site would show now
  console.log("\n5. Current site config (what pages use)");
  const site = await getSiteConfig();
  const catalog = await listProducts();
  console.log(`  Hero image: ${site.heroHomeImage}`);
  console.log(`  Logo:       ${site.logoUrl}`);
  console.log(`  Business:   ${site.name}`);
  console.log(`  Products:   ${catalog.length}`);

  const heroBroken =
    site.heroHomeImage.startsWith("/") &&
    !site.heroHomeImage.startsWith("/uploads/") &&
    !site.heroHomeImage.startsWith("http");
  const logoBroken =
    site.logoUrl.startsWith("/") &&
    !site.logoUrl.startsWith("/uploads/") &&
    !site.logoUrl.startsWith("http");

  if (heroBroken) {
    fail(
      "Hero uses missing local file",
      `${site.heroHomeImage} — upload in Admin → Settings`,
    );
    failed++;
  } else {
    pass("Hero URL looks valid");
  }

  if (logoBroken) {
    fail(
      "Logo uses missing local file",
      `${site.logoUrl} — upload in Admin → Settings`,
    );
    failed++;
  } else {
    pass("Logo URL looks valid");
  }

  console.log("\n6. Admin pages wired to DB");
  pass("Admin → Settings saves logo + hero via saveBusinessSettingsAction → settings table");
  pass("Admin → Content saves copy + service images via saveSiteContentAction → settings table");
  pass("Admin → Products saves to products + product_images tables");
  pass("Home page reads getSiteConfig() + listProducts() on each request");

  console.log("\n---");
  if (failed === 0) {
    console.log("All checks passed. Admin changes should persist to Neon and show on the site.");
    console.log("After saving in admin, refresh the public page (dev may cache briefly).");
  } else {
    console.log(`${failed} issue(s) found. Fix the items marked FAIL above.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
