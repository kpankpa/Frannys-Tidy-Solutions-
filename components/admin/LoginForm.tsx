type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
  callbackUrl: string;
};

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
          defaultValue="admin@frannys.com"
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

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-[8px] bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Sign in
      </button>
    </form>
  );
}
