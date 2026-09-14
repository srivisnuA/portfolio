"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const nodes = [
  { x: "12%", y: "18%", size: 2 },
  { x: "24%", y: "62%", size: 3 },
  { x: "41%", y: "28%", size: 2 },
  { x: "58%", y: "72%", size: 2 },
  { x: "72%", y: "34%", size: 3 },
  { x: "88%", y: "66%", size: 2 },
  { x: "78%", y: "86%", size: 2 },
  { x: "34%", y: "84%", size: 2 },
  { x: "92%", y: "24%", size: 2 },
];

export default function MeshBackdrop() {
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 20 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY]);

  const driftX = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const secondX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const secondY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.14, 0.26, 0.17]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-8, 28]);
  const orbitScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.03, 1.12]);
  const horizonY = useTransform(scrollYProgress, [0, 1], [56, 42]);
  const horizonOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.04, 0.14, 0.12, 0.06]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0A0B10]" />

      <motion.div
        style={{ x: driftX, y: driftY }}
        className="absolute -top-40 left-1/4 h-[560px] w-[560px] rounded-full opacity-[0.15] blur-[120px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#5EEAD4_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        style={{ x: secondX, y: secondY }}
        className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-[130px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#7DD3FC_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], [0, 80]), y: useTransform(scrollYProgress, [0, 1], [0, -45]) }}
        className="absolute -bottom-32 left-1/3 h-[460px] w-[460px] rounded-full opacity-[0.09] blur-[130px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#F5B860_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [-32, 32]), y: useTransform(smoothY, [-1, 1], [-20, 20]) }}
        className="absolute -right-[18vw] top-[12%] h-[68vh] w-[68vh] min-h-[420px] min-w-[420px] rounded-full border border-[var(--accent-cyan)]/[0.08]"
      >
        <motion.div
          style={{ rotate: orbitRotate, scale: orbitScale }}
          className="absolute inset-[10%] rounded-full border border-[var(--accent-teal)]/[0.10]"
        >
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_24px_rgba(125,211,252,0.65)]" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[24%] rounded-full border border-dashed border-[var(--border-hair-strong)]"
        />
      </motion.div>

      <motion.div
        style={{ y: useTransform(smoothY, [-1, 1], [-18, 18]), x: useTransform(smoothX, [-1, 1], [18, -18]) }}
        className="absolute -left-[22vw] top-[55%] h-[52vh] w-[52vh] rounded-full border border-[var(--accent-amber)]/[0.07]"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[18%] rounded-full border border-[var(--accent-cyan)]/[0.06]"
        />
      </motion.div>

      <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E7E9EE" stopOpacity="0.03" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#E7E9EE" stopOpacity="0.015" />
            </linearGradient>
            <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" fill="none" stroke="url(#gridFade)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      <motion.div
        style={{ top: useTransform(horizonY, (value) => `${value}%`), opacity: horizonOpacity }}
        className="absolute left-1/2 h-[1px] w-[120vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent blur-[0.4px]"
      />

      <svg className="absolute inset-0 h-full w-full opacity-[0.34]">
        <defs>
          <pattern id="stars" width="180" height="180" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="30" r="1" fill="#E7E9EE" opacity="0.5" />
            <circle cx="90" cy="80" r="0.8" fill="#E7E9EE" opacity="0.3" />
            <circle cx="140" cy="20" r="1.2" fill="#E7E9EE" opacity="0.4" />
            <circle cx="60" cy="140" r="0.9" fill="#E7E9EE" opacity="0.3" />
            <circle cx="160" cy="120" r="1" fill="#E7E9EE" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stars)" />
      </svg>

      <div className="absolute inset-0">
        {nodes.map((node, index) => (
          <motion.span
            key={`${node.x}-${node.y}`}
            className="absolute rounded-full bg-[var(--accent-cyan)] shadow-[0_0_18px_rgba(125,211,252,0.35)]"
            style={{ left: node.x, top: node.y, width: node.size, height: node.size }}
            animate={{
              x: [0, index % 2 === 0 ? 18 : -14, 0],
              y: [0, index % 3 === 0 ? -20 : 16, 0],
              opacity: [0.18, 0.72, 0.18],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 4.2 + index * 0.45, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
        ))}
      </div>

      <motion.div
        animate={{ x: ["-18vw", "118vw"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
        className="absolute top-[31%] h-px w-[18vw] max-w-[260px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/35 to-transparent blur-[0.4px]"
      />
      <motion.div
        animate={{ x: ["118vw", "-18vw"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear", repeatDelay: 7 }}
        className="absolute top-[72%] h-px w-[15vw] max-w-[220px] bg-gradient-to-r from-transparent via-[var(--accent-teal)]/30 to-transparent blur-[0.4px]"
      />

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [-16, 16]), y: useTransform(smoothY, [-1, 1], [-12, 12]) }}
        className="absolute left-1/2 top-1/2 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-hair)]/50 lg:block"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-dashed border-[var(--accent-cyan)]/[0.06]"
        />
      </motion.div>
    </div>
  );
}
