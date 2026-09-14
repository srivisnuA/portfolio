"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

type Packet = { edge: number; t: number; speed: number };

export default function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes: Node[] = [];
    const packets: Packet[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let scrollVelocity = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.length = 0;
      const count = Math.min(44, Math.max(22, Math.floor(width / 34)));
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 1.2 + Math.random() * 1.8,
        });
      }
      packets.length = 0;
      for (let i = 0; i < 10; i += 1) packets.push({ edge: i % Math.max(1, count - 1), t: Math.random(), speed: 0.0018 + Math.random() * 0.0022 });
    };

    const onPointer = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      scrollVelocity = Math.max(-1.8, Math.min(1.8, ((window.scrollY - lastScroll) / dt) * 0.9));
      lastScroll = window.scrollY;
      lastTime = now;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const speed = reduceMotion ? 0 : scrollVelocity;
      scrollVelocity *= 0.92;

      const driftX = speed * 8;
      const driftY = speed * -13;

      for (const node of nodes) {
        if (!reduceMotion) {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 0) {
            const pull = (1 - dist / 180) * 0.012;
            node.vx += dx * pull;
            node.vy += dy * pull;
          }
          node.vx *= 0.985;
          node.vy *= 0.985;
          node.x += node.vx + driftX;
          node.y += node.vy + driftY;
          if (node.x < -40) node.x = width + 40;
          if (node.x > width + 40) node.x = -40;
          if (node.y < -40) node.y = height + 40;
          if (node.y > height + 40) node.y = -40;
        }
      }

      const maxDist = 145;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const alpha = (1 - dist / maxDist) * 0.17;
          ctx.strokeStyle = `rgba(125,211,252,${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        const near = Math.hypot(mouseX - node.x, mouseY - node.y);
        const glow = near < 150 ? (1 - near / 150) : 0;
        ctx.fillStyle = `rgba(231,233,238,${0.16 + glow * 0.55})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + glow * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        for (const packet of packets) {
          packet.t += packet.speed * (1 + Math.abs(speed) * 7);
          if (packet.t > 1) {
            packet.t = 0;
            packet.edge = Math.floor(Math.random() * Math.max(1, nodes.length - 1));
          }
          const a = nodes[packet.edge % nodes.length];
          const b = nodes[(packet.edge + 1) % nodes.length];
          const x = a.x + (b.x - a.x) * packet.t;
          const y = a.y + (b.y - a.y) * packet.t;
          ctx.fillStyle = "rgba(94,234,212,0.72)";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(94,234,212,0.8)";
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      if (Math.abs(speed) > 0.08) {
        const pulse = Math.min(1, Math.abs(speed) / 1.2);
        ctx.strokeStyle = `rgba(125,211,252,${pulse * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.5 + Math.sin(time * 0.002) * 35);
        ctx.lineTo(width, height * 0.5 - Math.sin(time * 0.002) * 35);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] opacity-[0.68]" />;
}
