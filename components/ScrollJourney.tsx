"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollJourney() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [trackHeight, setTrackHeight] = useState(520);

  useEffect(() => {
    const update = () => setTrackHeight(Math.max(360, window.innerHeight - 150));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rawY = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const rocketY = useSpring(rawY, { stiffness: 100, damping: 25, mass: 0.45 });
  const flameScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.25, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 4, -3, 4, 0]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-[min(72vh,620px)] w-10">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--border-hair-strong)] to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-70">
          <motion.div
            style={{ height: rocketY, maxHeight: "100%" }}
            className="w-px origin-top bg-gradient-to-b from-[var(--accent-cyan)] via-[var(--accent-teal)] to-transparent"
          />
        </div>

        {[18, 38, 58, 78].map((point, index) => (
          <motion.span
            key={point}
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--border-hair-strong)]"
            style={{ top: `${point}%` }}
            animate={{ opacity: [0.25, 0.8, 0.25], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 2.2 + index * 0.25, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
        ))}

        <motion.div
          style={{ y: rocketY, opacity, rotate }}
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-hair-strong)] bg-[var(--bg-panel)]/90 shadow-xl shadow-black/20 backdrop-blur-xl">
            <Rocket size={17} strokeWidth={1.7} className="text-[var(--accent-cyan)]" />
            <motion.span
              style={{ scaleY: flameScale }}
              className="absolute -bottom-3 left-1/2 h-3 w-1 -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-[var(--accent-amber)] to-transparent"
            />
            <motion.span
              animate={{ opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2"
            >
              <Sparkles size={10} className="text-[var(--accent-teal)]" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
