"use client";

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="relative z-10 px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl border-t border-[var(--border-hair)] pt-14">
        <Reveal>
          <h2 className="font-display max-w-xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Have a problem worth building for?
          </h2>
          <p className="mt-4 max-w-[50ch] text-[var(--text-muted)]">
            I&apos;m open to Data Engineering, Machine Learning, and Software
            Engineering roles. Reach out directly, I read everything myself.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:srivisnu824@gmail.com"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[#0A0B10] transition-opacity hover:opacity-85"
            >
              <Mail size={16} strokeWidth={1.75} />
              srivisnu824@gmail.com
            </a>
            <a
              href="tel:+919790883661"
              className="focus-ring font-mono inline-flex items-center gap-2 rounded-full border border-[var(--border-hair-strong)] px-5 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent-cyan)]/40 hover:text-[var(--text-primary)]"
            >
              +91 97908 83661
            </a>
            <a
              href="https://github.com/srivisnuA"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href="https://linkedin.com/in/srivisnuanand"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-[var(--text-faint)] transition-colors hover:text-[var(--text-primary)]"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>Srivisnu A — Chennai, India</p>
          <p>Built with Next.js, Tailwind, and Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
