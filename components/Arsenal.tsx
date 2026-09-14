"use client";

import Reveal from "./Reveal";

const skillGroups = [
  {
    label: "Software Engineering",
    items: ["Python", "Java", "JavaScript", "SQL", "REST APIs", "Git", "Linux", "Unix Shell Scripting"],
    id: "engineering",
  },
  {
    label: "Data Analytics",
    items: ["Pandas", "NumPy", "EDA", "Data Cleaning", "Feature Engineering", "Excel", "Power BI", "Tableau", "Matplotlib", "Seaborn", "Plotly"],
    id: "analytics",
  },
  {
    label: "Data & Machine Learning",
    items: ["ETL Pipelines", "Web Scraping", "Data Validation", "Scikit-learn", "Regression", "Classification", "Clustering"],
    id: "data-ml",
  },
  {
    label: "Databases & Platforms",
    items: ["MySQL", "PostgreSQL", "SQL Queries", "Joins", "Aggregations", "Jupyter", "VS Code"],
    id: "platforms",
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
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              Code for the system, analysis for the signal, and engineering for
              the handoff between them.
            </p>
            <div className="mt-10 space-y-8">
              {skillGroups.map((group) => (
                <div key={group.label} id={group.id} className="scroll-mt-28">
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
                  Designed Python ETL pipelines, explored datasets with Pandas
                  and NumPy, automated recurring data-processing tasks, and
                  supported feature engineering and model-ready workflows.
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
                <p className="font-mono mt-2 text-xs text-[var(--text-faint)]">
                  CGPA 7.44 / 10.0
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-amber)]" />
                <p className="font-mono text-xs text-[var(--text-faint)]">
                  Mar 2026
                </p>
                <h3 className="font-display mt-1.5 text-lg font-medium">
                  Indian Patent Application
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  FaceFare — Application No. 202641031039 A
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
