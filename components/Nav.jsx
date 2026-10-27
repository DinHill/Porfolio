"use client";

import { useEffect, useState } from "react";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { MdFileDownload } from "react-icons/md";
import { navLinks, profile } from "@/data/portfolio";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Highlight the link of the section currently on screen
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap nav__inner">
        <a className="brand" href="#top" aria-label={`${profile.shortName} — home`}>
          <span className="brand__sign">{profile.shortName}</span>
          <em>{profile.tagline}</em>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav__link ${active === link.href ? "is-active" : ""}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="btn btn--ghost btn--sm nav__cv" href={profile.cv} download={profile.cvFileName}>
            <MdFileDownload aria-hidden="true" />
            <span>CV</span>
          </a>
          <a className="btn btn--primary btn--sm" href="#contact">Contact</a>
          <button
            className="nav__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="navDrawer"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="nav__scrim" onClick={() => setOpen(false)} />
          <div className="drawer" id="navDrawer">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.name}
              </a>
            ))}
            <a href={profile.cv} download={profile.cvFileName} onClick={() => setOpen(false)}>
              Download CV
            </a>
            <a href="#contact" className="drawer__cta" onClick={() => setOpen(false)}>
              Contact
            </a>
          </div>
        </>
      )}
    </header>
  );
};

export default Nav;
