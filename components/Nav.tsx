"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#patent", label: "Patent" },
  { href: "#work", label: "Work" },
  { href: "#analytics", label: "Analytics" },
  { href: "#engineering", label: "Engineering" },
  { href: "#about", label: "About" },
];

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
    >
      <div className="glass flex items-center gap-1 rounded-full px-2 py-2 shadow-lg shadow-black/20">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="focus-ring rounded-full px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
          >
            {l.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
