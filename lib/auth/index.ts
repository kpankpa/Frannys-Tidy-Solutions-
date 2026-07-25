import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { authConfig } from "./config";
import "./types";

if (
  process.env.NODE_ENV === "production" &&
  (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)
) {
  throw new Error(
    "AUTH_SECRET must be set to a strong value (32+ chars) in production.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        // Lazy import keeps middleware/Edge free of Postgres drivers.
        const { db } = await import("@/lib/db");
        const { users } = await import("@/lib/db/schema");

        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase().trim()),
        });

        if (!user || user.role !== "admin") {
          return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role ?? "user";
        token.roleCheckedAt = Date.now();
        return token;
      }

      const checkedAt =
        typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0;
      const stale = Date.now() - checkedAt > 5 * 60 * 1000;

      if ((trigger === "update" || stale) && token.sub) {
        try {
          const { db } = await import("@/lib/db");
          const { users } = await import("@/lib/db/schema");
          const row = await db.query.users.findFirst({
            where: eq(users.id, token.sub),
            columns: { role: true },
          });
          token.role = row?.role === "admin" ? "admin" : "user";
          token.roleCheckedAt = Date.now();
        } catch {
          // Keep existing role if DB is briefly unavailable.
        }
      }

      if (!token.role) {
        token.role = "user";
      }
      return token;
    },
  },
});
