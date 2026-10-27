"use client";

import { useEffect, useState } from "react";
import BlockAvatar from "./BlockAvatar";
import { experience, profile, skillGroups } from "@/data/portfolio";

// Explorer tree — rows with an href jump to that section of the page
const tree = [
  { label: "Workspace", icon: "world", depth: 0 },
  { label: "Projects", icon: "folder", depth: 1, href: "#work" },
  { label: "Experience", icon: "folder", depth: 1, href: "#experience" },
  { label: "StarterGui", icon: "ui", depth: 0 },
  { label: "PlayerHUD", icon: "ui", depth: 1, selected: true },
  { label: "TechStack", icon: "frame", depth: 2, href: "#skills" },
  { label: "AboutMe", icon: "frame", depth: 2, href: "#about" },
  { label: "ServerScriptService", icon: "script", depth: 0 },
  { label: "ContactService", icon: "module", depth: 1, href: "#contact" },
];

const age = (birthday) => {
  const born = new Date(birthday);
  const now = new Date();
  const hadBirthday =
    now.getMonth() > born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate());
  return now.getFullYear() - born.getFullYear() - (hadBirthday ? 0 : 1);
};

const StudioWindow = () => {
  const current = experience[0];
  const role = current.roles[0];
  const hotbar = profile.hotbar ?? skillGroups.flatMap((group) => group.items).slice(0, 4);

  const logs = [
    { type: "info", text: `Loading ${profile.shortName}.rbxl` },
    { type: "ok", text: `${role.title} · since ${role.start}` },
    { type: "ok", text: `Tech stack loaded · ${skillGroups.reduce((n, g) => n + g.items.length, 0)} tools` },
    { type: "warn", text: "Coffee level low · refilling" },
    { type: "ok", text: "Portfolio ready ✓" },
  ];

  // Age depends on the visitor's clock, so it's set after mount; logs then print one by one
  const [level, setLevel] = useState(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setLevel(age(profile.birthday));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShown(logs.length);
      return;
    }
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= logs.length) clearInterval(timer);
        return Math.min(n + 1, logs.length);
      });
    }, 650);
    return () => clearInterval(timer);
  }, [logs.length]);

  return (
    <div className="studio">
      <div className="studio__glow" aria-hidden="true" />
      <div className="studio__bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="studio__file">{profile.shortName.replace(" ", "")}.rbxl</span>
        <span className="studio__badge">Studio</span>
      </div>

      <div className="studio__body">
        <aside className="explorer">
          <div className="panel__head">Explorer</div>
          <ul className="tree">
            {tree.map((row) => {
              const content = (
                <>
                  <span className={`tree__ico tree__ico--${row.icon}`} aria-hidden="true" />
                  {row.label}
                </>
              );
              return (
                <li
                  key={row.label}
                  className={`tree__row ${row.selected ? "is-sel" : ""}`}
                  style={{ "--depth": row.depth }}
                >
                  {row.href ? <a href={row.href}>{content}</a> : <span>{content}</span>}
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="viewport" aria-hidden="true">
          <div className="viewport__top">
            <span className="viewport__tab is-active">Play</span>
            <span className="viewport__tab">Test</span>
            <span className="viewport__fps">60 fps</span>
          </div>
          <div className="viewport__scene">
            <div className="scene__sky" />
            <div className="scene__sun" />
            <div className="scene__ridge scene__ridge--back" />
            <div className="scene__ridge scene__ridge--front" />
            <div className="scene__floor" />

            <div className="mini">
              <div className="mini__vitals">
                <div className="mini__avatar">
                  <BlockAvatar />
                </div>
                <div className="mini__bars">
                  <div className="mini__name">
                    <span>{profile.shortName}</span>
                    <b>LV {level ?? "–"}</b>
                  </div>
                  <div className="mini__bar mini__bar--hp"><i /></div>
                  <div className="mini__bar mini__bar--xp"><i /></div>
                </div>
              </div>

              <div className="mini__quest">
                <span className="mini__quest-dot" />
                <div>
                  <b>{role.title}</b>
                  <em>Active quest · Live games</em>
                </div>
              </div>

              <div className="mini__hotbar">
                {hotbar.map((skill, i) => (
                  <span key={skill} className={`mini__slot ${i === 0 ? "is-on" : ""}`}>
                    <b>{i + 1}</b>
                    <em>{skill}</em>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="props">
          <div className="panel__head">Properties</div>
          <div className="props__group">Player <span>Instance</span></div>
          <div className="props__row"><span>Name</span><b>{profile.name}</b></div>
          <div className="props__row"><span>Role</span><b>{profile.roles[0]}</b></div>
          <div className="props__row"><span>Engines</span><b>Roblox · UE5</b></div>
          <div className="props__row"><span>Language</span><b>Luau</b></div>
          <div className="props__row"><span>Location</span><b>{profile.location}</b></div>
          <div className="props__row"><span>Archivable</span><b className="prop-check">✓</b></div>
        </aside>
      </div>

      <div className="studio__console">
        <div className="console__tabs" aria-hidden="true">
          <span className="is-active">Output</span>
          <span>Command Bar</span>
        </div>
        <div className="console__log" aria-hidden="true">
          {logs.slice(0, shown).map((log, i) => (
            <p key={i} className={`log log--${log.type}`}>
              <span>{`00:0${i}`}</span> {log.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioWindow;
