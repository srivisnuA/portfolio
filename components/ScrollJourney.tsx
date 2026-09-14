"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const milestones = [
  { point: 8, label: "01 · PROFILE" },
  { point: 30, label: "02 · PATENT" },
  { point: 55, label: "03 · WORK" },
  { point: 78, label: "04 · DATA" },
  { point: 94, label: "05 · CONTACT" },
];

export default function ScrollJourney() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [trackHeight, setTrackHeight] = useState(520);

  useEffect(() => {
    const update = () => setTrackHeight(Math.min(660, Math.max(390, window.innerHeight * 0.74)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rawY = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const rocketY = useSpring(rawY, { stiffness: 100, damping: 25, mass: 0.45 });
  const rocketScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.4, 0.62, 0.82, 1],
    [0.72, 0.88, 1.05, 1.22, 1.5, 1.95],
  );
  const flameScale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.65, 1, 1.4, 2]);
  const auraScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.7, 1, 1.45]);
  const opacity = useTransform(scrollYProgress, [0, 0.03, 0.98, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 4, -3, 4, 0]);
  const trailOpacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 1], [0.35, 0.65, 0.82, 1]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative h-[min(74vh,660px)] w-36">
        <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--border-hair-strong)] to-transparent" />
        <motion.div style={{ height: rocketY, opacity: trailOpacity }} className="absolute left-3 top-0 w-px origin-top bg-gradient-to-b from-[var(--accent-cyan)] via-[var(--accent-teal)] to-transparent" />

        {milestones.map((milestone, index) => (
          <div key={milestone.label} className="absolute left-0 flex -translate-y-1/2 items-center gap-3" style={{ top: `${milestone.point}%` }}>
            <motion.span
              animate={{ opacity: [0.25, 0.8, 0.25], scale: [0.75, 1.1, 0.75] }}
              transition={{ duration: 2.2 + index * 0.25, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_12px_rgba(125,211,252,0.45)]"
            />
            <span className="font-mono whitespace-nowrap text-[9px] tracking-[0.16em] text-[var(--text-faint)]">{milestone.label}</span>
          </div>
        ))}

        <motion.div style={{ y: rocketY, opacity, rotate, scale: rocketScale }} className="absolute left-3 top-0 origin-center -translate-x-1/2 -translate-y-1/2">
          <motion.div style={{ scale: auraScale }} className="absolute inset-0 -m-3 rounded-full bg-[var(--accent-cyan)]/10 blur-xl" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-hair-strong)] bg-[var(--bg-panel)]/90 shadow-xl shadow-black/20 backdrop-blur-xl">
            <Rocket size={17} strokeWidth={1.7} className="text-[var(--accent-cyan)]" />
            <motion.span style={{ scaleY: flameScale }} className="absolute -bottom-3 left-1/2 h-3 w-1 -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-[var(--accent-amber)] via-[var(--accent-amber)]/70 to-transparent" />
            <motion.span animate={{ opacity: [0.15, 0.6, 0.15], y: [0, 2, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-5 left-1/2 -translate-x-1/2">
              <Sparkles size={10} className="text-[var(--accent-teal)]" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
