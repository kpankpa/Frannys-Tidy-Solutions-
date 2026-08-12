import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { promoImageStyles } from "@/lib/promo-image-styles";
import { promoImagePosition, type PromoImageFit } from "@/lib/promotions";
import { cn } from "@/lib/utils";

type PromoFramedImageProps = {
  src: string;
  alt: string;
  focusX: number;
  focusY: number;
  zoom: number;
  fit?: PromoImageFit;
  sizes?: string;
  priority?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export function PromoFramedImage({
  src,
  alt,
  focusX,
  focusY,
  zoom,
  fit = "cover",
  sizes = "(max-width: 1280px) 100vw, 1200px",
  priority = false,
  className,
  wrapperClassName,
}: PromoFramedImageProps) {
  const position = promoImagePosition(focusX, focusY);
  const unoptimized = shouldUnoptimizeImage(src);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-surface-muted",
        wrapperClassName,
      )}
    >
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority={priority}
        sizes={sizes}
        draggable={false}
        unoptimized={unoptimized}
        className="pointer-events-none scale-110 select-none object-cover blur-2xl brightness-[0.85] saturate-125"
        style={{ objectPosition: position }}
      />

      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        draggable={false}
        unoptimized={unoptimized}
        className={cn("relative z-[1] select-none", className)}
        style={promoImageStyles({ focusX, focusY, zoom, fit })}
      />
    </div>
  );
}
