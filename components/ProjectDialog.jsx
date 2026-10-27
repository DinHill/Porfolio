"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub, FaYoutube } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { projectKinds } from "@/data/portfolio";
import ConfidentialNote from "./ConfidentialNote";

// "https://www.youtube.com/watch?v=ID" or "https://youtu.be/ID" -> embeddable URL
const youtubeEmbed = (url) => {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
};

const ProjectDialog = ({ project, onClose, onPrev, onNext }) => {
  const ref = useRef(null);

  // Native <dialog> handles focus trapping and Esc for us
  useEffect(() => {
    const dialog = ref.current;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const links = project?.links ?? {};
  const embed = youtubeEmbed(links.video);
  const meta = project
    ? [projectKinds[project.kind], project.company, project.year, project.teamSize && `Team of ${project.teamSize}`, project.engine]
        .filter(Boolean)
    : [];

  return (
    <dialog
      ref={ref}
      className="pdialog"
      aria-labelledby="pdialog-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {project && (
        <div className="pdialog__inner" style={{ "--accent": project.accent ?? "var(--violet)" }}>
          <header className="pdialog__head">
            <div>
              <span className="chip">{project.genre ?? project.engine}</span>
              <h2 id="pdialog-title">{project.title}</h2>
              <p className="pdialog__meta">{meta.join(" · ")}</p>
            </div>
            <button className="pdialog__close" onClick={onClose} aria-label="Close">
              <HiX />
            </button>
          </header>

          {embed ? (
            <div className="pdialog__media">
              <iframe
                src={embed}
                title={`${project.title} video`}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            project.image && (
              <div className="pdialog__media">
                <Image src={project.image} alt={`${project.title} screenshot`} fill sizes="(max-width: 860px) 100vw, 820px" />
              </div>
            )
          )}

          <div className="pdialog__body">
            <p className="pdialog__hook">{project.hook}</p>
            {project.context && <p>{project.context}</p>}
            {project.confidential && <ConfidentialNote />}

            {project.contributions?.length > 0 && (
              <>
                <h3>{project.role ? `My part · ${project.role}` : "My part"}</h3>
                {project.involvement && <p className="pdialog__involvement">{project.involvement}</p>}
                <ul className="pdialog__list">
                  {project.contributions.map((item) =>
                    typeof item === "string" ? (
                      <li key={item}>{item}</li>
                    ) : (
                      <li key={item.title}>
                        <b>{item.title}</b>
                        <span>{item.text}</span>
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            {project.tech?.length > 0 && (
              <div className="tags">
                {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
              </div>
            )}

            <div className="pdialog__links">
              {links.play && (
                <a className="btn btn--primary btn--sm" href={links.play} target="_blank" rel="noopener noreferrer">
                  <span>Play</span>
                  <MdArrowOutward aria-hidden="true" />
                </a>
              )}
              {links.video && !embed && (
                <a className="btn btn--ghost btn--sm" href={links.video} target="_blank" rel="noopener noreferrer">
                  <FaYoutube aria-hidden="true" />
                  <span>Video</span>
                </a>
              )}
              {links.github && (
                <a className="btn btn--ghost btn--sm" href={links.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {(onPrev || onNext) && (
            <footer className="pdialog__nav">
              <button className="btn btn--ghost btn--sm" onClick={onPrev} disabled={!onPrev}>← Previous</button>
              <button className="btn btn--ghost btn--sm" onClick={onNext} disabled={!onNext}>Next →</button>
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
};

export default ProjectDialog;
