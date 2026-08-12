import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

type PageHeroTitleProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

/** Single headline for photo heroes. No subcopy or duplicate brand name. */
export function PageHeroTitle({
  title,
  className,
  children,
}: PageHeroTitleProps) {
  const lines = title.split("\n").filter(Boolean);

  return (
    <FadeIn className={cn("max-w-2xl", className)}>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      {children ? (
        <div className="mt-6 flex flex-row flex-wrap items-center gap-3">
          {children}
        </div>
      ) : null}
    </FadeIn>
  );
}
