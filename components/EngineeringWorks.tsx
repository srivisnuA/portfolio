"use client";

import { ArrowUpRight, Fuel, TrendingUp, Telescope, Users, ScanFace } from "lucide-react";
import Reveal from "./Reveal";

const projects = [
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
  },
];

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
                05 PROJECTS
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className={i === 3 ? "lg:col-start-1" : i === 4 ? "lg:col-start-2" : ""}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${p.title} on GitHub`}
                className="focus-ring group relative flex h-[370px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-panel)] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--border-hair-strong)] hover:shadow-2xl hover:shadow-black/20 sm:p-7"
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
                </div>
                <div className="relative mt-5 flex items-end justify-between gap-4">
                  <div className="flex flex-wrap gap-2 overflow-hidden">
                    {p.stack.map((s) => (
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
