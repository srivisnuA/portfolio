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

const shapes = [
  "M49 3 L67 9 L84 6 L96 23 L91 41 L98 58 L86 77 L68 88 L53 98 L35 91 L17 96 L7 78 L12 59 L3 43 L14 25 L10 11 L31 14 Z",
  "M41 4 L63 8 L82 5 L96 24 L90 43 L97 60 L80 82 L65 91 L48 97 L29 88 L11 92 L5 70 L12 51 L4 32 L20 18 L26 7 Z",
  "M28 6 L50 12 L71 4 L91 18 L96 37 L87 57 L94 76 L72 90 L55 98 L34 91 L15 95 L6 75 L13 55 L5 38 L18 20 Z",
];

function createAsteroid(id: number): Asteroid {
  const angle = Math.random() * Math.PI * 2;
  const edge = Math.random() > 0.5;
  return {
    id,
    left: edge ? (Math.random() > 0.5 ? -8 : 108) : 12 + Math.random() * 76,
    top: 14 + Math.random() * 72,
    size: 170 + Math.random() * 120,
    rotate: Math.random() * 360,
    driftX: Math.cos(angle) * (70 + Math.random() * 120),
    driftY: Math.sin(angle) * (50 + Math.random() * 100),
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
      if (now - lastTrigger < 500) return;
      lastTrigger = now;
      setAsteroid(createAsteroid(now));
      setIsVisible(true);
    };

    const onScroll = () => spawn();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const playExplosion = useCallback(() => {
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.11, now + 0.01);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      master.connect(ctx.destination);

      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.45), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.45);

      const boom = ctx.createOscillator();
      boom.type = "sine";
      boom.frequency.setValueAtTime(95, now);
      boom.frequency.exponentialRampToValueAtTime(28, now + 0.45);

      noise.connect(filter).connect(master);
      boom.connect(master);
      noise.start(now);
      boom.start(now);
      noise.stop(now + 0.46);
      boom.stop(now + 0.46);
      window.setTimeout(() => void ctx.close(), 700);
    } catch {
      // Browsers may block audio until a user gesture; the visual blast still plays.
    }
  }, []);

  const destroyAsteroid = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!asteroid) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setIsVisible(false);
    setBurst({ id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    playExplosion();
    window.setTimeout(() => {
      setAsteroid(null);
      setBurst(null);
    }, 700);
  };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <AnimatePresence mode="wait">
        {asteroid && isVisible && (
          <motion.button
            key={asteroid.id}
            type="button"
            aria-label="Tap to destroy asteroid"
            onClick={destroyAsteroid}
            className="pointer-events-auto absolute overflow-visible"
            style={{ left: `${asteroid.left}%`, top: `${asteroid.top}%`, width: asteroid.size, height: asteroid.size }}
            initial={{ opacity: 0, scale: 0.12, x: asteroid.driftX * -1, y: asteroid.driftY * -1, rotate: asteroid.rotate - 80 }}
            animate={{ opacity: [0, 1, 1], scale: [0.12, 1, 1.04], x: [asteroid.driftX * -1, 0, asteroid.driftX * 0.18], y: [asteroid.driftY * -1, 0, asteroid.driftY * 0.12], rotate: [asteroid.rotate - 80, asteroid.rotate, asteroid.rotate + 18] }}
            exit={{ opacity: 0, scale: 0.2, x: asteroid.driftX, y: asteroid.driftY }}
            transition={{ duration: 1.25, ease: "easeOut" }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]">
              <defs>
                <radialGradient id="asteroid-core" cx="30%" cy="24%" r="82%">
                  <stop offset="0%" stopColor="#b4b5b7" />
                  <stop offset="28%" stopColor="#7b7d82" />
                  <stop offset="58%" stopColor="#44474d" />
                  <stop offset="82%" stopColor="#24272d" />
                  <stop offset="100%" stopColor="#0d1015" />
                </radialGradient>
                <filter id="asteroid-noise" x="-18%" y="-18%" width="136%" height="136%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed={asteroid.id % 100} />
                  <feDisplacementMap in="SourceGraphic" scale="3.5" />
                </filter>
              </defs>

              <path d={asteroid.shape} fill="url(#asteroid-core)" stroke="#d6d7da" strokeOpacity="0.2" strokeWidth="1.2" filter="url(#asteroid-noise)" />

              <g opacity="0.7">
                <ellipse cx="29" cy="30" rx="12" ry="8.5" fill="#12151a" />
                <ellipse cx="26" cy="27" rx="7" ry="4.5" fill="#a8aaad" opacity="0.18" />
                <ellipse cx="65" cy="24" rx="9" ry="6" fill="#14171c" />
                <ellipse cx="63" cy="22" rx="5" ry="3" fill="#b3b5b8" opacity="0.14" />
                <ellipse cx="63" cy="63" rx="14" ry="10" fill="#11141a" />
                <ellipse cx="59" cy="59" rx="8" ry="5" fill="#a6a8ac" opacity="0.12" />
                <ellipse cx="34" cy="72" rx="7" ry="5" fill="#11141a" />
                <ellipse cx="77" cy="51" rx="6" ry="4" fill="#090b0f" />
              </g>

              <path d={asteroid.shape} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="2" />
            </svg>

            <span className="pointer-events-none absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
              Tap to destroy
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {burst && (
          <motion.div key={burst.id} className="pointer-events-none fixed z-[10]" style={{ left: burst.x, top: burst.y }} initial={{ opacity: 1, scale: 0.15 }} animate={{ opacity: 0, scale: 2.9 }} transition={{ duration: 0.68, ease: "easeOut" }}>
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_70px_28px_rgba(255,255,255,0.42)]" />
            <motion.div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent-cyan)]" animate={{ scale: [0.4, 5.5], opacity: [1, 0] }} transition={{ duration: 0.6 }} />
            {Array.from({ length: 14 }).map((_, index) => (
              <motion.span key={index} className="absolute left-1/2 top-1/2 h-1 w-8 origin-left rounded-full bg-[var(--accent-cyan)] shadow-[0_0_12px_rgba(125,211,252,0.7)]" style={{ rotate: `${index * (360 / 14)}deg` }} animate={{ x: [0, 80 + index * 2], opacity: [1, 0], scaleX: [0.7, 1.3] }} transition={{ duration: 0.5 + index * 0.01, ease: "easeOut" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
