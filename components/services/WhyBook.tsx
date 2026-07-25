"use client";

import { FlaskConical, MessageCircle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AccentCircles } from "@/components/ui/AccentCircles";

const icons = [Sparkles, FlaskConical, MessageCircle];

type WhyBookProps = {
  shortName: string;
  subcopy: string;
  promises: { title: string; body: string }[];
};

export function WhyBook({ shortName, subcopy, promises }: WhyBookProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-primary-dark text-white">
      <AccentCircles tone="band" />
      <div className="container-page relative py-14 sm:py-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why book {shortName}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            {subcopy}
          </p>
        </motion.div>

        <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {promises.map((item, i) => {
            const Icon = icons[i] ?? Sparkles;
            return (
              <motion.li
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-highlight">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.body}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
