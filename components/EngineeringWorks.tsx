"use client";

import { ArrowUpRight, Fuel, TrendingUp, Telescope, Users } from "lucide-react";
import Reveal from "./Reveal";

const projects = [
  {
    title: "Refueling Safety & Fraud Detection",
    description:
      "Real-time nozzle tracking and fuel-type classification during vehicle refueling, built at ACE-Hacks 2025 with Renault's AI Lab. Flags unsafe handling and meter-tampering scams as they happen.",
    detail:
      "YOLOv8 handles nozzle localization frame-by-frame; a separate CNN classifies fuel grade (E5/E10/E20) from pump labels; OCR cross-checks the meter reading against expected dispense rate to catch tampering.",
    stack: ["YOLOv8", "CNN", "Flask", "OpenCV", "OCR"],
    href: "https://github.com/srivisnuA/Vision-Based-Safety-Lapse-Detection-During-Vehicle-Refueling",
    icon: Fuel,
    span: "lg:col-span-2 lg:row-span-2",
    accent: "var(--accent-cyan)",
  },
  {
    title: "Historical Stock Price Prediction",
    description:
      "Merges scraped fundamentals with market data to forecast price trends with a Random Forest model.",
    detail:
      "yfinance supplies OHLC price history; BeautifulSoup scrapes revenue data from MacroTrends; both feed a RandomForestRegressor, with Plotly rendering actual-vs-predicted trend lines.",
    stack: ["Scikit-learn", "BeautifulSoup", "yfinance", "Plotly"],
    href: "https://github.com/srivisnuA/Historical-stock-price-prediction",
    icon: TrendingUp,
    span: "lg:col-span-1",
    accent: "var(--accent-teal)",
  },
  {
    title: "Customer Segmentation Analysis",
    description:
      "Clusters customer behavior data to surface distinct spending segments for targeted business decisions.",
    detail:
      "K-Means clustering over purchase-history features, with results exported into a Tableau workbook for stakeholder-facing exploration rather than a static report.",
    stack: ["Scikit-learn", "Pandas", "Tableau"],
    href: "https://github.com/srivisnuA/customer-segmentation-analysis",
    icon: Users,
    span: "lg:col-span-1",
    accent: "#B39DFF",
  },
  {
    title: "ISRO OHRC Image Enhancement",
    description:
      "A desktop tool for enhancing low-light lunar orbiter imagery from ISRO's OHRC camera — brightness, contrast, and gamma correction with an annotation workflow.",
    detail:
      "PyQt5 desktop app with live-preview sliders for brightness, contrast, and gamma; built for reviewing and annotating deep-space frames where standard exposure falls short.",
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
            Vision systems, forecasting pipelines, and tools for domains I
            hadn&apos;t worked in until the project demanded it.
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
