import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

const sizeClass: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({
  size = "md",
  className,
}: {
  size?: SpinnerSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-primary/20 border-t-primary",
        sizeClass[size],
        className,
      )}
      aria-hidden
    />
  );
}

export function PageSpinner({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

/** Compact spinner for Suspense fallbacks inside a page section. */
export function SectionSpinner({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-[10px] border border-border bg-white px-4 py-10",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner size="sm" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
