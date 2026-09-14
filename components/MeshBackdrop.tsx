"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stars = Array.from({ length: 64 }, (_, index) => ({
  x: `${(index * 37) % 100}%`,
  y: `${(index * 61) % 100}%`,
  depth: 0.35 + (index % 6) * 0.15,
  size: 0.8 + (index % 3) * 0.5,
}));

const systems = [
  { left: 16, top: 24, scale: 1, speed: 32 },
  { left: 78, top: 31, scale: 0.72, speed: 42 },
  { left: 30, top: 76, scale: 0.82, speed: 38 },
];

export default function MeshBackdrop() {
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 20 });
  const scrollVelocity = useMotionValue(0);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 150, damping: 26, mass: 0.5 });
  const lastScroll = useRef(0);
  const lastTime = useRef(0);
  const settleFrame = useRef<number | null>(null);
  const lastMove = useRef(0);

  useEffect(() => {
    lastScroll.current = window.scrollY;
    lastTime.current = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastScroll.current;
      const dt = Math.max(12, now - lastTime.current);
      scrollVelocity.set(Math.max(-4, Math.min(4, (dy / dt) * 1.65)));
      lastScroll.current = window.scrollY;
      lastTime.current = now;
      lastMove.current = now;
    };

    const settle = () => {
      if (performance.now() - lastMove.current > 65) scrollVelocity.set(0);
      settleFrame.current = requestAnimationFrame(settle);
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    settleFrame.current = requestAnimationFrame(settle);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (settleFrame.current !== null) cancelAnimationFrame(settleFrame.current);
    };
  }, [mouseX, mouseY, scrollVelocity]);

  const warp = useTransform(smoothVelocity, [-4, -1, 0, 1, 4], [2.8, 0.65, 0, -0.65, -2.8]);
  const streak = useTransform(smoothVelocity, [-4, -0.7, 0, 0.7, 4], [28, 7, 0, 7, 28]);
  const starParallaxX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const starParallaxY = useTransform(smoothY, [-1, 1], [-14, 14]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const gridX = useTransform(smoothVelocity, [-4, 0, 4], [-150, 0, 150]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#0A0B10]" />

      <motion.div style={{ x: useTransform(smoothX, [-1, 1], [-60, 80]), y: useTransform(smoothVelocity, [-4, 0, 4], [100, 0, -100]) }} className="absolute -top-52 left-[10%] h-[680px] w-[680px] rounded-full opacity-[0.16] blur-[140px]"><div className="h-full w-full rounded-full bg-[radial-gradient(circle,#5EEAD4_0%,transparent_68%)]" /></motion.div>
      <motion.div style={{ x: useTransform(smoothX, [-1, 1], [100, -90]), y: useTransform(smoothVelocity, [-4, 0, 4], [-110, 0, 110]) }} className="absolute top-[12%] -right-52 h-[620px] w-[620px] rounded-full opacity-[0.14] blur-[145px]"><div className="h-full w-full rounded-full bg-[radial-gradient(circle,#7DD3FC_0%,transparent_70%)]" /></motion.div>
      <motion.div style={{ x: useTransform(smoothX, [-1, 1], [-50, 55]), y: useTransform(scrollYProgress, [0, 1], [110, -220]) }} className="absolute -bottom-56 left-[30%] h-[560px] w-[560px] rounded-full opacity-[0.09] blur-[150px]"><div className="h-full w-full rounded-full bg-[radial-gradient(circle,#F5B860_0%,transparent_70%)]" /></motion.div>

      <motion.div style={{ x: gridX, y: gridY, skewY: useTransform(smoothVelocity, [-4, 0, 4], [-3, 0, 3]) }} className="absolute -inset-x-16 -inset-y-[55%] opacity-[0.18]">
        <svg className="h-[210%] w-full"><defs><linearGradient id="warpGridFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E7E9EE" stopOpacity="0" /><stop offset="48%" stopColor="#7DD3FC" stopOpacity="0.08" /><stop offset="58%" stopColor="#5EEAD4" stopOpacity="0.06" /><stop offset="100%" stopColor="#E7E9EE" stopOpacity="0" /></linearGradient><pattern id="warpGrid" width="78" height="78" patternUnits="userSpaceOnUse"><path d="M 78 0 L 0 0 0 78" fill="none" stroke="url(#warpGridFade)" strokeWidth="0.65" /></pattern></defs><rect width="100%" height="100%" fill="url(#warpGrid)" /></svg>
      </motion.div>

      <motion.svg className="absolute inset-0 h-full w-full" style={{ x: starParallaxX, y: starParallaxY }}>{stars.map((star, index) => <motion.line key={index} x1={star.x} x2={star.x} y1={star.y} y2={star.y} stroke="#E7E9EE" strokeWidth={star.size} strokeLinecap="round" style={{ opacity: 0.14 + star.depth * 0.17 }} animate={{ y1: [`calc(${star.y} + 110vh)`, `calc(${star.y} - 110vh)`], y2: [`calc(${star.y} + 110vh)`, `calc(${star.y} - 110vh)`], opacity: [0.08, 0.45, 0.08] }} transition={{ duration: 10 + (index % 8) * 1.8, repeat: Infinity, ease: "linear", delay: -(index * 0.55) }} />)}</motion.svg>

      <div className="absolute inset-0">{stars.slice(0, 26).map((star, index) => <motion.span key={`star-${index}`} className="absolute rounded-full bg-[var(--accent-cyan)] shadow-[0_0_16px_rgba(125,211,252,0.35)]" style={{ left: star.x, top: star.y, width: star.size + 0.4, height: star.size + 0.4 }} animate={{ y: ["110vh", "-110vh"], opacity: [0.08, 0.62, 0.08], scale: [0.7, 1.35, 0.7] }} transition={{ duration: 8 + (index % 6) * 1.4, repeat: Infinity, ease: "linear", delay: -(index * 0.7) }} />)}</div>

      {systems.map((system, index) => (
        <motion.div key={index} className="absolute hidden lg:block" style={{ left: `${system.left}%`, top: `${system.top}%`, scale: system.scale, x: useTransform(smoothX, [-1, 1], [-18, 18]), y: useTransform(smoothY, [-1, 1], [-14, 14]) }}>
          <motion.div style={{ rotate: warp }} className="relative h-44 w-44 -translate-x-1/2 -translate-y-1/2">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: system.speed, repeat: Infinity, ease: "linear" }} className="absolute inset-[18%] rounded-full border border-[var(--accent-cyan)]/[0.10]" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: system.speed * 1.35, repeat: Infinity, ease: "linear" }} className="absolute inset-[30%] rounded-full border border-[var(--accent-teal)]/[0.08]" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f9f7dc_0%,#7dd3fc_30%,#5eead4_52%,transparent_72%)] shadow-[0_0_34px_12px_rgba(125,211,252,0.18)]" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 12 + index * 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
              <div className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/80 shadow-[0_0_16px_4px_rgba(255,255,255,0.28)]" />
            </motion.div>
            <motion.div animate={{ scale: [0.7, 1.15, 0.75], opacity: [0.16, 0.42, 0.18] }} transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-[42%] rounded-full bg-[var(--accent-cyan)] blur-[7px]" />
          </motion.div>
        </motion.div>
      ))}

      <motion.div style={{ x: useTransform(smoothVelocity, [-4, 0, 4], [-1200, 0, 1200]), scaleX: streak, opacity: useTransform(smoothVelocity, [-4, -0.4, 0, 0.4, 4], [0.82, 0.28, 0.02, 0.28, 0.82]) }} className="absolute left-[5%] top-[28%] h-px w-[45vw] max-w-[580px] origin-left bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/65 to-transparent blur-[0.7px]" />
      <motion.div style={{ x: useTransform(smoothVelocity, [-4, 0, 4], [980, 0, -980]), scaleX: streak, opacity: useTransform(smoothVelocity, [-4, -0.4, 0, 0.4, 4], [0.72, 0.24, 0.02, 0.24, 0.72]) }} className="absolute right-[5%] top-[70%] h-px w-[36vw] max-w-[480px] origin-right bg-gradient-to-l from-transparent via-[var(--accent-teal)]/55 to-transparent blur-[0.7px]" />
      <motion.div style={{ scaleX: useTransform(smoothVelocity, [-4, 0, 4], [2.15, 0.2, 2.15]), opacity: useTransform(smoothVelocity, [-4, -0.3, 0, 0.3, 4], [0.58, 0.12, 0.02, 0.12, 0.58]) }} className="absolute left-1/2 top-1/2 h-px w-[72vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/38 to-transparent blur-[1px]" />
      <motion.div style={{ y: useTransform(smoothVelocity, [-4, 0, 4], [-340, 0, 340]), scaleY: useTransform(smoothVelocity, [-4, 0, 4], [2, 0.2, 2]), opacity: useTransform(smoothVelocity, [-4, -0.3, 0, 0.3, 4], [0.48, 0.08, 0.01, 0.08, 0.48]) }} className="absolute left-1/2 top-1/2 h-[48vh] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--accent-teal)]/25 to-transparent blur-[1px]" />

      <motion.div style={{ x: useTransform(smoothX, [-1, 1], [-24, 24]), y: useTransform(smoothY, [-1, 1], [-18, 18]), rotate: useTransform(smoothVelocity, [-4, 0, 4], [-9, 0, 9]), scale: useTransform(smoothVelocity, [-4, 0, 4], [1.18, 1, 1.18]) }} className="absolute left-1/2 top-1/2 hidden h-[min(62vw,760px)] w-[min(62vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border-hair)] opacity-[0.2] lg:block"><motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="absolute inset-[16%] rounded-full border border-dashed border-[var(--accent-cyan)]/[0.09]" /><motion.div animate={{ rotate: -360 }} transition={{ duration: 36, repeat: Infinity, ease: "linear" }} className="absolute inset-[33%] rounded-full border border-[var(--accent-teal)]/[0.08]" /></motion.div>
    </div>
  );
}
