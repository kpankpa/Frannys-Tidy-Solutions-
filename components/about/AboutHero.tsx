"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import { FLYERS } from "@/lib/flyers";

type AboutHeroProps = {
  brandName: string;
  headline: string;
  intro: string;
};

export function AboutHero({ brandName, headline, intro }: AboutHeroProps) {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-primary-dark text-white">
      <AnimatedImage
        src={FLYERS.freshness.src}
        alt={FLYERS.freshness.alt}
        priority
        sizes="100vw"
        className="object-[center_25%]"
        drift="right"
      />
      <HeroOverlay />

      <div className="container-page relative flex min-h-[78vh] flex-col justify-end pb-14 pt-28 sm:pb-20 sm:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {brandName}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-2xl text-xl font-semibold leading-snug text-white/95 sm:text-2xl lg:text-[1.75rem]"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
        >
          {intro}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button href="/services" variant="light" size="md">
            Book Cleaning
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
          >
            Shop Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
