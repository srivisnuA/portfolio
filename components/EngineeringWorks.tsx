"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Fuel, TrendingUp, Telescope, Users, ScanFace, BrainCircuit } from "lucide-react";
import Reveal from "./Reveal";

type VisualKind = "fuel" | "market" | "segments" | "face" | "lunar" | "game";

const projects: Array<{
  title: string;
  description: string;
  detail: string;
  stack: string[];
  href: string;
  icon: typeof Fuel;
  accent: string;
  visual: VisualKind;
  metric?: string;
}> = [
  {
    title: "Refueling Safety & Fraud Detection",
    description:
      "A real-time vision system for safer vehicle refueling, combining safety detection, fuel classification, and anomaly checks.",
    detail:
      "YOLOv8, CNN, OCR, Flask, and OpenCV work together across camera feeds, fuel recognition, meter validation, and anomaly alerts.",
    stack: ["Python", "YOLOv8", "CNN", "Flask", "OpenCV"],
    href: "https://github.com/srivisnuA/Vision-Based-Safety-Lapse-Detection-During-Vehicle-Refueling",
    icon: Fuel,
    accent: "var(--accent-cyan)",
    visual: "fuel",
  },
  {
    title: "Historical Stock Analysis & Prediction",
    description:
      "A financial analysis workflow built from market history, scraped fundamentals, transformation, visualization, and prediction.",
    detail:
      "Pandas, Plotly, Matplotlib, and Random Forest turn historical prices and revenue data into interpretable trends and forecasts.",
    stack: ["Python", "Pandas", "Scikit-learn", "Plotly", "Matplotlib"],
    href: "https://github.com/srivisnuA/Historical-stock-price-prediction",
    icon: TrendingUp,
    accent: "var(--accent-teal)",
    visual: "market",
  },
  {
    title: "Customer Behavior Analysis & Segmentation",
    description:
      "Customer and sales data transformed into behavioral segments, dashboards, and business-facing visual stories.",
    detail:
      "Pandas and NumPy support cleaning and exploration, while clustering, Excel, and Tableau surface segment-level patterns.",
    stack: ["Pandas", "NumPy", "Scikit-learn", "Excel", "Tableau"],
    href: "https://github.com/srivisnuA/customer-segmentation-analysis",
    icon: Users,
    accent: "#B39DFF",
    visual: "segments",
  },
  {
    title: "FaceFare — Contactless Transit Payments",
    description:
      "A facial-recognition payment concept connecting passenger identification, fare calculation, wallet flows, and transactions.",
    detail:
      "OpenCV, MTCNN, and FaceNet power the recognition workflow behind a privacy-focused transit payment concept and patent application.",
    stack: ["Python", "OpenCV", "MTCNN", "FaceNet"],
    href: "https://github.com/srivisnuA/FaceFare",
    icon: ScanFace,
    accent: "var(--accent-amber)",
    visual: "face",
  },
  {
    title: "ISRO OHRC Image Enhancement",
    description:
      "A desktop workflow for improving low-light lunar imagery with controlled enhancement and annotation tools.",
    detail:
      "PyQt5, OpenCV, and Pillow provide live brightness, contrast, and gamma controls for an image-processing workflow.",
    stack: ["Python", "OpenCV", "PyQt5", "Pillow"],
    href: "https://github.com/srivisnuA/Low-light-enhancement-of-ISRO-S-OHRC-image",
    icon: Telescope,
    accent: "var(--accent-amber)",
    visual: "lunar",
  },
  {
    title: "ChestXpert — Explainable Chest X-Ray AI",
    description:
      "A research-oriented healthcare AI prototype for multi-label chest X-ray abnormality classification with transparent model explanations.",
    detail:
      "PyTorch and ResNet-18 power 14-label prediction, while Grad-CAM, DICOM preprocessing, Flask REST APIs, and Streamlit support explainable review workflows.",
    stack: ["Python", "PyTorch", "ResNet-18", "Grad-CAM", "Flask"],
    href: "https://github.com/srivisnuA/ChestXpert-Explainable-Chest-X-Ray-AI",
    icon: BrainCircuit,
    accent: "var(--accent-cyan)",
    visual: "game",
  },
  {
    title: "Game-Theory OD — Probabilistic Object Detection",
    description:
      "An uncertainty-aware object detection framework that treats competing detection anchors as players in a non-cooperative game.",
    detail:
      "Game-Theoretic NMS, unified uncertainty estimation, OOD awareness, and temporal fusion are combined to retain richer detection context.",
    stack: ["Python", "PyTorch", "OpenCV", "GT-NMS", "OOD"],
    href: "https://github.com/srivisnuA?tab=repositories",
    icon: BrainCircuit,
    accent: "#B39DFF",
    visual: "game",
    metric: "PDQ 0.76 · MGUE 0.36",
  },
];

function ProjectVisual({ kind, accent }: { kind: VisualKind; accent: string }) {
  if (kind === "fuel") {
    return (
      <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: accent }}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: accent, left: `${37 + i * 11}%`, top: `${28 + (i % 2) * 28}%` }}
            animate={{ y: [0, -8, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <motion.div
          className="absolute inset-y-0 w-px"
          style={{ background: accent }}
          animate={{ x: [0, 520] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (kind === "market") {
    return (
      <div className="flex h-20 items-end gap-1 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10 px-4 py-3">
        {[28, 42, 34, 58, 46, 70, 56, 76, 64, 82, 72, 88].map((height, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ background: accent, opacity: 0.28 + i * 0.045 }}
            animate={{ height: [`${height * 0.72}%`, `${height}%`, `${height * 0.8}%`] }}
            transition={{ duration: 1.4 + (i % 4) * 0.12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute ml-2 h-px w-[78%] self-start"
          style={{ background: accent }}
          animate={{ y: [14, 5, 12], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (kind === "segments") {
    return (
      <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: accent }}
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        {[{ x: "28%", y: "28%" }, { x: "65%", y: "26%" }, { x: "27%", y: "68%" }, { x: "67%", y: "66%" }].map((point, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ left: point.x, top: point.y, background: accent }}
            animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.7 + i * 0.15, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    );
  }

  if (kind === "face") {
    return (
      <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10">
        <div className="absolute inset-4 rounded-lg border" style={{ borderColor: `${accent}55` }} />
        <motion.div
          className="absolute left-5 right-5 h-px"
          style={{ background: accent }}
          animate={{ top: [18, 54, 18] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: accent }}
          animate={{ scale: [0.88, 1.1, 0.88], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (kind === "lunar") {
    return (
      <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: accent }}
          animate={{ boxShadow: [`0 0 0 ${accent}00`, `0 0 26px ${accent}55`, `0 0 0 ${accent}00`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-12 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border"
          style={{ borderColor: `${accent}66` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
        />
        {[18, 32, 74].map((left, i) => (
          <motion.span
            key={left}
            className="absolute h-1 w-1 rounded-full"
            style={{ left: `${left}%`, top: `${28 + i * 14}%`, background: accent }}
            animate={{ opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 1.7 + i * 0.25, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-20 overflow-hidden rounded-xl border border-[var(--border-hair)] bg-black/10">
      <motion.div
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: accent }}
        animate={{ scale: [0.8, 1.25, 0.8], boxShadow: [`0 0 0 ${accent}00`, `0 0 18px ${accent}66`, `0 0 0 ${accent}00`] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: accent }}
          animate={{
            x: [Math.cos(i * Math.PI / 2) * 8, Math.cos(i * Math.PI / 2) * 34],
            y: [Math.sin(i * Math.PI / 2) * 8, Math.sin(i * Math.PI / 2) * 34],
            opacity: [0.35, 0.95, 0.35],
          }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${accent}35` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function EngineeringWorks() {
  return (
    <section id="work" className="relative z-10 px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div id="engineering" className="scroll-mt-28">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--accent-cyan)]">02</span>
                  <span className="h-px w-10 bg-[var(--border-hair-strong)]" />
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--text-faint)]">SELECTED WORK</span>
                </div>
                <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
                  Engineering works
                </h2>
                <p className="mt-4 max-w-[55ch] text-base text-[var(--text-muted)] sm:text-lg">
                  Software that processes, predicts, protects, and pays — with data
                  doing the connecting between each idea.
                </p>
              </div>
              <span className="hidden font-mono text-xs text-[var(--text-faint)] sm:block">
                07 PROJECTS
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.title} on GitHub`}
                className="focus-ring group relative flex h-[410px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-panel)] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--border-hair-strong)] hover:shadow-2xl hover:shadow-black/20 sm:p-7"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-[0.07] blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-[0.16]"
                  style={{ background: p.accent }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100" style={{ background: p.accent }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-[var(--text-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p.icon size={22} strokeWidth={1.5} style={{ color: p.accent }} />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-medium leading-snug sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)] sm:text-[15px]">
                    {p.description}
                  </p>
                  <p className="font-mono mt-3 line-clamp-3 text-xs leading-relaxed text-[var(--text-faint)]">
                    {p.detail}
                  </p>
                  <div className="mt-4">
                    <ProjectVisual kind={p.visual} accent={p.accent} />
                  </div>
                  {p.metric && (
                    <span className="font-mono mt-3 inline-flex rounded-full border border-[var(--border-hair)] px-2.5 py-1 text-[10px] text-[var(--text-faint)]">
                      {p.metric}
                    </span>
                  )}
                </div>
                <div className="relative flex items-end justify-between gap-4 pt-4">
                  <div className="flex flex-wrap gap-2 overflow-hidden">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="font-mono rounded-full border border-[var(--border-hair)] px-2.5 py-1 text-[11px] text-[var(--text-muted)] transition-colors group-hover:border-[var(--border-hair-strong)]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight size={18} className="shrink-0 text-[var(--text-faint)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--text-primary)]" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
