import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { listUploadedMedia } from "@/lib/uploads";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await listUploadedMedia();
  return NextResponse.json({ items });
}
