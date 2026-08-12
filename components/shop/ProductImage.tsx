import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  paddingClassName?: string;
  hoverZoom?: boolean;
};

/**
 * Shows the full product photo. Empty sides of the frame are filled
 * with a zoomed, blurred copy of the same image.
 */
export function ProductImage({
  src,
  alt,
  sizes = "256px",
  priority = false,
  className,
  paddingClassName = "p-3 sm:p-4",
  hoverZoom = false,
}: ProductImageProps) {
  const unoptimized = shouldUnoptimizeImage(src);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        className="pointer-events-none scale-125 object-cover blur-2xl brightness-95 saturate-150"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn(
          "relative z-[1] object-contain",
          paddingClassName,
          hoverZoom && "transition duration-500 group-hover:scale-[1.03]",
          className,
        )}
      />
    </div>
  );
}
