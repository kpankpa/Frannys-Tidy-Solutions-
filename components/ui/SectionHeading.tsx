import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
