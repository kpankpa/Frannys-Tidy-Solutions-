import {
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/lib/section-typography";
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
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
      {description ? (
        <p className={SECTION_SUBTITLE_CLASS}>{description}</p>
      ) : null}
    </div>
  );
}
