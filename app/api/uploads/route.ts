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
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose an image file to upload." },
      { status: 400 },
    );
  }

  try {
    const result = await saveUploadedImage(file);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    const safe =
      message.includes("JPEG") ||
      message.includes("5 MB") ||
      message.includes("writable") ||
      message.includes("save") ||
      message.includes("object storage") ||
      message.includes("Neon") ||
      message.includes("https image URL") ||
      message.includes("STORAGE_")
        ? message
        : "Upload failed.";
    return NextResponse.json({ error: safe }, { status: 400 });
  }
}
