import { cn } from "@/lib/utils";

type AccentCirclesProps = {
  className?: string;
  /** Softer circles for large full-bleed bands. */
  tone?: "banner" | "band";
};

/** Decorative corner circles used on CTA banners and dark bands. */
export function AccentCircles({
  className,
  tone = "banner",
}: AccentCirclesProps) {
  const soft = tone === "band";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "absolute -left-16 -top-16 rounded-full",
          soft ? "h-56 w-56 bg-white/[0.04]" : "h-48 w-48 bg-white/5",
        )}
      />
      <div
        className={cn(
          "absolute -bottom-20 -right-10 rounded-full",
          soft ? "h-64 w-64 bg-highlight/[0.08]" : "h-56 w-56 bg-highlight/10",
        )}
      />
    </div>
  );
}
