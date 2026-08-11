import "../lib/db/load-env";
import {
  deleteObject,
  getObjectStorageConfig,
  listObjects,
  putObject,
} from "../lib/object-storage";

async function main() {
  const config = getObjectStorageConfig();
  if (!config) {
    console.error("FAIL: Object storage is not configured.");
    console.error("Set AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, STORAGE_S3_BUCKET in .env.local");
    process.exit(1);
  }

  console.log("Config OK");
  console.log(`  Bucket: ${config.bucket}`);
  console.log(`  Region: ${config.region}`);
  console.log(`  Endpoint: ${config.endpoint}`);
  console.log(`  Public base: ${config.publicBaseUrl}`);

  const testKey = `media/connection-test-${Date.now()}.txt`;
  const body = Buffer.from("Frannys storage connection test");

  try {
    const uploaded = await putObject({
      key: testKey,
      body,
      contentType: "text/plain",
    });
    console.log("Upload OK:", uploaded.url);

    const listed = await listObjects("media/");
    console.log(`List OK: ${listed.length} object(s) under media/`);

    await deleteObject(testKey);
    console.log("Delete OK: cleaned up test file");

    console.log("\nStorage connection test passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\nFAIL:", message);
    if (message.includes("AccessDenied") || message.includes("403")) {
      console.error("Hint: credential may need storage:write scope, or bucket name is wrong.");
    }
    if (message.includes("NoSuchBucket")) {
      console.error("Hint: create bucket in Neon console and set STORAGE_S3_BUCKET.");
    }
    process.exit(1);
  }
}

main();
