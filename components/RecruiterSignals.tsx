"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BrainCircuit, Database, LineChart, ShieldCheck } from "lucide-react";

const signals = [
  { value: "06", label: "Projects shipped", icon: Database },
  { value: "01", label: "Patent application", icon: ShieldCheck },
  { value: "12.32%", label: "MGUE reduction", icon: BrainCircuit },
  { value: "+3.7%", label: "PDQ improvement", icon: LineChart },
];

export default function RecruiterSignals() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [0, -70, 0]);

  return (
    <section aria-label="Selected proof points" className="relative z-10 overflow-hidden border-y border-[var(--border-hair)] bg-black/10 py-5 backdrop-blur-[2px]">
      <motion.div style={{ x }} className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
        {signals.map((signal, index) => {
          const Icon = signal.icon;
          return (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group relative flex min-h-[82px] items-center gap-3 border-[var(--border-hair)] px-4 sm:min-h-[96px] sm:px-6"
            >
              <Icon size={17} strokeWidth={1.5} className="shrink-0 text-[var(--accent-cyan)] transition-transform duration-500 group-hover:scale-110" />
              <div className="min-w-0">
                <p className="font-mono text-lg tracking-tight text-[var(--text-primary)] sm:text-xl">{signal.value}</p>
                <p className="mt-0.5 text-xs leading-tight text-[var(--text-faint)]">{signal.label}</p>
              </div>
              <ArrowUpRight size={13} className="ml-auto shrink-0 text-[var(--text-faint)] opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent-cyan)]/40 transition-transform duration-500 group-hover:scale-x-100 sm:inset-x-6" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
