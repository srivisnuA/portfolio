"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 sm:block"
      aria-hidden="true"
    >
      <div className="h-24 w-px overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="w-full origin-top bg-[var(--accent-cyan)]"
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      </div>
      <motion.div
        className="mt-2 font-mono text-[9px] tracking-[0.16em] text-[var(--text-faint)]"
        style={{ opacity: scrollYProgress }}
      >
        SCROLL
      </motion.div>
    </div>
  );
}
