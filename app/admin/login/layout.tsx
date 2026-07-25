import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Keep login outside the dashboard shell; bounce signed-in admins home. */
export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return <>{children}</>;
}
