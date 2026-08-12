"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { shouldUnoptimizeImage } from "@/lib/image-src";
import { cn } from "@/lib/utils";

type AnimatedImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Extra classes on the outer motion wrapper (defaults to absolute fill). */
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Subtle pan direction for variety across sections. `none` keeps a fixed crop. */
  drift?: "in" | "left" | "right" | "none";
};

/**
 * Soft Ken Burns zoom/pan for hero and brand photography.
 * Disabled when the user prefers reduced motion.
 */
export function AnimatedImage({
  src,
  alt,
  className,
  wrapperClassName,
  sizes = "100vw",
  priority = false,
  drift = "in",
}: AnimatedImageProps) {
  const reduceMotion = useReducedMotion();
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);

    function markIfReady() {
      const img = imgRef.current;
      if (img?.complete && img.naturalWidth > 0) {
        setLoaded(true);
      }
    }

    markIfReady();
    const timer = window.setTimeout(markIfReady, 0);
    return () => window.clearTimeout(timer);
  }, [src]);

  const animate =
    reduceMotion || drift === "none"
      ? { scale: 1, x: "0%" }
      : drift === "left"
        ? { scale: [1, 1.08], x: ["0%", "-2.5%"] }
        : drift === "right"
          ? { scale: [1, 1.08], x: ["0%", "2.5%"] }
          : { scale: [1, 1.1], x: ["0%", "0%"] };

  return (
    <motion.div
      className={cn("absolute inset-0 overflow-hidden", wrapperClassName)}
      initial={{ scale: 1, x: "0%" }}
      animate={animate}
      transition={
        reduceMotion || drift === "none"
          ? { duration: 0 }
          : {
              duration: drift === "in" ? 16 : 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }
      }
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={shouldUnoptimizeImage(src)}
        onLoad={() => setLoaded(true)}
        className={cn("object-cover", className)}
      />
      {!loaded ? (
        <div
          className="absolute inset-0 z-[1] animate-pulse bg-primary/10 transition-opacity duration-500"
          aria-hidden
        />
      ) : null}
    </motion.div>
  );
}
