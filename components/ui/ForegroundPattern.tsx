import { cn } from "@/lib/utils";

type ForegroundPatternProps = {
  className?: string;
};

/**
 * Faint decorative circles that sit behind page content (low z-index).
 * Fixed so the pattern feels ambient as you scroll.
 */
export function ForegroundPattern({ className }: ForegroundPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div className="absolute -left-24 top-[8%] h-72 w-72 rounded-full bg-primary/[0.035]" />
      <div className="absolute left-[18%] top-[32%] h-44 w-44 rounded-full border border-secondary/[0.12]" />
      <div className="absolute -right-16 top-[14%] h-96 w-96 rounded-full bg-secondary/[0.04]" />
      <div className="absolute right-[22%] top-[48%] h-56 w-56 rounded-full border border-primary/[0.08]" />
      <div className="absolute -left-10 top-[62%] h-64 w-64 rounded-full bg-highlight/[0.05]" />
      <div className="absolute left-[42%] top-[78%] h-36 w-36 rounded-full border border-highlight/[0.14]" />
      <div className="absolute -right-24 bottom-[6%] h-80 w-80 rounded-full bg-primary/[0.03]" />
      <div className="absolute right-[8%] bottom-[28%] h-28 w-28 rounded-full bg-secondary/[0.05]" />
    </div>
  );
}
