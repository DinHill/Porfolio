"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HiOutlineCube, HiOutlineLockClosed } from "react-icons/hi";
import { projectKinds, projects } from "@/data/portfolio";
import { engineIcon } from "@/lib/engineIcons";
import { projectAnchor } from "@/lib/slug";
import SectionHead from "./SectionHead";
import ProjectDialog from "./ProjectDialog";

const ALL = "all";

// Cards without a screenshot show the engine's mark, or a cube if the engine has none
const placeholderIcon = (project) => {
  const Icon = engineIcon(project.engine) ?? HiOutlineCube;
  return <Icon />;
};

// Filter chips with counts; hidden when there is only one option to choose from
const FilterGroup = ({ label, options, value, onChange }) => {
  if (options.length < 2) return null;
  return (
    <div className="filters__group" role="group" aria-label={label}>
      <span className="filters__label">{label}</span>
      {[{ value: ALL, label: "All", count: projects.length }, ...options].map((option) => (
        <button
          key={option.value}
          className={`filters__chip ${value === option.value ? "is-active" : ""}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label} <b>{option.count}</b>
        </button>
      ))}
    </div>
  );
};

const countBy = (key, labelFor = (v) => v) =>
  Object.entries(
    projects.reduce((acc, project) => ({ ...acc, [project[key]]: (acc[project[key]] ?? 0) + 1 }), {})
  ).map(([value, count]) => ({ value, label: labelFor(value), count }));

const Work = () => {
  const [kind, setKind] = useState(ALL);
  const [engine, setEngine] = useState(ALL);
  const [openIndex, setOpenIndex] = useState(null);

  const kindOptions = useMemo(() => countBy("kind", (v) => projectKinds[v] ?? v), []);
  const engineOptions = useMemo(() => countBy("engine"), []);

  const visible = projects.filter(
    (project) => (kind === ALL || project.kind === kind) && (engine === ALL || project.engine === engine)
  );

  // Open a case study from a link like #project-push-and-slide (used by the Experience section)
  const openFromHash = useCallback(() => {
    const index = projects.findIndex((project) => `#${projectAnchor(project.title)}` === window.location.hash);
    if (index >= 0) setOpenIndex(index);
  }, []);
  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openFromHash]);

  const close = () => {
    setOpenIndex(null);
    if (window.location.hash.startsWith("#project-")) history.replaceState(null, "", "#work");
  };

  return (
    <section className="section section--alt" id="work" aria-label="Selected work">
      <div className="wrap">
        <SectionHead num="01" eyebrow="Selected work" title="Made to play." muted="Pick a level.">
          Live Roblox games and Unreal Engine 5 work I&apos;ve contributed to. Open any project to see what it&apos;s
          about — and my part in it.
        </SectionHead>

        {projects.length === 0 ? (
          <div className="work-empty reveal">
            <span className="work-empty__icon" aria-hidden="true"><HiOutlineCube /></span>
            <h3>New levels loading…</h3>
            <p>I&apos;m putting together my latest Roblox work. Check back soon.</p>
            <span className="work-empty__bar" aria-hidden="true"><i /></span>
          </div>
        ) : (
          <>
            <div className="filters reveal">
              <FilterGroup label="Type" options={kindOptions} value={kind} onChange={setKind} />
              <FilterGroup label="Engine" options={engineOptions} value={engine} onChange={setEngine} />
            </div>

            <div className="projects">
              {visible.map((project) => {
                const index = projects.indexOf(project);
                return (
                  <article
                    className="proj"
                    id={projectAnchor(project.title)}
                    key={project.title}
                    style={{ "--accent": project.accent ?? "var(--violet)" }}
                  >
                    <button className="proj__open" onClick={() => setOpenIndex(index)} aria-label={`Open ${project.title}`} />
                    <div className="proj__preview">
                      {project.image ? (
                        <Image src={project.image} alt="" fill sizes="(max-width: 760px) 100vw, 400px" />
                      ) : (
                        <span className="proj__placeholder" aria-hidden="true">{placeholderIcon(project)}</span>
                      )}
                      <span className="proj__level">LV {String(index + 1).padStart(2, "0")}</span>
                      {project.confidential ? (
                        <span className="proj__status proj__status--locked">
                          <HiOutlineLockClosed aria-hidden="true" /> Confidential
                        </span>
                      ) : (
                        project.status && <span className="proj__status">{project.status}</span>
                      )}
                    </div>
                    <div className="proj__body">
                      <div className="proj__meta">
                        <span className="chip">{projectKinds[project.kind] ?? project.kind}</span>
                        {[project.company, project.teamSize && `${project.teamSize} people`, project.year]
                          .filter(Boolean)
                          .map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.hook}</p>
                      <div className="proj__foot">
                        <span>{[project.engine, project.genre].filter(Boolean).join(" · ")}</span>
                        <b aria-hidden="true">View project ↗</b>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {visible.length === 0 && <p className="filters__none">No projects match these filters.</p>}
          </>
        )}
      </div>

      <ProjectDialog
        project={openIndex === null ? null : projects[openIndex]}
        onClose={close}
        onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : null}
        onNext={openIndex !== null && openIndex < projects.length - 1 ? () => setOpenIndex(openIndex + 1) : null}
      />
    </section>
  );
};

export default Work;
