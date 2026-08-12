"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import type { PeopleImage } from "@/lib/people-images";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 6000;

type TeamSlideshowProps = {
  images: PeopleImage[];
  className?: string;
};

export function TeamSlideshow({ images, className }: TeamSlideshowProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (reduceMotion || count <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [count, reduceMotion]);

  if (count === 0) return null;

  const current = images[index];

  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-2xl border border-border bg-primary/5 soft-shadow sm:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeInOut" }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 640px) 90vw, 512px"
              className="object-cover object-center"
              unoptimized={shouldUnoptimizeImage(current.src)}
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-primary/70 text-white backdrop-blur-sm transition hover:bg-primary"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-primary/70 text-white backdrop-blur-sm transition hover:bg-primary"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Team photo slideshow"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1} of ${count}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index
                  ? "w-7 bg-secondary"
                  : "w-2.5 bg-border hover:bg-secondary/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
