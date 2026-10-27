"use client";

import { useEffect, useRef } from "react";

// Site-wide scroll effects: progress bar, reveal-on-scroll and the cursor spotlight.
const Effects = () => {
  const barRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onMove = (e) => {
      if (spotRef.current) {
        spotRef.current.style.setProperty("--x", `${e.clientX}px`);
        spotRef.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={barRef} className="progress__bar" />
      </div>
      <div ref={spotRef} className="spotlight" aria-hidden="true" />
    </>
  );
};

export default Effects;
