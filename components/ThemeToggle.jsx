"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { THEME_KEY } from "@/lib/theme";

// Sun in dark mode, moon in light mode. Both icons are in the markup and CSS picks one,
// so the button needs no state and can't mismatch between server and client.
const ThemeToggle = () => {
  const toggle = (e) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private mode: the choice just won't be remembered
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) return apply();

    // The new theme grows out of the button (see ::view-transition-new in globals.css)
    const box = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${box.left + box.width / 2}px`);
    root.style.setProperty("--vt-y", `${box.top + box.height / 2}px`);
    document.startViewTransition(apply);
  };

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Switch between light and dark theme" title="Switch theme">
      <HiOutlineSun className="theme-toggle__sun" aria-hidden="true" />
      <HiOutlineMoon className="theme-toggle__moon" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
