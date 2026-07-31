"use client";

import Image from "next/image";
import { useState } from "react";
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
  /** Subtle pan direction for variety across sections. */
  drift?: "in" | "left" | "right";
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
  const [loaded, setLoaded] = useState(false);

  const animate =
    reduceMotion
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
        reduceMotion
          ? { duration: 0 }
          : {
              duration: drift === "in" ? 16 : 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }
      }
    >
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-primary/10"
          aria-hidden
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={shouldUnoptimizeImage(src)}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </motion.div>
  );
}
