import Image from "next/image";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { SITE } from "@/lib/constants";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=InvalidCredentials");
      }
      throw error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-[10px] border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/frannystidy.png"
            alt={SITE.name}
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
          Sign in to manage {SITE.name}.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-[8px] bg-danger/10 px-3 py-2 text-sm text-danger">
            Invalid email or password.
          </p>
        ) : null}

        <LoginForm
          action={loginAction}
          callbackUrl={params.callbackUrl ?? "/admin"}
        />
      </div>
    </div>
  );
}
