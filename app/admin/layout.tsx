import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  Package,
  Settings,
  Users,
  ArrowLeft,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { AdminNavLink } from "@/components/admin/AdminNavLink";
import { SITE } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface p-5 md:block">
          <Link
            href="/admin"
            className="inline-flex items-center gap-3"
            aria-label="Frannys Admin"
          >
            <Image
              src="/frannystidy.png"
              alt={SITE.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-md object-contain"
            />
            <span>
              <span className="block text-sm font-extrabold text-primary">
                Admin
              </span>
              <span className="block text-xs text-muted">
                {session.user.email}
              </span>
            </span>
          </Link>
          <nav className="mt-8 space-y-1">
            {links.map((link) => (
              <AdminNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
              />
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-4 backdrop-blur md:px-8">
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard</p>
              <p className="text-xs text-muted">
                Signed in as {session.user.name ?? "Admin"}
              </p>
            </div>
            <form action={logoutAction} className="md:hidden">
              <button
                type="submit"
                className="rounded-full bg-surface-soft px-3 py-1.5 text-xs font-semibold"
              >
                Sign out
              </button>
            </form>
          </header>
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
