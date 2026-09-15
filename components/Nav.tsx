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
    let frame = 0;

    const updateActive = () => {
      frame = 0;

      // Use the actual document positions rather than IntersectionObserver.
      // This is more reliable on mobile where viewport height and browser chrome
      // can change while scrolling back toward the top.
      const offset = window.innerWidth < 640 ? 110 : 130;
      let current = links[0].href;

      for (const link of links) {
        const section = document.querySelector(link.href);
        if (!section) continue;

        const top = section.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + offset >= top) {
          current = link.href;
        }
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setActive(href);

    const target = document.querySelector(href);
    if (!target) return;

    const navOffset = window.innerWidth < 640 ? 86 : 104;
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
