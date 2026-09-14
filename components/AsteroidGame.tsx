"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type Asteroid = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  spin: number;
  shape: number;
  tone: number;
};

const asteroidShapes = [
  "M50 3 L70 10 L88 7 L98 28 L92 48 L97 67 L79 88 L60 95 L42 91 L25 98 L9 78 L13 59 L3 43 L15 24 L11 10 L32 13 Z",
  "M43 4 L65 9 L82 4 L96 22 L91 42 L98 58 L83 83 L67 92 L49 95 L31 87 L12 91 L5 69 L11 49 L4 31 L22 19 L27 7 Z",
  "M27 6 L50 11 L71 4 L91 18 L96 39 L87 58 L94 77 L69 90 L55 98 L34 91 L15 95 L6 75 L13 55 L5 38 L17 20 Z",
  "M48 3 L77 13 L94 31 L88 49 L96 67 L77 84 L61 96 L39 91 L20 97 L7 76 L12 57 L3 40 L16 21 L31 15 Z",
];

const craterSets = [
  [[29, 30, 11], [67, 24, 8], [62, 65, 13], [34, 71, 6], [78, 52, 5]],
  [[35, 23, 8], [68, 37, 13], [49, 61, 7], [25, 66, 5], [76, 75, 6]],
  [[26, 45, 9], [58, 24, 6], [73, 55, 11], [42, 77, 8], [82, 31, 4]],
  [[36, 34, 12], [61, 17, 5], [74, 63, 8], [25, 73, 6], [53, 54, 4]],
];

function createAsteroid(id: number): Asteroid {
  const direction = Math.random() > 0.5 ? 1 : -1;
  return {
    id,
    left: 4 + Math.random() * 92,
    top: 7 + Math.random() * 86,
    size: 30 + Math.random() * 58,
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 5,
    driftX: direction * (80 + Math.random() * 220),
    driftY: -120 + Math.random() * 240,
    spin: direction * (180 + Math.random() * 420),
    shape: Math.floor(Math.random() * asteroidShapes.length),
    tone: Math.floor(Math.random() * craterSets.length),
  };
}

function makeAsteroids() {
  return Array.from({ length: 13 }, (_, index) => createAsteroid(index));
}

export default function AsteroidGame() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>(makeAsteroids);
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const onResize = () => setAsteroids((current) => current.map((asteroid) => ({ ...asteroid })));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const playExplosion = useCallback(() => {
    try {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
      master.connect(ctx.destination);

      const crack = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.28, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      crack.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2100, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.28);
      crack.connect(filter).connect(master);

      const boom = ctx.createOscillator();
      boom.type = "sine";
      boom.frequency.setValueAtTime(125, now);
      boom.frequency.exponentialRampToValueAtTime(38, now + 0.32);
      boom.connect(master);

      crack.start(now);
      boom.start(now);
      crack.stop(now + 0.3);
      boom.stop(now + 0.3);
      window.setTimeout(() => void ctx.close(), 500);
    } catch {
      // Audio remains optional until the browser permits audio from a gesture.
    }
  }, []);

  const explode = (asteroid: Asteroid, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const burstId = Date.now() + asteroid.id;
    setBursts((current) => [...current, { id: burstId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
    playExplosion();
    setAsteroids((current) => current.filter((item) => item.id !== asteroid.id));
    window.setTimeout(() => {
      setAsteroids((current) => [...current, createAsteroid(asteroid.id)]);
      setBursts((current) => current.filter((burst) => burst.id !== burstId));
    }, 900);
  };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {asteroids.map((asteroid) => {
        const craters = craterSets[asteroid.tone];
        return (
          <motion.button
            key={asteroid.id}
            type="button"
            aria-label="Destroy asteroid"
            className="pointer-events-auto absolute overflow-visible"
            style={{
              left: `${asteroid.left}%`,
              top: `${asteroid.top}%`,
              width: asteroid.size,
              height: asteroid.size,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.08 }}
            animate={{
              opacity: [0, 0.92, 0.7, 0.86, 0],
              scale: [0.28, 1, 1.14, 1.34, 2.65],
              x: [0, asteroid.driftX * 0.2, asteroid.driftX * 0.55, asteroid.driftX, asteroid.driftX * 1.18],
              y: [0, asteroid.driftY * 0.15, asteroid.driftY * 0.45, asteroid.driftY, asteroid.driftY * 1.15],
              rotate: [0, asteroid.spin * 0.3, asteroid.spin * 0.65, asteroid.spin, asteroid.spin * 1.15],
            }}
            transition={{ duration: asteroid.duration, delay: asteroid.delay, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.45, opacity: 1 }}
            onClick={(event) => explode(asteroid, event)}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]">
              <defs>
                <radialGradient id={`rock-${asteroid.id}`} cx="32%" cy="25%" r="80%">
                  <stop offset="0%" stopColor="#a4a7ad" stopOpacity="0.9" />
                  <stop offset="38%" stopColor="#62666d" stopOpacity="0.96" />
                  <stop offset="72%" stopColor="#343840" stopOpacity="1" />
                  <stop offset="100%" stopColor="#11141a" stopOpacity="1" />
                </radialGradient>
                <filter id={`rockTexture-${asteroid.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="3" seed={asteroid.id + 11} result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
              </defs>

              <path
                d={asteroidShapes[asteroid.shape]}
                fill={`url(#rock-${asteroid.id})`}
                stroke="#b7bac1"
                strokeOpacity="0.28"
                strokeWidth="1.1"
                filter={`url(#rockTexture-${asteroid.id})`}
              />

              {craters.map(([cx, cy, radius], index) => (
                <g key={index} opacity={0.82 - index * 0.08}>
                  <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 0.76} fill="#11141a" opacity="0.58" />
                  <ellipse cx={cx - radius * 0.2} cy={cy - radius * 0.16} rx={radius * 0.68} ry={radius * 0.46} fill="#a0a3aa" opacity="0.16" />
                  <ellipse cx={cx + radius * 0.12} cy={cy + radius * 0.18} rx={radius * 0.64} ry={radius * 0.4} fill="#05070b" opacity="0.35" />
                </g>
              ))}

              <path d={asteroidShapes[asteroid.shape]} fill="none" stroke="#f4f5f6" strokeOpacity="0.08" strokeWidth="1.5" />
            </svg>
          </motion.button>
        );
      })}

      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="pointer-events-none fixed z-[4]"
            style={{ left: burst.x, top: burst.y }}
            initial={{ opacity: 1, scale: 0.15 }}
            animate={{ opacity: 0, scale: 3.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: "easeOut" }}
          >
            <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_30px_12px_rgba(125,211,252,0.34)]" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-cyan)]/45"
              animate={{ scale: [0.2, 4.5], opacity: [0.9, 0] }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.i
                key={index}
                className="absolute left-1/2 top-1/2 block h-px w-5 origin-left bg-[var(--accent-cyan)]/70"
                style={{ rotate: index * 45 }}
                animate={{ x: [0, 42 + index * 4], opacity: [0.9, 0], scaleX: [0.5, 1] }}
                transition={{ duration: 0.48 + index * 0.015, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
