import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024;

export type UploadResult = {
  url: string;
  filename: string;
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
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
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
