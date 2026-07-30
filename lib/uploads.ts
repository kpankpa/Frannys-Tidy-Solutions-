import { randomBytes } from "crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { productImages } from "@/lib/db/schema";

const MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;

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

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png", ext: "png" };
  }

  // GIF
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { mime: "image/gif", ext: "gif" };
  }

  // WebP (RIFF....WEBP)
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

/**
 * Saves an image under public/uploads and returns a site-relative URL.
 * Works on local disk / Docker / VPS. Ephemeral on most serverless hosts.
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

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${detected.ext}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      throw new Error(
        "This host cannot write upload files. Paste an image URL instead, or deploy with a writable disk volume.",
      );
    }
    throw new Error("Could not save the image. Please try again.");
  }

  return { url: `/uploads/${filename}`, filename };
}

export async function listUploadedMedia(): Promise<MediaLibraryItem[]> {
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

  const usageRows = await db.select({ url: productImages.url }).from(productImages);
  const usage = new Map<string, number>();
  for (const row of usageRows) {
    if (!row.url.startsWith("/uploads/")) continue;
    usage.set(row.url, (usage.get(row.url) ?? 0) + 1);
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
  if (!SAFE_FILENAME.test(filename) || filename.includes("..")) {
    throw new Error("Invalid file name.");
  }

  const url = `/uploads/${filename}`;
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
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";
    if (code === "ENOENT") return;
    throw new Error("Could not delete that file.");
  }
}
