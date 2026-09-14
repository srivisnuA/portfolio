"use client";

import { ArrowUpRight, Fuel, TrendingUp, Telescope, Users, ScanFace } from "lucide-react";
import Reveal from "./Reveal";

const projects = [
  {
    title: "Refueling Safety & Fraud Detection",
    description:
      "A real-time vision system for safer vehicle refueling, combining safety detection, fuel classification, and anomaly checks in one workflow.",
    detail:
      "YOLOv8 tracks the nozzle, a CNN classifies fuel grades, and OCR validates meter readings; Flask exposes live camera feeds, safety status, and anomaly alerts.",
    stack: ["Python", "YOLOv8", "CNN", "Flask", "OpenCV", "OCR"],
    href: "https://github.com/srivisnuA/Vision-Based-Safety-Lapse-Detection-During-Vehicle-Refueling",
    icon: Fuel,
    span: "lg:col-span-2 lg:row-span-2",
    accent: "var(--accent-cyan)",
  },
  {
    title: "Historical Stock Analysis & Prediction",
    description:
      "Turns market history and scraped fundamentals into an interpretable financial analysis and forecasting workflow.",
    detail:
      "yfinance provides historical prices while BeautifulSoup collects revenue data; Pandas handles transformation, Plotly and Matplotlib expose trends, and Random Forest estimates future prices.",
    stack: ["Python", "Pandas", "Scikit-learn", "Plotly", "Matplotlib"],
    href: "https://github.com/srivisnuA/Historical-stock-price-prediction",
    icon: TrendingUp,
    span: "lg:col-span-1",
    accent: "var(--accent-teal)",
  },
  {
    title: "Customer Behavior Analysis & Segmentation",
    description:
      "Transforms customer and sales data into actionable segments, dashboards, and business-facing visual stories.",
    detail:
      "Cleaned and explored datasets with Pandas and NumPy, applied clustering to behavioral features, and built interactive Excel and Tableau views for segment-level analysis.",
    stack: ["Pandas", "NumPy", "Scikit-learn", "Excel", "Tableau"],
    href: "https://github.com/srivisnuA/customer-segmentation-analysis",
    icon: Users,
    span: "lg:col-span-1",
    accent: "#B39DFF",
  },
  {
    title: "FaceFare — Contactless Transit Payments",
    description:
      "A facial-recognition payment concept connecting passenger identification, fare calculation, wallet flows, and transaction processing.",
    detail:
      "Built with OpenCV, MTCNN, and FaceNet; structured passenger, trip, wallet, and transaction workflows around a privacy-preserving identity architecture that led to an Indian patent application.",
    stack: ["Python", "OpenCV", "MTCNN", "FaceNet"],
    href: "https://github.com/srivisnuA/FaceFare",
    icon: ScanFace,
    span: "lg:col-span-2",
    accent: "var(--accent-amber)",
  },
  {
    title: "ISRO OHRC Image Enhancement",
    description:
      "A desktop workflow for improving low-light lunar imagery with controlled enhancement and annotation tools.",
    detail:
      "PyQt5 provides live preview controls for brightness, contrast, and gamma correction; OpenCV and Pillow handle the image-processing pipeline.",
    stack: ["Python", "OpenCV", "PyQt5", "Pillow"],
    href: "https://github.com/srivisnuA/Low-light-enhancement-of-ISRO-S-OHRC-image",
    icon: Telescope,
    span: "lg:col-span-2",
    accent: "var(--accent-amber)",
  },
];

export default function EngineeringWorks() {
  return (
    <section id="work" className="relative z-10 px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Engineering works
          </h2>
          <p className="mt-4 max-w-[55ch] text-base text-[var(--text-muted)] sm:text-lg">
            Software that processes, predicts, protects, and pays — with data
            doing the connecting between each idea.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:auto-rows-[minmax(180px,auto)]">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className={p.span}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-panel)] p-7 transition-colors hover:border-[var(--border-hair-strong)]"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.08] blur-3xl transition-opacity group-hover:opacity-[0.16]"
                  style={{ background: p.accent }}
                />
                <div className="relative">
                  <p.icon
                    size={22}
                    strokeWidth={1.5}
                    style={{ color: p.accent }}
                  />
                  <h3 className="font-display mt-5 text-xl font-medium leading-snug sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-[var(--text-muted)] sm:text-[15px]">
                    {p.description}
                  </p>
                  <p className="font-mono mt-3 max-w-[50ch] text-xs leading-relaxed text-[var(--text-faint)]">
                    {p.detail}
                  </p>
                </div>
                <div className="relative mt-6 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono rounded-full border border-[var(--border-hair)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-[var(--text-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
