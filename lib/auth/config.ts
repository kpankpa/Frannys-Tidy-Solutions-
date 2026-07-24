import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database imports).
 * Used by middleware for session checks.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const isLoginPage = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");

      if (!isAdminArea) return true;
      if (isLoginPage) return true;
      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
