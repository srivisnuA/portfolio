"use client";

import { useEffect, useRef, useState } from "react";
import { Rocket, Volume2, VolumeX } from "lucide-react";

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
  const audioRef = useRef<AudioContext | null>(null);
  const lastSoundAt = useRef(0);
  const lastPoint = useRef({ x: 0, y: 0 });
  const soundUnlocked = useRef(false);

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
        cursorRef.current.style.transform = `translate3d(${current.current.x - 10}px, ${current.current.y - 10}px, 0) rotate(${Math.max(-22, Math.min(22, dx * 0.45))}deg)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.current.x - 18}px, ${current.current.y - 18}px, 0) scale(${hoveringRef.current ? 1.5 : 1})`;
      }
      rafRef.current = requestAnimationFrame(moveCursor);
    };

    const unlockAudio = () => {
      if (soundUnlocked.current) return;
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      audioRef.current = audioRef.current ?? new AudioContextClass();
      void audioRef.current.resume();
      soundUnlocked.current = true;
      setReady(true);
    };

    const playRocketWhoosh = (distance: number) => {
      if (!enabled || !soundUnlocked.current || !audioRef.current || distance < 20) return;
      const now = performance.now();
      if (now - lastSoundAt.current < 115) return;
      lastSoundAt.current = now;

      const ctx = audioRef.current;
      if (ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const startFreq = 180 + Math.min(distance, 110) * 2.2;
      const endFreq = startFreq * 1.8;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.09);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.018, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;
      playRocketWhoosh(Math.hypot(dx, dy));
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
      audioRef.current?.close();
      audioRef.current = null;
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
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition-opacity duration-200 ${
          visible && enabled ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionProperty: "transform, opacity" }}
      />
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[101] flex h-5 w-5 items-center justify-center text-[var(--accent-cyan)] drop-shadow-[0_0_9px_rgba(125,211,252,0.75)] transition-opacity duration-200 ${
          visible && enabled ? "opacity-100" : "opacity-0"
        }`}
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
