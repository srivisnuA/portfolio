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
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);

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
  const lastScroll = useRef({ y: 0, time: 0 });
  const lastTouch = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    document.documentElement.style.setProperty("--custom-cursor", enabled ? "none" : "auto");
    return () => document.documentElement.style.setProperty("--custom-cursor", "auto");
  }, [enabled]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    const unlockAudio = () => {
      if (soundUnlocked.current || !AudioContextClass) return audioRef.current?.ctx ?? null;

      const ctx = audioRef.current?.ctx ?? new AudioContextClass();
      const carrier = ctx.createOscillator();
      const shimmer = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const shimmerGain = ctx.createGain();

      carrier.type = "triangle";
      carrier.frequency.value = 125;

      shimmer.type = "triangle";
      shimmer.frequency.value = 360;

      filter.type = "lowpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.7;

      gain.gain.value = 0.001;
      shimmerGain.gain.value = 0;

      carrier.connect(filter);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      carrier.start();
      shimmer.start();

      audioRef.current = { ctx, carrier, shimmer, filter, gain, shimmerGain };
      soundUnlocked.current = true;
      setReady(true);

      void ctx.resume().then(() => {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.006, now, 0.025);
        shimmerGain.gain.setTargetAtTime(0.002, now, 0.03);
      });

      return ctx;
    };

    const driveAudio = (speed: number) => {
      const normalized = Math.max(0, Math.min(1, speed));
      soundActivity.current = Math.min(
        1,
        soundActivity.current * 0.58 + normalized * 1.1,
      );

      const audio = audioRef.current;
      if (!audio || !enabled) return;

      if (audio.ctx.state !== "running") {
        void audio.ctx.resume();
        return;
      }

      const now = audio.ctx.currentTime;
      const activity = Math.max(soundActivity.current, normalized * 0.5);
      const hoverBoost = hoveringRef.current ? 350 : 0;

      audio.carrier.frequency.setTargetAtTime(115 + normalized * 115, now, 0.035);
      audio.shimmer.frequency.setTargetAtTime(320 + normalized * 220, now, 0.04);
      audio.filter.frequency.setTargetAtTime(
        1050 + normalized * 1700 + hoverBoost,
        now,
        0.045,
      );
      audio.gain.gain.setTargetAtTime(0.004 + activity * 0.038, now, 0.035);
      audio.shimmerGain.gain.setTargetAtTime(activity * 0.014, now, 0.045);
    };

    const coolAudio = () => {
      const audio = audioRef.current;
      if (!audio || audio.ctx.state !== "running") return;
      const now = audio.ctx.currentTime;
      audio.gain.gain.setTargetAtTime(enabled ? 0.0018 : 0, now, 0.16);
      audio.shimmerGain.gain.setTargetAtTime(0, now, 0.12);
    };

    const moveCursorFrame = () => {
      if (finePointer.matches && !reducedMotion.matches) {
        const dx = target.current.x - current.current.x;
        const dy = target.current.y - current.current.y;
        current.current.x += dx * 0.18;
        current.current.y += dy * 0.18;

        if (cursorRef.current) {
          const tilt = Math.max(-22, Math.min(22, dx * 0.45));
          cursorRef.current.style.transform =
            `translate3d(${current.current.x - 10}px, ${current.current.y - 10}px, 0) rotate(${tilt}deg)`;
        }

        if (ringRef.current) {
          ringRef.current.style.transform =
            `translate3d(${current.current.x - 18}px, ${current.current.y - 18}px, 0) scale(${hoveringRef.current ? 1.5 : 1})`;
        }
      }

      const audio = audioRef.current;
      if (audio && audio.ctx.state === "running") {
        soundActivity.current *= 0.955;
        const now = audio.ctx.currentTime;
        const activity = enabled ? soundActivity.current : 0;
        audio.gain.gain.linearRampToValueAtTime(0.0015 + activity * 0.035, now + 0.04);
        audio.shimmerGain.gain.linearRampToValueAtTime(activity * 0.012, now + 0.05);
      }

      rafRef.current = requestAnimationFrame(moveCursorFrame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;

      target.current.x = event.clientX;
      target.current.y = event.clientY;

      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;
      const distance = Math.hypot(dx, dy);

      driveAudio(Math.min(distance / 26, 1));

      lastPoint.current.x = event.clientX;
      lastPoint.current.y = event.clientY;
      setVisible(true);

      const interactive = (event.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, textarea, select",
      );
      setHovering(Boolean(interactive));
    };

    const onPointerDown = () => {
      unlockAudio();
      setShowSoundPrompt(false);

      if (finePointer.matches && !reducedMotion.matches) {
        setVisible(true);
      }

      soundActivity.current = Math.max(soundActivity.current, 0.18);
    };

    const onTouchStart = (event: TouchEvent) => {
      unlockAudio();
      setShowSoundPrompt(false);

      const touch = event.touches[0];
      if (!touch) return;

      lastTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
      };

      soundActivity.current = Math.max(soundActivity.current, 0.2);
      driveAudio(0.25);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      const now = performance.now();
      const previous = lastTouch.current;
      const dt = previous.time ? Math.max(8, now - previous.time) : 16;
      const distance = Math.hypot(
        touch.clientX - previous.x,
        touch.clientY - previous.y,
      );

      driveAudio(Math.min(distance / dt / 1.9, 1));

      lastTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };
    };

    const onTouchEnd = () => {
      coolAudio();
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const previous = lastScroll.current;
      const dt = previous.time ? Math.max(8, now - previous.time) : 16;
      const dy = y - previous.y;

      lastScroll.current = { y, time: now };
      driveAudio(Math.min(Math.abs(dy) / dt / 1.25, 1));
    };

    const onPointerLeave = () => {
      if (finePointer.matches) setVisible(false);
      coolAudio();
    };

    const onPointerEnter = () => {
      if (finePointer.matches) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.documentElement.addEventListener("mouseenter", onPointerEnter);

    lastScroll.current = {
      y: window.scrollY,
      time: performance.now(),
    };

    rafRef.current = requestAnimationFrame(moveCursorFrame);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
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

  return (
    <>
      {showSoundPrompt && (
        <button
          type="button"
          onPointerDown={() => setShowSoundPrompt(false)}
          className="focus-ring fixed left-1/2 top-1/2 z-[120] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/55 px-5 py-2.5 font-mono text-[10px] tracking-[0.24em] text-white/75 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
        >
          TAP FOR SOUND
        </button>
      )}

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
