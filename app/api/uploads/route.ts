import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { saveUploadedImage } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = await getClientIp();
  const limit = rateLimit({
    key: `upload:ip:${ip}`,
    limit: 30,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: rateLimitMessage(limit.retryAfterSec) },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("file")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    const single = formData.get("file");
    if (single instanceof File) {
      files.push(single);
    }
  }

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Choose an image file to upload." },
      { status: 400 },
    );
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const result = await saveUploadedImage(file);
      urls.push(result.url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      errors.push(message);
    }
  }

  if (urls.length === 0) {
    const safe =
      errors[0]?.includes("JPEG") ||
      errors[0]?.includes("5 MB") ||
      errors[0]?.includes("writable") ||
      errors[0]?.includes("save") ||
      errors[0]?.includes("object storage") ||
      errors[0]?.includes("Neon") ||
      errors[0]?.includes("https image URL") ||
      errors[0]?.includes("STORAGE_")
        ? errors[0]
        : "Upload failed.";
    return NextResponse.json({ error: safe, errors }, { status: 400 });
  }

  if (urls.length === 1) {
    return NextResponse.json({ url: urls[0], urls, errors });
  }

  return NextResponse.json({ urls, errors });
}
