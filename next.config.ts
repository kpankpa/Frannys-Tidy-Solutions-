import type { NextConfig } from "next";
import { buildLegacyRedirects } from "./lib/legacy-redirects";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.aws.neon.tech",
      },
      {
        protocol: "https",
        hostname: "*.neon.tech",
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return buildLegacyRedirects();
  },
  async headers() {
    const staticAssetCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Content-Disposition",
            value: "inline",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/flyers/:path*",
        headers: staticAssetCache,
      },
      {
        source: "/people-images/:path*",
        headers: staticAssetCache,
      },
      {
        source: "/:file(.*\\.(?:jpg|jpeg|png|webp|gif|svg|ico)$)",
        headers: staticAssetCache,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
