import Image from "next/image";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { getDefaultSiteConfig, getSiteConfig } from "@/lib/db/settings";
import { safeAdminCallbackUrl } from "@/lib/auth/admin-page";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const site = await getSiteConfig().catch(() => getDefaultSiteConfig());

  async function loginAction(formData: FormData) {
    "use server";

    const ip = await getClientIp();
    const email = String(formData.get("email") ?? "")
      .toLowerCase()
      .trim();
    const password = String(formData.get("password") ?? "");
    const callbackUrl = safeAdminCallbackUrl(
      String(formData.get("callbackUrl") ?? "/admin"),
    );

    const ipLimit = rateLimit({
      key: `login:ip:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!ipLimit.ok) {
      redirect(
        `/admin/login?error=${encodeURIComponent(rateLimitMessage(ipLimit.retryAfterSec))}`,
      );
    }

    const emailLimit = rateLimit({
      key: `login:email:${email || "unknown"}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!emailLimit.ok) {
      redirect(
        `/admin/login?error=${encodeURIComponent(rateLimitMessage(emailLimit.retryAfterSec))}`,
      );
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=InvalidCredentials");
      }
      throw error;
    }
  }

  const errorMessage =
    params.error === "InvalidCredentials"
      ? "Invalid email or password."
      : params.error
        ? decodeURIComponent(params.error)
        : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-[10px] border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/frannystidy.png"
            alt={site.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-md object-contain"
            priority
          />
        </div>
        <h1 className="text-center text-2xl font-bold text-foreground">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to manage {site.name}.
        </p>

        {errorMessage ? (
          <p className="mt-4 rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        ) : null}

        <LoginForm
          action={loginAction}
          callbackUrl={safeAdminCallbackUrl(params.callbackUrl)}
        />
      </div>
    </div>
  );
}
