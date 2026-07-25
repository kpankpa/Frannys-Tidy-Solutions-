import { redirect } from "next/navigation";
import { requireAdmin as requireAdminSession } from "@/lib/auth/session";

/** Pages / server actions: send unauthenticated callers to login. */
export async function requireAdmin() {
  const session = await requireAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/** API routes: return null so the handler can respond with 401 JSON. */
export async function requireAdminApi() {
  return requireAdminSession();
}
