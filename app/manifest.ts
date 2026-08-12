import type { MetadataRoute } from "next";
import { SITE, SITE_BRAND_ICON } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#083e56",
    theme_color: "#083e56",
    icons: [
      {
        src: SITE_BRAND_ICON,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
