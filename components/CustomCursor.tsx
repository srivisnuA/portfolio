"use client";

import { useEffect, useRef, useState } from "react";
import { Rocket, Volume2, VolumeX } from "lucide-react";

type RocketAudio = {
  ctx: AudioContext;
  carrier: OscillatorNode;
  shimmer: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
  shimmerGain: GainNode;
};

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const audioRef = useRef<RocketAudio | null>(null);
  const lastPoint = useRef({ x: 0, y: 0 });
  const soundUnlocked = useRef(false);
  const soundActivity = useRef(0);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const moveCursor = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * 0.18;
      current.current.y += dy * 0.18;

      if (cursorRef.current) {
        const tilt = Math.max(-22, Math.min(22, dx * 0.45));
        cursorRef.current.style.transform = `translate3d(${current.current.x - 10}px, ${current.current.y - 10}px, 0) rotate(${tilt}deg)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x - 18}px, ${current.current.y - 18}px, 0) scale(${hoveringRef.current ? 1.5 : 1})`;
      }

      const audio = audioRef.current;
      if (audio && audio.ctx.state === "running") {
        soundActivity.current *= 0.94;
        const now = audio.ctx.currentTime;
        const targetGain = enabled ? 0.001 + soundActivity.current * 0.016 : 0;
        audio.gain.gain.linearRampToValueAtTime(targetGain, now + 0.035);
        audio.shimmerGain.gain.linearRampToValueAtTime(
          enabled ? soundActivity.current * 0.005 : 0,
          now + 0.045,
        );
      }

      rafRef.current = requestAnimationFrame(moveCursor);
    };

    const unlockAudio = () => {
      if (soundUnlocked.current) return;
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = audioRef.current?.ctx ?? new AudioContextClass();
      const carrier = ctx.createOscillator();
      const shimmer = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const shimmerGain = ctx.createGain();

      carrier.type = "sine";
      carrier.frequency.value = 155;
      shimmer.type = "sine";
      shimmer.frequency.value = 310;

      filter.type = "lowpass";
      filter.frequency.value = 1100;
      filter.Q.value = 0.65;

      gain.gain.value = 0.002;
      shimmerGain.gain.value = 0;

      carrier.connect(filter);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      carrier.start();
      shimmer.start();

      audioRef.current = { ctx, carrier, shimmer, filter, gain, shimmerGain };
      void ctx.resume();
      soundUnlocked.current = true;
      setReady(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;
      const distance = Math.hypot(dx, dy);
      const speed = Math.min(distance / 28, 1);
      const audio = audioRef.current;

      if (enabled && audio && audio.ctx.state === "running") {
        const now = audio.ctx.currentTime;
        soundActivity.current = Math.min(1, soundActivity.current * 0.35 + speed * 0.9);
        audio.carrier.frequency.setTargetAtTime(135 + speed * 95, now, 0.045);
        audio.shimmer.frequency.setTargetAtTime(270 + speed * 190, now, 0.05);
        audio.filter.frequency.setTargetAtTime(850 + speed * 1050 + (hoveringRef.current ? 350 : 0), now, 0.06);
        audio.gain.gain.setTargetAtTime(0.002 + soundActivity.current * 0.018, now, 0.045);
        audio.shimmerGain.gain.setTargetAtTime(soundActivity.current * 0.006, now, 0.055);
      }

      lastPoint.current.x = event.clientX;
      lastPoint.current.y = event.clientY;
      setVisible(true);

      const interactive = (event.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, textarea, select"
      );
      setHovering(Boolean(interactive));
    };

    const onPointerDown = () => unlockAudio();
    const onPointerLeave = () => setVisible(false);
    const onPointerEnter = () => setVisible(true);

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.documentElement.addEventListener("mouseenter", onPointerEnter);
    rafRef.current = requestAnimationFrame(moveCursor);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.documentElement.removeEventListener("mouseenter", onPointerEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const audio = audioRef.current;
      if (audio) {
        try {
          audio.carrier.stop();
          audio.shimmer.stop();
        } catch {
          // Oscillators may already be stopped during cleanup.
        }
        void audio.ctx.close();
      }
      audioRef.current = null;
      soundUnlocked.current = false;
    };
  }, [enabled]);

  useEffect(() => {
    document.documentElement.style.setProperty("--custom-cursor", enabled ? "none" : "auto");
    return () => document.documentElement.style.setProperty("--custom-cursor", "auto");
  }, [enabled]);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition-opacity duration-200 ${visible && enabled ? "opacity-100" : "opacity-0"}`}
        style={{ transitionProperty: "transform, opacity" }}
      />
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[101] flex h-5 w-5 items-center justify-center text-[var(--accent-cyan)] drop-shadow-[0_0_9px_rgba(125,211,252,0.75)] transition-opacity duration-200 ${visible && enabled ? "opacity-100" : "opacity-0"}`}
      >
        <Rocket size={18} strokeWidth={1.7} />
        <span className="pointer-events-none absolute -bottom-1 left-1/2 h-2 w-px -translate-x-1/2 bg-[var(--accent-amber)] opacity-80 blur-[1px]" />
      </div>
      <button
        type="button"
        onClick={() => setEnabled((value) => !value)}
        aria-label={enabled ? "Disable rocket cursor and sound effects" : "Enable rocket cursor and sound effects"}
        title={enabled ? "Rocket cursor and sound on" : "Rocket cursor and sound off"}
        className="focus-ring fixed bottom-5 right-5 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-hair)] bg-[var(--bg-panel)]/85 text-[var(--text-muted)] shadow-lg backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
      >
        {enabled && ready ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </>
  );
}
