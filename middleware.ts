import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdmin =
    request.auth?.user?.role === "admin" && Boolean(request.auth?.user);

  // Only bounce real admins away from the login screen (avoids role loops).
  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
