// One row per visit: when, where from, where in the world, on what, and what they did
import { ACTION_LABELS, CONTACT_ACTIONS } from "@/lib/analytics/shared";
import { capital, countryName, duration, flag, timeLabel } from "./format";

const Chips = ({ items, tone }) => (
  <ul className="hq-chips">
    {items.map((item) => (
      <li key={item.text} className={`hq-step${tone || item.tone ? ` hq-step--${tone || item.tone}` : ""}`}>{item.text}</li>
    ))}
  </ul>
);

const None = ({ children = "–" }) => <span className="hq-none">{children}</span>;

export default function VisitorTable({ visitors, empty = "No visits recorded yet." }) {
  if (visitors.length === 0) return <p className="hq-empty">{empty}</p>;
  return (
    <div className="hq-vt" tabIndex={0} role="region" aria-label="Visitors">
      <table>
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">Came from</th>
            <th scope="col">Location</th>
            <th scope="col">Device</th>
            <th scope="col">Scrolled to</th>
            <th scope="col">Projects opened</th>
            <th scope="col">Clicked</th>
            <th scope="col" title="Time between landing and their last tracked action">Active</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => {
            const idle = v.sections.length + v.projects.length + v.actions.length === 0;
            return (
              <tr key={v.sid}>
                <th scope="row">
                  <div className="hq-vt__when">
                    <time dateTime={new Date(v.t).toISOString()}>{timeLabel(v.t)}</time>
                    <span className={`hq-badge${v.returning ? " is-back" : ""}`}>{v.returning ? "Returning" : "New"}</span>
                  </div>
                </th>
                <td>
                  <span className="hq-vt__main">{v.ref === "direct" ? "Direct" : v.ref}</span>
                  {v.src && <span className="hq-vt__sub">?ref={v.src}</span>}
                </td>
                <td>
                  <span className="hq-vt__main">{flag(v.country)} {v.city || countryName(v.country)}</span>
                  {v.city && <span className="hq-vt__sub">{countryName(v.country)}</span>}
                </td>
                <td>
                  <span className="hq-vt__main">{capital(v.device) || "–"}</span>
                  {(v.browser || v.os) && <span className="hq-vt__sub">{[v.browser, v.os].filter(Boolean).join(" · ")}</span>}
                </td>
                <td>
                  {v.sections.length ? (
                    <span className="hq-vt__path">{v.sections.map(capital).join(" → ")}</span>
                  ) : (
                    <None>{idle ? "Didn't scroll" : "–"}</None>
                  )}
                </td>
                <td>
                  {v.projects.length ? <Chips items={v.projects.map((text) => ({ text }))} tone="project" /> : <None />}
                </td>
                <td>
                  {v.actions.length ? (
                    <Chips
                      items={v.actions.map((type) => ({
                        text: ACTION_LABELS[type] ?? type,
                        tone: CONTACT_ACTIONS.includes(type) ? "reach" : "action",
                      }))}
                    />
                  ) : (
                    <None />
                  )}
                </td>
                <td className="hq-vt__num">{duration(v.activeMs)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
