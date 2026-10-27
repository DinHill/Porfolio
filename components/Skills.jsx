import { skillGroups } from "@/data/portfolio";
import SectionHead from "./SectionHead";

const Skills = () => {
  return (
    <section className="section" id="skills" aria-label="Tech stack">
      <div className="wrap">
        <SectionHead num="03" eyebrow="Tech stack" title="What I build with." muted="From engine to shipped game.">
          The engines, languages and tools I use to build games, grouped by what I use them for.
        </SectionHead>

        <div className="stack">
          {skillGroups.map((group, i) => (
            <article
              className="stack__card reveal"
              key={group.name}
              style={{ "--tone": group.color, "--d": `${(i % 2) * 0.06}s` }}
            >
              <header className="stack__head">
                <i aria-hidden="true" />
                <h3>{group.name}</h3>
                <span>{group.items.length}</span>
              </header>
              <p>{group.summary}</p>
              <ul className="stack__items">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
