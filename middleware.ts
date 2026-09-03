import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth/config";
import { canonicalSiteHostname } from "@/lib/seo";

const { auth } = NextAuth(authConfig);

function redirectToCanonicalHost(request: NextRequest) {
  const canonicalHost = canonicalSiteHostname();
  if (!canonicalHost) return null;

  const requestHost = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (!requestHost || requestHost === canonicalHost) return null;

  const bareHost = canonicalHost.startsWith("www.")
    ? canonicalHost.slice(4)
    : canonicalHost;
  const wwwHost = canonicalHost.startsWith("www.")
    ? canonicalHost
    : `www.${canonicalHost}`;

  const isKnownHost = requestHost === bareHost || requestHost === wwwHost;
  if (!isKnownHost || requestHost === canonicalHost) return null;

  const url = request.nextUrl.clone();
  url.hostname = canonicalHost;
  url.protocol = "https:";
  return NextResponse.redirect(url, 308);
}

export default auth((request) => {
  const hostRedirect = redirectToCanonicalHost(request);
  if (hostRedirect) return hostRedirect;

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdmin =
    request.auth?.user?.role === "admin" && Boolean(request.auth?.user);

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|html)$).*)",
  ],
};
