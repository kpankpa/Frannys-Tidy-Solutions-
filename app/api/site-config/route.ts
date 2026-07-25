import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/db/settings";

/** Public cart only needs delivery fee — keep the rest off this endpoint. */
export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json({
    deliveryFee: config.deliveryFee,
  });
}
