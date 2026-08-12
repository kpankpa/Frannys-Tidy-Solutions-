import type { CSSProperties } from "react";
import {
  type PromoImageFit,
  promoImagePosition,
} from "@/lib/promotions";

export type PromoFraming = {
  focusX: number;
  focusY: number;
  zoom: number;
  fit: PromoImageFit;
};

export function promoImageStyles({
  focusX,
  focusY,
  zoom,
  fit,
}: PromoFraming): CSSProperties {
  const position = promoImagePosition(focusX, focusY);
  const scale = zoom / 100;

  return {
    objectFit: fit,
    objectPosition: position,
    transform: scale === 1 ? undefined : `scale(${scale})`,
    transformOrigin: position,
  };
}
