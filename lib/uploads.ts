import { randomBytes } from "crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { productImages } from "@/lib/db/schema";
import {
  deleteObject,
  getObjectStorageConfig,
  isObjectStorageConfigured,
  listObjects,
  publicUrlForKey,
  putObject,
} from "@/lib/object-storage";

const MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;
const SAFE_STORAGE_KEY = /^media\/[A-Za-z0-9._-]+$/;

export type UploadResult = {
  url: string;
  filename: string;
};

export type MediaLibraryItem = {
  filename: string;
  url: string;
  sizeBytes: number;
  modifiedAt: string;
  usedByProducts: number;
};

type DetectedImage = {
  mime: string;
  ext: string;
};

function detectImage(buffer: Buffer): DetectedImage | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png", ext: "png" };
  }

  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { mime: "image/gif", ext: "gif" };
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }

  return null;
}

function isReadOnlyHostError(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  if (
    code === "EROFS" ||
    code === "EACCES" ||
    code === "EPERM" ||
    code === "ENOENT"
  ) {
    return true;
  }
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") {
    return true;
  }
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    message.includes("read-only") ||
    message.includes("erofs") ||
    message.includes("eacces")
  );
}

function remoteStorageHint() {
  return (
    "This host cannot save uploads to local disk. Add Neon Object Storage " +
    "(or any S3-compatible bucket) env vars, or paste an https image URL on the product instead. " +
    "See docs/NEON_SETUP.md."
  );
}

/**
 * Saves an image to Neon/S3 when configured, otherwise public/uploads.
 */
export async function saveUploadedImage(file: File): Promise<UploadResult> {
  if (file.size <= 0 || file.size > MAX_BYTES) {
    throw new Error("Image must be between 1 byte and 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImage(buffer);
  if (!detected) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }

  const basename = `${Date.now()}-${randomBytes(6).toString("hex")}.${detected.ext}`;

  if (isObjectStorageConfigured()) {
    try {
      const key = `media/${basename}`;
      const result = await putObject({
        key,
        body: buffer,
        contentType: detected.mime,
      });
      return { url: result.url, filename: key };
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Unknown storage error";
      throw new Error(
        `Could not upload to object storage. Check STORAGE_* / Neon bucket credentials. (${detail})`,
      );
    }
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, basename), buffer);
  } catch (error) {
    if (isReadOnlyHostError(error)) {
      throw new Error(remoteStorageHint());
    }
    throw new Error(
      "Could not save the image. Configure object storage for this host, or try again.",
    );
  }

  return { url: `/uploads/${basename}`, filename: basename };
}

async function usageByUrl() {
  const usageRows = await db.select({ url: productImages.url }).from(productImages);
  const usage = new Map<string, number>();
  for (const row of usageRows) {
    usage.set(row.url, (usage.get(row.url) ?? 0) + 1);
  }
  return usage;
}

export async function listUploadedMedia(): Promise<MediaLibraryItem[]> {
  const usage = await usageByUrl();

  if (isObjectStorageConfigured()) {
    try {
      const objects = await listObjects("media/");
      return objects.map((object) => ({
        filename: object.key,
        url: object.url,
        sizeBytes: object.sizeBytes,
        modifiedAt: object.modifiedAt,
        usedByProducts: usage.get(object.url) ?? 0,
      }));
    } catch {
      return [];
    }
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    return [];
  }

  let names: string[] = [];
  try {
    names = await readdir(UPLOAD_DIR);
  } catch {
    return [];
  }

  const items: MediaLibraryItem[] = [];
  for (const name of names) {
    if (name.startsWith(".") || !SAFE_FILENAME.test(name)) continue;
    if (!/\.(jpe?g|png|gif|webp)$/i.test(name)) continue;

    const fullPath = path.join(UPLOAD_DIR, name);
    try {
      const info = await stat(fullPath);
      if (!info.isFile()) continue;
      const url = `/uploads/${name}`;
      items.push({
        filename: name,
        url,
        sizeBytes: info.size,
        modifiedAt: info.mtime.toISOString(),
        usedByProducts: usage.get(url) ?? 0,
      });
    } catch {
      // skip unreadable entries
    }
  }

  return items.sort(
    (a, b) =>
      new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
  );
}

export async function deleteUploadedMedia(filename: string): Promise<void> {
  const key = filename.trim();

  if (isObjectStorageConfigured()) {
    if (!SAFE_STORAGE_KEY.test(key) || key.includes("..")) {
      throw new Error("Invalid file name.");
    }

    const config = getObjectStorageConfig();
    if (!config) {
      throw new Error("Object storage is not configured.");
    }
    const url = publicUrlForKey(config, key);
    const [inUse] = await db
      .select({ id: productImages.id })
      .from(productImages)
      .where(eq(productImages.url, url))
      .limit(1);
    if (inUse) {
      throw new Error(
        "This image is used by a product. Remove it from products first.",
      );
    }

    await deleteObject(key);
    return;
  }

  if (!SAFE_FILENAME.test(key) || key.includes("..")) {
    throw new Error("Invalid file name.");
  }

  const url = `/uploads/${key}`;
  const [inUse] = await db
    .select({ id: productImages.id })
    .from(productImages)
    .where(eq(productImages.url, url))
    .limit(1);

  if (inUse) {
    throw new Error(
      "This image is used by a product. Remove it from products first.",
    );
  }

  try {
    await unlink(path.join(UPLOAD_DIR, key));
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "ENOENT") return;
    throw new Error("Could not delete that file.");
  }
}

export function getUploadStorageMode(): "object" | "local" {
  return isObjectStorageConfigured() ? "object" : "local";
}
