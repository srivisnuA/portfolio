"use client";

import Reveal from "./Reveal";

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "Java", "JavaScript", "SQL"],
  },
  {
    label: "AI & Data",
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "Pandas", "NumPy"],
  },
  {
    label: "Engineering",
    items: ["ETL Pipelines", "Flask", "REST APIs", "Git", "Linux"],
  },
];

export default function Arsenal() {
  return (
    <section id="about" className="relative z-10 px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Technical arsenal
            </h2>
            <div className="mt-10 space-y-8">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-xs text-[var(--text-faint)]">
                    {group.label}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--border-hair)] bg-[var(--bg-panel)] px-3.5 py-1.5 text-sm text-[var(--text-primary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Experience
            </h2>
            <div className="mt-10 space-y-10 border-l border-[var(--border-hair)] pl-6">
              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
                <p className="font-mono text-xs text-[var(--text-faint)]">
                  Sep 2025 — Oct 2025
                </p>
                <h3 className="font-display mt-1.5 text-lg font-medium">
                  AI/ML &amp; Data Engineering Intern
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  O Clock Software, Chennai
                </p>
                <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-[var(--text-muted)]">
                  Built Python ETL pipelines and automation scripts, supported
                  feature engineering for ML models, and worked across
                  version-controlled codebases with the team.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
                <p className="font-mono text-xs text-[var(--text-faint)]">
                  2022 — 2026
                </p>
                <h3 className="font-display mt-1.5 text-lg font-medium">
                  B.E. Computer Science (Data Science)
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Sathyabama Institute of Science and Technology, Chennai
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
