import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import { education, experience } from "@/data/portfolio";
import { engineIcon } from "@/lib/engineIcons";
import { projectAnchor } from "@/lib/slug";
import SectionHead from "./SectionHead";
import ConfidentialNote from "./ConfidentialNote";

// Square badge: an image logo, an engine mark, or the first letters of the name
const LogoBadge = ({ logo, logoIcon, logoTone, fallback }) => {
  const Icon = logoIcon ? engineIcon(logoIcon) : null;
  return (
    <span className={`xp__logo ${logoTone === "light" ? "xp__logo--light" : ""}`} aria-hidden="true">
      {logo ? <Image src={logo} alt="" width={44} height={44} /> : Icon ? <Icon className="xp__logo-icon" /> : fallback}
    </span>
  );
};

const Role = ({ role }) => (
  <li className={`xp__role ${role.end ? "" : "is-current"}`}>
    <span className="xp__dot" aria-hidden="true" />
    <div className="xp__role-top">
      <h4>{role.title}</h4>
      {role.start && <time>{role.start} – {role.end ?? "Present"}</time>}
    </div>
    {role.summary && <p>{role.summary}</p>}

    {role.highlights?.length > 0 && (
      <dl className="xp__highlights">
        {role.highlights.map((item) => (
          <div key={item.title}>
            <dt>{item.title}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    )}

    {role.projects?.length > 0 && (
      <div className="xp__projects">
        <span>Selected work</span>
        {role.projects.map((title) => (
          <a key={title} href={`#${projectAnchor(title)}`}>{title} <MdArrowOutward aria-hidden="true" /></a>
        ))}
      </div>
    )}

    {role.tools?.length > 0 && (
      <div className="tags xp__tools">
        {role.toolsLabel && <b className="xp__tools-label">{role.toolsLabel}</b>}
        {role.tools.map((tool) => <span key={tool}>{tool}</span>)}
      </div>
    )}

    {role.confidential && <ConfidentialNote />}
  </li>
);

const Experience = () => {
  return (
    <section className="section" id="experience" aria-label="Experience">
      <div className="wrap">
        <SectionHead num="02" eyebrow="Experience" title="Where I've worked." muted="Quest log, newest first.">
          From a freelance Unreal Engine 5 internship to programming live games full-time.
        </SectionHead>

        <div className="xp">
          {experience.map((job) => {
            const current = job.roles.some((role) => !role.end);
            const first = job.roles[job.roles.length - 1];
            return (
              <article className={`xp__card reveal ${current ? "is-current" : ""}`} key={job.company}>
                <header className="xp__side">
                  <LogoBadge {...job} fallback={job.company.slice(0, 2)} />
                  <div>
                    <h3>{job.company}</h3>
                    <p>{job.subtitle}</p>
                  </div>
                  <time className="xp__period">{first.start} – {job.roles[0].end ?? "Present"}</time>
                  {current && <span className="chip chip--live">Current</span>}
                </header>
                <ol className="xp__roles">
                  {job.roles.map((role) => <Role role={role} key={role.title} />)}
                </ol>
              </article>
            );
          })}

          {education.map((item) => (
            <article className="xp__card xp__card--edu reveal" key={item.school}>
              <header className="xp__side">
                <LogoBadge {...item} fallback="🎓" />
                <div>
                  <h3>{item.school}</h3>
                  <p>{item.subtitle ?? "Education"}</p>
                </div>
                <time className="xp__period">{item.years}</time>
              </header>
              <ol className="xp__roles">
                {/* Same layout as a job role. No start date, so no duplicate dates; `end` keeps it from being marked current */}
                <Role
                  role={{
                    title: item.degree,
                    end: item.years,
                    summary: item.summary,
                    highlights: item.highlights,
                    tools: item.coursework,
                    toolsLabel: "Coursework",
                  }}
                />
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
