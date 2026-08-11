import "../lib/db/load-env";
import {
  getObjectStorageConfig,
  listObjects,
  putObject,
} from "../lib/object-storage";
import { saveUploadedImage } from "../lib/uploads";

/** Minimal valid 1x1 PNG (red pixel). */
const TEST_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function verifyPublicUrl(url: string) {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(
      `Public URL returned ${response.status}. Bucket may need public_read access.`,
    );
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Expected image/* but got ${contentType || "unknown"}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 50) {
    throw new Error("Downloaded image looks too small.");
  }
  return { contentType, sizeBytes: bytes.length };
}

async function main() {
  const config = getObjectStorageConfig();
  if (!config) {
    console.error("FAIL: Object storage is not configured in .env.local");
    process.exit(1);
  }

  console.log("Neon storage image upload test");
  console.log(`  Bucket: ${config.bucket}`);
  console.log(`  Public base: ${config.publicBaseUrl}\n`);

  const key = `media/frannys-upload-test-${Date.now()}.png`;

  try {
    console.log("1. putObject (direct S3)...");
    const uploaded = await putObject({
      key,
      body: TEST_PNG,
      contentType: "image/png",
    });
    console.log("   Uploaded:", uploaded.url);

    console.log("2. Verify public URL...");
    const fetched = await verifyPublicUrl(uploaded.url);
    console.log(`   OK: ${fetched.sizeBytes} bytes, ${fetched.contentType}`);

    console.log("3. saveUploadedImage (admin upload path)...");
    const file = new File([TEST_PNG], "frannys-test.png", {
      type: "image/png",
    });
    const viaApi = await saveUploadedImage(file);
    console.log("   Uploaded:", viaApi.url);
    const fetchedApi = await verifyPublicUrl(viaApi.url);
    console.log(`   OK: ${fetchedApi.sizeBytes} bytes, ${fetchedApi.contentType}`);

    console.log("4. List media/ objects...");
    const listed = await listObjects("media/");
    console.log(`   ${listed.length} object(s) in bucket:`);
    for (const item of listed.slice(0, 10)) {
      console.log(`   - ${item.key} (${item.sizeBytes} B)`);
    }
    if (listed.length > 10) {
      console.log(`   ... and ${listed.length - 10} more`);
    }

    console.log("\nImage upload test passed.");
    console.log("Test images were left in the bucket for you to inspect in Neon console.");
    console.log("Primary URL:", uploaded.url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\nFAIL:", message);
    if (message.includes("403") || message.includes("AccessDenied")) {
      console.error("Hint: check storage credentials and bucket name.");
    }
    if (message.includes("public_read") || message.includes("404")) {
      console.error(
        "Hint: set bucket access to public_read in Neon console so images load on the site.",
      );
    }
    process.exit(1);
  }
}

main();
