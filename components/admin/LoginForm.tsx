"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/PageSpinner";

type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
  callbackUrl: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <Spinner size="sm" className="border-white/30 border-t-white" />
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export function LoginForm({ action, callbackUrl }: LoginFormProps) {
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <label className="block text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue=""
          placeholder="admin@example.com"
          className="mt-1.5 w-full rounded-[8px] border border-border px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-[8px] border border-border px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>

      <SubmitButton />
    </form>
  );
}
