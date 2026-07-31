import { auth, signOut } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getDefaultSiteConfig, getSiteConfig } from "@/lib/db/settings";
import { getAdminNavBadges } from "@/lib/db/stats";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const site = await getSiteConfig().catch(() => getDefaultSiteConfig());

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  // Login and non-admin sessions render without dashboard chrome.
  // Middleware already blocks non-admins from protected /admin routes.
  if (!session?.user || session.user.role !== "admin") {
    return <>{children}</>;
  }

  const badges = await getAdminNavBadges().catch(() => ({
    pendingOrders: 0,
    requestedBookings: 0,
    openComplaints: 0,
    outOfStockProducts: 0,
  }));

  return (
    <AdminShell
      brandName={site.name}
      logoUrl={site.logoUrl}
      email={session.user.email ?? ""}
      displayName={session.user.name ?? "Admin"}
      badges={badges}
      logoutAction={logoutAction}
    >
      {children}
    </AdminShell>
  );
}
