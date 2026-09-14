"use client";

import { ShieldCheck, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import CodeTerminal from "./CodeTerminal";

const metrics = [
  { label: "Recognition pipeline", value: "MTCNN + FaceNet" },
  { label: "Identity storage", value: "Hash-based, zero raw biometric data" },
  { label: "Filed", value: "Mar 2026" },
  { label: "Status", value: "Patent Application 202641031039 A" },
];

export default function FeaturedPatent() {
  return (
    <section id="patent" className="relative z-10 px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-amber)]/25 bg-[var(--accent-amber)]/[0.06] px-3.5 py-1.5">
            <ShieldCheck size={14} className="text-[var(--accent-amber)]" />
            <span className="font-mono text-xs text-[var(--accent-amber)]">
              Indian Patent Application No. 202641031039 A
            </span>
          </div>
          <h2 className="font-display max-w-2xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            FaceFare replaces the transit ticket with your face —
            and never stores it.
          </h2>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            A contactless fare system built around a simple constraint I set
            for myself: recognize a passenger accurately in real time,
            without ever keeping a copy of their face. Every identity is
            reduced to a cryptographic hash before it touches storage.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal delay={0.1}>
            <CodeTerminal />
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--border-hair)] sm:grid-cols-2">
              {metrics.map((m) => (
                <div key={m.label} className="bg-[var(--bg-panel)] p-6">
                  <dt className="font-mono text-xs text-[var(--text-faint)]">
                    {m.label}
                  </dt>
                  <dd className="font-display mt-2 text-lg leading-snug text-[var(--text-primary)]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href="https://github.com/srivisnuA/FaceFare"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-cyan)] hover:text-[var(--accent-teal)]"
            >
              View the repository
              <ExternalLink
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
