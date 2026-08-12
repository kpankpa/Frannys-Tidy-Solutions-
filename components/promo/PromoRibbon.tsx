"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { PromoFramedImage } from "@/components/promo/PromoFramedImage";
import {
  promoDismissStorageKey,
  showPromoRibbon,
  type PromoBanner,
} from "@/lib/promotions";

type PromoRibbonProps = {
  promo: PromoBanner;
};

export function PromoRibbon({ promo }: PromoRibbonProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!showPromoRibbon(promo)) return;
    const key = promoDismissStorageKey(promo);
    setDismissed(window.localStorage.getItem(key) === "1");
  }, [promo]);

  if (!showPromoRibbon(promo) || dismissed) return null;

  function dismiss() {
    const key = promoDismissStorageKey(promo);
    window.localStorage.setItem(key, "1");
    setDismissed(true);
  }

  const content = (
    <>
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-24">
        <PromoFramedImage
          src={promo.image}
          alt=""
          focusX={promo.imageFocusX}
          focusY={promo.imageFocusY}
          zoom={promo.imageZoom}
          fit={promo.imageFit}
          sizes="96px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {promo.title || "Seasonal offer"}
        </p>
        <p className="truncate text-xs text-white/80">
          Tap to view details
        </p>
      </div>
    </>
  );

  return (
    <div className="border-b border-primary-dark/20 bg-primary text-white">
      <div className="container-page flex items-center gap-3 py-2.5">
        {promo.link ? (
          <Link
            href={promo.link}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            {content}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss promotion"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
