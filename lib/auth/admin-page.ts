import { requireAdmin } from "@/lib/auth/require-admin";

/** Call at the top of every admin page that loads business data. */
export async function ensureAdminPage() {
  return requireAdmin();
}

export function safeAdminCallbackUrl(raw: string | null | undefined): string {
  const value = (raw ?? "/admin").trim();
  if (!value.startsWith("/admin")) return "/admin";
  if (value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/admin";
  }
  // Only allow /admin or /admin/...
  if (value !== "/admin" && !value.startsWith("/admin/")) return "/admin";
  return value;
}
