"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#top", label: "Home" },
  { href: "#patent", label: "Patent" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "Arsenal" },
];

export default function Nav() {
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.05, 0.15, 0.3, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setActive(href);

    const target = document.querySelector(href);
    if (!target) return;

    const navOffset = window.innerWidth < 640 ? 86 : 104;
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.nav
      aria-label="Primary navigation"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed left-1/2 top-6 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2"
    >
      <div
        className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full px-2 py-2 shadow-lg shadow-black/20"
        style={{ scrollbarWidth: "none" }}
      >
        {links.map((l) => {
          const isActive = active === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              aria-current={isActive ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                handleNavClick(l.href);
              }}
              className="focus-ring relative shrink-0 rounded-full px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            >
              {l.label}
              {isActive && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-x-3 -bottom-0.5 h-px"
                  style={{ background: "var(--accent-cyan)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
