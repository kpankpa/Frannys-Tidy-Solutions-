"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { HeroOverlay } from "@/components/ui/HeroOverlay";
import {
  ABOUT_HERO_INNER_CLASS,
  ABOUT_HERO_SECTION_CLASS,
} from "@/lib/hero-layout";

type AboutHeroProps = {
  headline: string;
  heroImage: string;
};

export function AboutHero({ headline, heroImage }: AboutHeroProps) {
  const lines = headline.split("\n").filter(Boolean);

  return (
    <section className={ABOUT_HERO_SECTION_CLASS}>
      <AnimatedImage
        src={heroImage}
        alt="Frannys Tidy Solutions team member presenting Frannys cleaning products in Accra, Ghana"
        priority
        sizes="100vw"
        className="object-[center_54%]"
        drift="none"
      />
      <HeroOverlay />

      <div className={ABOUT_HERO_INNER_CLASS}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
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
