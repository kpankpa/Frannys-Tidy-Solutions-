import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { PromoFramedImage } from "@/components/promo/PromoFramedImage";
import {
  PROMO_SPOTLIGHT_ASPECT_CLASS,
  showPromoSpotlight,
  type PromoBanner,
} from "@/lib/promotions";
import { SECTION_TITLE_CLASS } from "@/lib/section-typography";

type PromoSpotlightProps = {
  promo: PromoBanner;
};

export function PromoSpotlight({ promo }: PromoSpotlightProps) {
  if (!showPromoSpotlight(promo)) return null;

  const image = (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/80 bg-surface-muted soft-shadow ${PROMO_SPOTLIGHT_ASPECT_CLASS}`}
    >
      <PromoFramedImage
        src={promo.image}
        alt={promo.alt || promo.title || "Seasonal promotion"}
        focusX={promo.imageFocusX}
        focusY={promo.imageFocusY}
        zoom={promo.imageZoom}
        fit={promo.imageFit}
        priority
      />
    </div>
  );

  return (
    <section className="bg-surface-muted/70 py-10 sm:py-12">
      <div className="container-page">
        <FadeIn>
          {promo.title ? (
            <h2 className={`mb-4 text-center ${SECTION_TITLE_CLASS}`}>
              {promo.title}
            </h2>
          ) : null}
          {promo.link ? (
            <Link href={promo.link} className="block transition hover:opacity-95">
              {image}
            </Link>
          ) : (
            image
          )}
        </FadeIn>
      </div>
    </section>
  );
}
