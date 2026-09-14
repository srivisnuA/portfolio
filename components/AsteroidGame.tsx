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
  shape: string;
};

const shapes = [
  "polygon(50% 5%, 82% 18%, 98% 52%, 80% 86%, 48% 96%, 15% 80%, 4% 46%, 18% 16%)",
  "polygon(38% 4%, 78% 12%, 96% 44%, 84% 78%, 55% 96%, 18% 84%, 5% 50%, 16% 20%)",
  "polygon(50% 3%, 92% 28%, 88% 72%, 54% 97%, 20% 84%, 4% 50%, 18% 20%)",
  "polygon(28% 6%, 72% 8%, 96% 38%, 82% 82%, 50% 97%, 12% 76%, 4% 40%)",
];

function createAsteroid(id: number): Asteroid {
  const direction = Math.random() > 0.5 ? 1 : -1;
  return {
    id,
    left: 5 + Math.random() * 90,
    top: 8 + Math.random() * 82,
    size: 24 + Math.random() * 52,
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 5,
    driftX: direction * (80 + Math.random() * 220),
    driftY: -120 + Math.random() * 240,
    spin: (direction * (180 + Math.random() * 420)),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
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
      master.gain.exponentialRampToValueAtTime(0.075, now + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      master.connect(ctx.destination);

      const crack = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.28, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      crack.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.28);
      crack.connect(filter).connect(master);

      const boom = ctx.createOscillator();
      boom.type = "sine";
      boom.frequency.setValueAtTime(115, now);
      boom.frequency.exponentialRampToValueAtTime(42, now + 0.3);
      boom.connect(master);

      crack.start(now);
      boom.start(now);
      crack.stop(now + 0.3);
      boom.stop(now + 0.3);
      window.setTimeout(() => void ctx.close(), 500);
    } catch {
      // Audio can be unavailable until a user gesture occurs; the visual effect still works.
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
      {asteroids.map((asteroid) => (
        <motion.button
          key={asteroid.id}
          type="button"
          aria-label="Destroy asteroid"
          className="pointer-events-auto absolute rounded-full border border-white/[0.08] bg-white/[0.025] shadow-[inset_-7px_-9px_18px_rgba(0,0,0,0.45),0_0_24px_rgba(125,211,252,0.045)] backdrop-blur-[1px]"
          style={{
            left: `${asteroid.left}%`,
            top: `${asteroid.top}%`,
            width: asteroid.size,
            height: asteroid.size,
            clipPath: asteroid.shape,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.15 }}
          animate={{
            opacity: [0, 0.68, 0.55, 0.7, 0],
            scale: [0.35, 1, 1.16, 1.35, 2.4],
            x: [0, asteroid.driftX * 0.2, asteroid.driftX * 0.55, asteroid.driftX, asteroid.driftX * 1.18],
            y: [0, asteroid.driftY * 0.15, asteroid.driftY * 0.45, asteroid.driftY, asteroid.driftY * 1.15],
            rotate: [0, asteroid.spin * 0.3, asteroid.spin * 0.65, asteroid.spin, asteroid.spin * 1.15],
          }}
          transition={{
            duration: asteroid.duration,
            delay: asteroid.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ scale: 1.5, opacity: 1 }}
        >
          <span className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(231,233,238,0.18),transparent_22%),radial-gradient(circle_at_62%_70%,rgba(125,211,252,0.12),transparent_26%),#151820]" />
          <span className="absolute left-[30%] top-[28%] h-[18%] w-[18%] rounded-full bg-white/[0.06] blur-[1px]" />
          <span className="absolute bottom-[22%] right-[24%] h-[14%] w-[14%] rounded-full bg-black/35" />
        </motion.button>
      ))}

      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="pointer-events-none fixed z-[4]"
            style={{ left: burst.x, top: burst.y }}
            initial={{ opacity: 1, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_28px_10px_rgba(125,211,252,0.32)]" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-cyan)]/35"
              animate={{ scale: [0.3, 3.8], opacity: [0.8, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
