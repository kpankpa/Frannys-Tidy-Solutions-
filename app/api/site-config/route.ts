import { NextResponse } from "next/server";
import { publicCacheControl, SITE_CACHE_SECONDS } from "@/lib/cache";
import { getCachedSiteConfig } from "@/lib/db/cached-public";

/** Public cart only needs delivery fee — keep the rest off this endpoint. */
export async function GET() {
  const config = await getCachedSiteConfig();
  return NextResponse.json(
    {
      deliveryFee: config.deliveryFee,
    },
    {
      headers: {
        "Cache-Control": publicCacheControl(SITE_CACHE_SECONDS),
      },
    },
  );
}
