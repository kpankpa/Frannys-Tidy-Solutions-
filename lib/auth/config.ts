import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database imports).
 * Used by middleware for session checks.
 */
export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const isAdmin = auth?.user?.role === "admin";
      const isLoginPage = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");

      if (!isAdminArea) return true;
      if (isLoginPage) return true;
      return isLoggedIn && isAdmin;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "user";
        token.roleCheckedAt = Date.now();
      }
      if (!token.role) {
        token.role = "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
