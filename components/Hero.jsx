"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { MdArrowOutward } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { experience, profile, projects } from "@/data/portfolio";
import StudioWindow from "./StudioWindow";

// Whole months between an "MM/YYYY" string and today
const monthsSince = (mmYYYY) => {
  const [month, year] = mmYYYY.split("/").map(Number);
  const now = new Date();
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month) + 1;
};

const Hero = () => {
  const current = experience[0];
  const firstRole = current.roles[current.roles.length - 1];

  // Computed after mount so the static build never shows a stale number
  const [months, setMonths] = useState(null);
  useEffect(() => setMonths(monthsSince(firstRole.start)), [firstRole.start]);

  const stats = [
    { label: "Months on live games", value: months ?? "–" },
    // Only shown once real projects have been added
    ...(projects.length ? [{ label: "Games worked on", value: projects.length }] : []),
  ];

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="blob blob--a" />
        <div className="blob blob--b" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title reveal" style={{ "--d": ".06s" }}>
            <span className="hero__hello">Hi, I&apos;m {profile.shortName}.</span>
            <span className="hero__role">
              <TypeAnimation
                sequence={profile.roles.flatMap((role) => [role, 2200])}
                wrapper="span"
                speed={45}
                className="grad"
                repeat={Infinity}
                cursor={false}
              />
            </span>
          </h1>

          <p className="hero__lede reveal" style={{ "--d": ".12s" }}>{profile.intro}</p>

          <ul className="hero__facts reveal" style={{ "--d": ".15s" }}>
            <li><HiOutlineLocationMarker aria-hidden="true" /> Based in {profile.location}</li>
            <li><span className="hero__live" aria-hidden="true" /> Building live games</li>
          </ul>

          <div className="hero__cta reveal" style={{ "--d": ".18s" }}>
            <a className="btn btn--primary" href="#work">
              <span>View my work</span>
              <MdArrowOutward aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href={profile.cv} target="_blank" rel="noopener noreferrer">
              <span>View résumé</span>
              <MdArrowOutward aria-hidden="true" />
            </a>
          </div>

          {profile.engines?.length > 0 && (
            <div className="hero__engines reveal" style={{ "--d": ".21s" }}>
              <span>Tools</span>
              {profile.engines.map((engine) => <b key={engine}>{engine}</b>)}
            </div>
          )}

          <dl className="stats reveal" style={{ "--d": ".24s" }}>
            {stats.map((stat) => (
              <div className="stats__item" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual reveal" style={{ "--d": ".2s" }}>
          <StudioWindow />
        </div>
      </div>
    </section>
  );
};

export default Hero;
