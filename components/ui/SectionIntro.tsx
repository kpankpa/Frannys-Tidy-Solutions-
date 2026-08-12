import {
  SECTION_BODY_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/lib/section-typography";
import { cn } from "@/lib/utils";

type SectionIntroProps = {
  title: string;
  subtitle?: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  maxWidthClass?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  bodyClassName?: string;
};

export function SectionIntro({
  title,
  subtitle,
  body,
  align = "left",
  className,
  maxWidthClass = "max-w-2xl",
  titleClassName,
  subtitleClassName,
  bodyClassName,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        maxWidthClass,
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className={cn(SECTION_TITLE_CLASS, titleClassName)}>{title}</h2>
      {subtitle ? (
        <p className={cn(SECTION_SUBTITLE_CLASS, subtitleClassName)}>
          {subtitle}
        </p>
      ) : null}
      {body ? (
        <p className={cn(SECTION_BODY_CLASS, bodyClassName)}>{body}</p>
      ) : null}
    </div>
  );
}
