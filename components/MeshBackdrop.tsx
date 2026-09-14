"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stars = Array.from({ length: 64 }, (_, index) => ({
  x: `${(index * 37) % 100}%`,
  y: `${(index * 61) % 100}%`,
  depth: 0.35 + (index % 6) * 0.15,
  size: 0.8 + (index % 3) * 0.5,
}));

export default function MeshBackdrop() {
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 20 });
  const scrollVelocity = useMotionValue(0);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 110, damping: 24, mass: 0.55 });
  const lastScroll = useRef(0);
  const lastTime = useRef(0);
  const lastMove = useRef(0);

  useEffect(() => {
    lastScroll.current = window.scrollY;
    lastTime.current = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastScroll.current;
      const dt = Math.max(12, now - lastTime.current);
      const velocity = Math.max(-3.2, Math.min(3.2, (dy / dt) * 1.4));
      scrollVelocity.set(velocity);
      lastScroll.current = window.scrollY;
      lastTime.current = now;
      lastMove.current = now;
    };

    const settle = () => {
      const now = performance.now();
      if (now - lastMove.current > 70) scrollVelocity.set(0);
      requestAnimationFrame(settle);
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const frame = requestAnimationFrame(settle);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [mouseX, mouseY, scrollVelocity]);

  const warp = useTransform(smoothVelocity, [-3.2, -1, 0, 1, 3.2], [2.1, 0.55, 0, -0.55, -2.1]);
  const streak = useTransform(smoothVelocity, [-3.2, -0.7, 0, 0.7, 3.2], [18, 5, 0, 5, 18]);
  const starParallaxX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const starParallaxY = useTransform(smoothY, [-1, 1], [-14, 14]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const gridX = useTransform(smoothVelocity, [-3.2, 0, 3.2], [-90, 0, 90]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0A0B10]" />

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [-60, 80]), y: useTransform(smoothVelocity, [-3.2, 0, 3.2], [70, 0, -70]) }}
        className="absolute -top-52 left-[10%] h-[680px] w-[680px] rounded-full opacity-[0.16] blur-[140px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#5EEAD4_0%,transparent_68%)]" />
      </motion.div>

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [100, -90]), y: useTransform(smoothVelocity, [-3.2, 0, 3.2], [-80, 0, 80]) }}
        className="absolute top-[12%] -right-52 h-[620px] w-[620px] rounded-full opacity-[0.14] blur-[145px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#7DD3FC_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [-50, 55]), y: useTransform(scrollYProgress, [0, 1], [110, -220]) }}
        className="absolute -bottom-56 left-[30%] h-[560px] w-[560px] rounded-full opacity-[0.09] blur-[150px]"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#F5B860_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        style={{ x: gridX, y: gridY, skewY: useTransform(smoothVelocity, [-3.2, 0, 3.2], [-1.8, 0, 1.8]) }}
        className="absolute -inset-x-16 -inset-y-[55%] opacity-[0.18]"
      >
        <svg className="h-[210%] w-full">
          <defs>
            <linearGradient id="warpGridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E7E9EE" stopOpacity="0" />
              <stop offset="48%" stopColor="#7DD3FC" stopOpacity="0.08" />
              <stop offset="58%" stopColor="#5EEAD4" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#E7E9EE" stopOpacity="0" />
            </linearGradient>
            <pattern id="warpGrid" width="78" height="78" patternUnits="userSpaceOnUse">
              <path d="M 78 0 L 0 0 0 78" fill="none" stroke="url(#warpGridFade)" strokeWidth="0.65" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#warpGrid)" />
        </svg>
      </motion.div>

      <motion.svg
        className="absolute inset-0 h-full w-full"
        style={{ x: starParallaxX, y: starParallaxY }}
      >
        {stars.map((star, index) => (
          <motion.line
            key={index}
            x1={star.x}
            x2={star.x}
            y1={star.y}
            y2={star.y}
            stroke="#E7E9EE"
            strokeWidth={star.size}
            strokeLinecap="round"
            style={{ opacity: 0.12 + star.depth * 0.16 }}
            animate={{
              x1: [`calc(${star.x} - ${star.depth * 3}px)`, `calc(${star.x} + ${star.depth * 3}px)`],
              x2: [`calc(${star.x} + ${star.depth * 3}px)`, `calc(${star.x} - ${star.depth * 3}px)`],
            }}
            transition={{ duration: 5 + (index % 7) * 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: index * 0.04 }}
          />
        ))}
      </motion.svg>

      <div className="absolute inset-0">
        {stars.slice(0, 26).map((star, index) => (
          <motion.span
            key={`star-${index}`}
            className="absolute rounded-full bg-[var(--accent-cyan)] shadow-[0_0_16px_rgba(125,211,252,0.35)]"
            style={{ left: star.x, top: star.y, width: star.size + 0.4, height: star.size + 0.4 }}
            animate={{ opacity: [0.1, 0.55, 0.1], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + index * 0.13, repeat: Infinity, ease: "easeInOut", delay: index * 0.17 }}
          />
        ))}
      </div>

      <motion.div
        style={{ x: useTransform(smoothVelocity, [-3.2, 0, 3.2], [-1000, 0, 1000]), scaleX: streak, opacity: useTransform(smoothVelocity, [-3.2, -0.4, 0, 0.4, 3.2], [0.75, 0.25, 0.02, 0.25, 0.75]) }}
        className="absolute left-[5%] top-[28%] h-px w-[45vw] max-w-[580px] origin-left bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/65 to-transparent blur-[0.7px]"
      />
      <motion.div
        style={{ x: useTransform(smoothVelocity, [-3.2, 0, 3.2], [820, 0, -820]), scaleX: streak, opacity: useTransform(smoothVelocity, [-3.2, -0.4, 0, 0.4, 3.2], [0.65, 0.22, 0.02, 0.22, 0.65]) }}
        className="absolute right-[5%] top-[70%] h-px w-[36vw] max-w-[480px] origin-right bg-gradient-to-l from-transparent via-[var(--accent-teal)]/55 to-transparent blur-[0.7px]"
      />

      <motion.div
        style={{ scaleX: useTransform(smoothVelocity, [-3.2, 0, 3.2], [1.7, 0.2, 1.7]), opacity: useTransform(smoothVelocity, [-3.2, -0.3, 0, 0.3, 3.2], [0.5, 0.12, 0.02, 0.12, 0.5]) }}
        className="absolute left-1/2 top-1/2 h-px w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/38 to-transparent blur-[1px]"
      />

      <motion.div
        style={{ y: useTransform(smoothVelocity, [-3.2, 0, 3.2], [-260, 0, 260]), scaleY: useTransform(smoothVelocity, [-3.2, 0, 3.2], [1.7, 0.2, 1.7]), opacity: useTransform(smoothVelocity, [-3.2, -0.3, 0, 0.3, 3.2], [0.42, 0.08, 0.01, 0.08, 0.42]) }}
        className="absolute left-1/2 top-1/2 h-[48vh] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--accent-teal)]/25 to-transparent blur-[1px]"
      />

      <motion.div
        style={{ x: useTransform(smoothX, [-1, 1], [-24, 24]), y: useTransform(smoothY, [-1, 1], [-18, 18]), rotate: useTransform(smoothVelocity, [-3.2, 0, 3.2], [-5, 0, 5]), scale: useTransform(smoothVelocity, [-3.2, 0, 3.2], [1.15, 1, 1.15]) }}
        className="absolute left-1/2 top-1/2 hidden h-[min(62vw,760px)] w-[min(62vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-hair)] opacity-[0.2] lg:block"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[16%] rounded-full border border-dashed border-[var(--accent-cyan)]/[0.07]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[33%] rounded-full border border-[var(--accent-teal)]/[0.06]"
        />
      </motion.div>
    </div>
  );
}
