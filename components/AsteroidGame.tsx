"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type Asteroid = {
  id: number;
  left: number;
  top: number;
  size: number;
  rotate: number;
  driftX: number;
  driftY: number;
  shape: string;
};

type Burst = { id: number; x: number; y: number };

// Irregular silhouettes intentionally avoid the "perfect rock" look.
const shapes = [
  "M49 2 L67 8 L81 6 L91 17 L98 31 L91 44 L96 61 L86 76 L72 88 L56 94 L43 99 L30 91 L14 94 L7 81 L11 66 L3 52 L8 38 L4 25 L16 15 L29 16 L34 7 Z",
  "M42 4 L58 9 L75 4 L89 14 L96 29 L90 43 L97 59 L85 75 L72 83 L64 97 L46 93 L31 98 L18 88 L9 75 L13 59 L5 46 L10 31 L7 18 L23 13 L30 6 Z",
  "M28 7 L46 11 L66 5 L80 12 L94 25 L90 42 L98 57 L88 70 L91 83 L70 89 L55 98 L39 91 L24 96 L11 86 L8 72 L13 57 L4 43 L13 28 L16 17 Z",
  "M47 3 L62 10 L80 7 L92 22 L95 38 L87 51 L94 67 L81 79 L67 94 L51 89 L36 98 L23 89 L9 86 L6 70 L12 56 L3 42 L12 29 L10 15 L28 16 L35 7 Z",
];

function createAsteroid(id: number): Asteroid {
  const angle = Math.random() * Math.PI * 2;
  const edge = Math.random() > 0.5;
  return {
    id,
    left: edge ? (Math.random() > 0.5 ? -10 : 110) : 12 + Math.random() * 76,
    top: 15 + Math.random() * 68,
    size: 220 + Math.random() * 90,
    rotate: Math.random() * 360,
    driftX: Math.cos(angle) * (85 + Math.random() * 110),
    driftY: Math.sin(angle) * (55 + Math.random() * 95),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  };
}

export default function AsteroidGame() {
  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastTrigger = 0;
    const spawn = () => {
      const now = performance.now();
      if (now - lastTrigger < 700 || asteroid) return;
      lastTrigger = now;
      setAsteroid(createAsteroid(now));
      setIsVisible(true);
    };

    const onScroll = () => spawn();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [asteroid]);

  const playExplosion = useCallback(() => {
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.13, now + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
      master.connect(ctx.destination);

      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.46), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2900, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.46);

      const boom = ctx.createOscillator();
      boom.type = "sine";
      boom.frequency.setValueAtTime(105, now);
      boom.frequency.exponentialRampToValueAtTime(24, now + 0.48);

      noise.connect(filter).connect(master);
      boom.connect(master);
      noise.start(now);
      boom.start(now);
      noise.stop(now + 0.47);
      boom.stop(now + 0.47);
      window.setTimeout(() => void ctx.close(), 750);
    } catch {
      // Visual effect still works when audio is unavailable.
    }
  }, []);

  const destroyAsteroid = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!asteroid || !isVisible) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setIsVisible(false);
    setBurst({ id: Date.now(), x: centerX, y: centerY });
    playExplosion();

    window.setTimeout(() => {
      setAsteroid(null);
      setBurst(null);
    }, 720);
  }, [asteroid, isVisible, playExplosion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <AnimatePresence mode="wait">
        {asteroid && isVisible && (
          <motion.button
            key={asteroid.id}
            type="button"
            aria-label="Tap to destroy asteroid"
            onPointerDown={destroyAsteroid}
            className="pointer-events-auto absolute touch-manipulation select-none border-0 bg-transparent p-0"
            style={{
              left: `${asteroid.left}%`,
              top: `${asteroid.top}%`,
              width: asteroid.size,
              height: asteroid.size,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.08, x: asteroid.driftX * -1, y: asteroid.driftY * -1, rotate: asteroid.rotate - 65 }}
            animate={{
              opacity: [0, 1, 1],
              scale: [0.08, 1, 1.025],
              x: [asteroid.driftX * -1, 0, asteroid.driftX * 0.12],
              y: [asteroid.driftY * -1, 0, asteroid.driftY * 0.08],
              rotate: [asteroid.rotate - 65, asteroid.rotate, asteroid.rotate + 16],
            }}
            exit={{ opacity: 0, scale: 0.08, rotate: asteroid.rotate + 80, x: asteroid.driftX * 0.3, y: asteroid.driftY * 0.3 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)] blur-xl" />

            <svg viewBox="0 0 100 100" className="relative h-full w-full overflow-visible drop-shadow-[0_24px_32px_rgba(0,0,0,0.65)]">
              <defs>
                <radialGradient id={`rock-${asteroid.id}`} cx="28%" cy="22%" r="86%">
                  <stop offset="0%" stopColor="#c4c6c8" />
                  <stop offset="18%" stopColor="#8e9296" />
                  <stop offset="42%" stopColor="#5d6268" />
                  <stop offset="68%" stopColor="#30353c" />
                  <stop offset="88%" stopColor="#171b21" />
                  <stop offset="100%" stopColor="#07090d" />
                </radialGradient>
                <linearGradient id={`facet-${asteroid.id}`} x1="12%" y1="8%" x2="84%" y2="92%">
                  <stop offset="0%" stopColor="#eef0f1" stopOpacity="0.28" />
                  <stop offset="38%" stopColor="#8b8f94" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                </linearGradient>
                <filter id={`rough-${asteroid.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="4" seed={asteroid.id % 97} result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" />
                </filter>
                <filter id={`soft-${asteroid.id}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
              </defs>

              {/* Base rock */}
              <path d={asteroid.shape} fill={`url(#rock-${asteroid.id})`} filter={`url(#rough-${asteroid.id})`} />

              {/* Angular geological facets */}
              <path d="M11 43 L28 19 L47 24 L39 46 L20 56 Z" fill={`url(#facet-${asteroid.id})`} opacity="0.46" />
              <path d="M47 24 L76 12 L90 34 L72 50 L55 43 Z" fill="#d0d2d4" opacity="0.09" />
              <path d="M20 56 L39 46 L55 43 L72 50 L61 78 L42 88 L25 79 Z" fill="#05070a" opacity="0.22" />
              <path d="M61 78 L72 50 L89 55 L84 74 L69 89 Z" fill="#8d9197" opacity="0.08" />

              {/* Deep craters with raised rims */}
              <g>
                <ellipse cx="29" cy="29" rx="12" ry="9" fill="#0a0c10" opacity="0.8" />
                <ellipse cx="27" cy="27" rx="8.6" ry="5.8" fill="#62666b" opacity="0.3" />
                <ellipse cx="24.8" cy="25" rx="5.6" ry="3.4" fill="#e0e2e3" opacity="0.09" />

                <ellipse cx="67" cy="26" rx="8" ry="6" fill="#0b0d11" opacity="0.86" />
                <ellipse cx="65" cy="24" rx="5.8" ry="3.8" fill="#83878c" opacity="0.23" />

                <ellipse cx="61" cy="61" rx="14" ry="11" fill="#080a0e" opacity="0.82" />
                <ellipse cx="58" cy="58" rx="9" ry="6.6" fill="#73777c" opacity="0.24" />
                <ellipse cx="55" cy="56" rx="5" ry="3.2" fill="#e0e2e2" opacity="0.07" />

                <ellipse cx="31" cy="70" rx="7" ry="5" fill="#07090d" opacity="0.8" />
                <ellipse cx="29" cy="68" rx="4.5" ry="3" fill="#a0a4a8" opacity="0.16" />

                <ellipse cx="79" cy="51" rx="6" ry="4.5" fill="#07090c" opacity="0.76" />
              </g>

              {/* Small impact pits */}
              <g fill="#05070a" opacity="0.46">
                <circle cx="46" cy="16" r="2" />
                <circle cx="21" cy="50" r="1.8" />
                <circle cx="80" cy="38" r="2.3" />
                <circle cx="45" cy="79" r="2.1" />
                <circle cx="71" cy="73" r="1.5" />
                <circle cx="37" cy="57" r="1.2" />
              </g>

              {/* Thin lit rim and dark underside */}
              <path d={asteroid.shape} fill="none" stroke="#f3f4f5" strokeOpacity="0.14" strokeWidth="1.7" />
              <path d={asteroid.shape} fill="none" stroke="#000000" strokeOpacity="0.5" strokeWidth="3.2" strokeDasharray="28 16 10 19" />
              <ellipse cx="54" cy="85" rx="27" ry="7" fill="#000" opacity="0.2" filter={`url(#soft-${asteroid.id})`} />
            </svg>

            <span className="pointer-events-none absolute left-1/2 top-full mt-5 -translate-x-1/2 rounded-full border border-white/10 bg-black/65 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md">
              Tap to destroy
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {burst && (
          <motion.div key={burst.id} className="pointer-events-none fixed z-[10]" style={{ left: burst.x, top: burst.y }} initial={{ opacity: 1, scale: 0.15 }} animate={{ opacity: 0, scale: 2.9 }} transition={{ duration: 0.68, ease: "easeOut" }}>
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_80px_30px_rgba(255,255,255,0.42)]" />
            <motion.div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent-cyan)]" animate={{ scale: [0.3, 6], opacity: [1, 0] }} transition={{ duration: 0.62 }} />
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute left-1/2 top-1/2 h-1 w-10 origin-left rounded-full bg-[var(--accent-cyan)] shadow-[0_0_14px_rgba(125,211,252,0.75)]"
                style={{ rotate: `${index * 20}deg` }}
                animate={{ x: [0, 82 + index * 2.5], opacity: [1, 0], scaleX: [0.6, 1.35] }}
                transition={{ duration: 0.48 + index * 0.009, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
