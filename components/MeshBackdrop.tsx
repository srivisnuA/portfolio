"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const nodes = [
  { x: "12%", y: "18%", size: 2 },
  { x: "24%", y: "62%", size: 3 },
  { x: "41%", y: "28%", size: 2 },
  { x: "58%", y: "72%", size: 2 },
  { x: "72%", y: "34%", size: 3 },
  { x: "88%", y: "66%", size: 2 },
  { x: "78%", y: "86%", size: 2 },
];

export default function MeshBackdrop() {
  const { scrollYProgress } = useScroll();
  const driftX = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const secondX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const secondY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.16, 0.28, 0.18]);

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

      <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0">
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E7E9EE" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#E7E9EE" stopOpacity="0.02" />
            </linearGradient>
            <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" fill="none" stroke="url(#gridFade)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

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
              opacity: [0.22, 0.72, 0.22],
              scale: [1, 1.45, 1],
            }}
            transition={{ duration: 4.5 + index * 0.45, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
          />
        ))}
      </div>

      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], [-40, 140]), rotate: useTransform(scrollYProgress, [0, 1], [-6, 8]) }}
        className="absolute left-[6%] top-[24%] h-px w-[34vw] max-w-[420px] origin-left bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/25 to-transparent blur-[0.5px]"
      />
      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], [80, -120]), rotate: useTransform(scrollYProgress, [0, 1], [4, -7]) }}
        className="absolute right-[4%] top-[68%] h-px w-[28vw] max-w-[360px] origin-left bg-gradient-to-r from-transparent via-[var(--accent-teal)]/20 to-transparent blur-[0.5px]"
      />
    </div>
  );
}
