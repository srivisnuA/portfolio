"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Mail, FileText, ArrowDown, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Hero() {
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);

  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 sm:px-10">
      {showSoundPrompt && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ delay: 1.7, duration: 0.45 }}
          onPointerDown={() => setShowSoundPrompt(false)}
          className="focus-ring fixed left-1/2 top-[76px] z-40 -translate-x-1/2 rounded-full border border-white/10 bg-[#10131a]/75 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-[var(--text-muted)] shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-[var(--accent-cyan)]/35 hover:text-[var(--text-primary)] sm:top-[82px] sm:px-5 sm:py-2.5 sm:text-xs"
        >
          TAP FOR SOUND
        </motion.button>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-4xl"
      >
        <motion.p
          variants={item}
          className="font-mono text-sm text-[var(--accent-teal)] tracking-tight"
        >
          Chennai, India — Software Engineering · Data Analytics · Machine Learning
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display mt-6 text-[13vw] leading-[0.95] font-medium tracking-tight text-[var(--text-primary)] sm:text-[7.5rem]"
        >
          Srivisnu A
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-[52ch] text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl"
        >
          I write the code, read the patterns, and turn both into products that
          work — from software systems and data stories to models that move
          ideas from insight to impact.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[#0A0B10] transition-opacity hover:opacity-85"
          >
            Explore work
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </a>
          <a
            href="https://github.com/srivisnuA"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-[var(--border-hair-strong)] bg-[var(--bg-panel)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cyan)]/40 hover:bg-[#171a24]"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
          <a
            href="mailto:srivisnu824@gmail.com"
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-[var(--border-hair-strong)] bg-[var(--bg-panel)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cyan)]/40 hover:bg-[#171a24]"
          >
            <Mail size={16} strokeWidth={1.75} />
            srivisnu824@gmail.com
            <span className="font-mono text-[var(--text-faint)]">
              · +91 97908 83661
            </span>
          </a>
          <a
            href="https://drive.google.com/file/d/1xJ400TNM-s6_waNdHSwJFZs8Xgh45jhN/view?usp=drivesdk"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border-hair-strong)] bg-[var(--bg-panel)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cyan)]/40 hover:bg-[#171a24]"
          >
            <FileText size={16} strokeWidth={1.75} />
            Resume
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--text-faint)]"
        >
          <ArrowDown size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
