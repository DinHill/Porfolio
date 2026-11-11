// Private visitor analytics. Anyone without the owner cookie gets the site's normal 404,
// so the page looks like it doesn't exist. The way in is in components/SecretDoor.jsx.
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { isOwner } from "@/lib/analytics/auth";
import { loadReport, TIME_ZONE } from "@/lib/analytics/data";
import { ACTION_LABELS, CONTACT_ACTIONS } from "@/lib/analytics/shared";
import { storeKind } from "@/lib/analytics/store";
import SignOut from "./SignOut";
import "./hq.css";

const RANGES = [7, 30, 90];

// Nothing in the metadata either, unless it's you
export async function generateMetadata() {
  if (!(await isOwner())) return {};
  return { title: "HQ · Visitor analytics", robots: { index: false, follow: false } };
}

// ---------- formatting ----------

const num = (n) => n.toLocaleString("en-US");
const pct = (part, whole) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–");
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const flag = (code) =>
  /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐";
const countryName = (code) => {
  if (!/^[A-Z]{2}$/.test(code)) return "Unknown";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};
const dateLabel = (day) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const timeLabel = (ms) =>
  new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });

// A clean tick step (1, 2, 5 × 10ⁿ) so the axis reads 0 / step / 2·step
const niceStep = (max) => {
  const raw = Math.max(1, max / 2);
  const pow = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw);
};

const stepLabel = (step) => {
  const [kind, value] = step.e.split(/:(.*)/);
  if (kind === "visit") return { text: "Landed" };
  if (kind === "section") return { text: value[0].toUpperCase() + value.slice(1), tone: "section" };
  if (kind === "project") return { text: value, tone: "project" };
  if (kind === "action") return { text: ACTION_LABELS[value] ?? value, tone: CONTACT_ACTIONS.includes(value) ? "reach" : "action" };
  return { text: step.e };
};

// ---------- pieces ----------

const Card = ({ title, sub, children, className = "" }) => (
  <section className={`hq-card ${className}`}>
    <header className="hq-card__head">
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </header>
    {children}
  </section>
);

// Ranked list with a thin share bar per row; long tails fold into "Other"
const Ranked = ({ rows, label = (name) => name, empty = "Nothing yet.", limit = 8 }) => {
  if (rows.length === 0 || rows.every((row) => row.value === 0)) return <p className="hq-empty">{empty}</p>;
  const shown = rows.slice(0, limit);
  const rest = rows.slice(limit).reduce((sum, row) => sum + row.value, 0);
  if (rest > 0) shown.push({ name: "__other", value: rest });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(...shown.map((row) => row.value));
  return (
    <ul className="hq-rank">
      {shown.map((row) => (
        <li key={row.name}>
          <span className="hq-rank__name">{row.name === "__other" ? "Other" : label(row.name)}</span>
          <span className="hq-rank__value">
            {num(row.value)} <small>{pct(row.value, total)}</small>
          </span>
          <span className="hq-rank__bar" aria-hidden="true">
            {row.value > 0 && <i style={{ width: `${(row.value / max) * 100}%` }} />}
          </span>
        </li>
      ))}
    </ul>
  );
};

const Funnel = ({ steps }) => {
  const top = steps[0].count;
  return (
    <ol className="hq-funnel">
      {steps.map((step, i) => {
        const prev = i > 0 ? steps[i - 1].count : null;
        return (
          <li key={step.id}>
            {prev !== null && (
              <p className="hq-funnel__drop">
                {prev > 0 ? `${pct(step.count, prev)} continued · ${num(prev - step.count)} dropped off` : "—"}
              </p>
            )}
            <div className="hq-funnel__row">
              <span className="hq-funnel__label">
                <b>{i + 1}</b> {step.label}
              </span>
              <span className="hq-funnel__track">
                {step.count > 0 && <i style={{ "--w": step.count / Math.max(top, 1) }} />}
                <span className="hq-funnel__value">
                  {num(step.count)} <small>{i > 0 ? pct(step.count, top) : "100%"}</small>
                </span>
              </span>
            </div>
            {step.anyOrder !== step.count && (
              <p className="hq-funnel__note">{num(step.anyOrder)} reached this step in any order</p>
            )}
          </li>
        );
      })}
    </ol>
  );
};

const DailyChart = ({ daily }) => {
  const step = niceStep(Math.max(...daily.map((d) => d.visits)));
  const max = step * 2;
  const ticks = [max, step, 0];
  const xLabels = new Set([0, Math.floor((daily.length - 1) / 2), daily.length - 1]);
  return (
    <>
      <div className="hq-chart" role="img" aria-label={`Visits per day, last ${daily.length} days. Table below.`}>
        <div className="hq-chart__grid" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} style={{ bottom: `${(tick / max) * 100}%` }} data-v={num(tick)} />
          ))}
        </div>
        <div className="hq-chart__cols" style={{ "--n": daily.length }}>
          {daily.map((d) => (
            <div key={d.day} className="hq-chart__col" data-tip={`${dateLabel(d.day)} · ${num(d.visits)} visits · ${num(d.views)} views`}>
              {d.visits > 0 && <i style={{ height: `${(d.visits / max) * 100}%` }} />}
            </div>
          ))}
        </div>
        <div className="hq-chart__x" aria-hidden="true">
          {daily.map((d, i) => <span key={d.day}>{xLabels.has(i) ? dateLabel(d.day) : ""}</span>)}
        </div>
      </div>
      <details className="hq-table">
        <summary>Show as table</summary>
        <table>
          <thead>
            <tr><th scope="col">Day</th><th scope="col">Visits</th><th scope="col">Page views</th></tr>
          </thead>
          <tbody>
            {[...daily].reverse().map((d) => (
              <tr key={d.day}><td>{dateLabel(d.day)}</td><td>{num(d.visits)}</td><td>{num(d.views)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
};

const Sessions = ({ sessions }) => {
  if (sessions.length === 0) return <p className="hq-empty">No visits recorded yet.</p>;
  return (
    <ul className="hq-sessions">
      {sessions.map((s) => (
        <li key={s.sid}>
          <div className="hq-sessions__meta">
            <time>{timeLabel(s.t)}</time>
            <span>{flag(s.country)} {countryName(s.country)}</span>
            <span>{s.ref === "direct" ? "Direct" : s.ref}{s.src ? ` · ?ref=${s.src}` : ""}</span>
            <span>{s.device}</span>
            <span className={`hq-badge ${s.returning === "1" ? "is-back" : ""}`}>{s.returning === "1" ? "Returning" : "New"}</span>
          </div>
          <ol className="hq-journey">
            {s.steps.filter((step) => step.e !== "visit").map((step, i) => {
              const { text, tone } = stepLabel(step);
              return <li key={i} className={`hq-step hq-step--${tone}`}>{text}</li>;
            })}
            {s.steps.length <= 1 && <li className="hq-step">Bounced from the hero</li>}
          </ol>
        </li>
      ))}
    </ul>
  );
};

// ---------- page ----------

export default async function HQ({ searchParams }) {
  if (!(await isOwner())) notFound();

  const { d } = await searchParams;
  const range = RANGES.includes(Number(d)) ? Number(d) : 30;

  let report = null;
  let error = null;
  try {
    report = await loadReport(range);
  } catch (err) {
    error = err.message;
  }

  const step = (id) => report?.funnel.find((s) => s.id === id)?.anyOrder ?? 0;

  return (
    <div className="hq">
      <header className="wrap hq-top">
        <div>
          <span className="eyebrow"><i /><b>HQ</b> Private · only you can see this</span>
          <h1>Visitor analytics</h1>
          <p className="hq-top__sub">Last {range} days · times in Da Nang (ICT) · your own visits aren&apos;t counted</p>
        </div>
        <div className="hq-top__actions">
          <nav className="hq-range" aria-label="Date range">
            {RANGES.map((r) => (
              <a key={r} href={`/hq?d=${r}`} className={r === range ? "is-active" : ""} aria-current={r === range ? "page" : undefined}>
                {r}d
              </a>
            ))}
          </nav>
          <ThemeToggle />
          <a className="btn btn--ghost btn--sm" href="/">Site</a>
          <SignOut />
        </div>
      </header>

      <div className="wrap hq-body">
        {storeKind !== "redis" && (
          <p className="hq-notice">
            {storeKind === "file"
              ? "Dev mode: events are saved to .analytics.json in the project folder."
              : "No database connected, so visits are only kept in memory and vanish on redeploy. Connect Upstash Redis (see README)."}
          </p>
        )}
        {error && <p className="hq-notice hq-notice--error">Couldn&apos;t load analytics: {error}</p>}

        {report && (
          <>
            <section className="hq-kpis" aria-label="Summary">
              <div className="hq-kpi hq-kpi--hero">
                <span>Visits</span>
                <b>{num(report.visits)}</b>
                <small>{num(report.views)} page views</small>
              </div>
              <div className="hq-kpi">
                <span>Saw the Work section</span>
                <b>{pct(step("work"), report.visits)}</b>
                <small>{num(step("work"))} visits</small>
              </div>
              <div className="hq-kpi">
                <span>Opened a project</span>
                <b>{pct(step("project"), report.visits)}</b>
                <small>{num(step("project"))} visits</small>
              </div>
              <div className="hq-kpi">
                <span>Reached out</span>
                <b>{pct(step("reach"), report.visits)}</b>
                <small>{num(step("reach"))} visits · message, email, CV, LinkedIn or phone</small>
              </div>
            </section>

            <Card title="Funnel" sub="Each step only counts visits that also did every step above it.">
              <Funnel steps={report.funnel} />
            </Card>

            <Card title="Visits per day" sub="Hover a day for its numbers.">
              <DailyChart daily={report.daily} />
            </Card>

            <div className="hq-grid">
              <Card title="Where they came from" sub="Referring site, or Direct">
                <Ranked rows={report.sources} label={(name) => (name === "direct" ? "Direct / unknown" : name)} />
              </Card>
              <Card title="Your tagged links" sub="Visits from links with ?ref=… or ?utm_source=…">
                <Ranked rows={report.campaigns} empty="None yet. Share links like yoursite.com/?ref=cv to see them here." />
              </Card>
              <Card title="Projects opened" sub="Once per visit">
                <Ranked rows={report.projects} />
              </Card>
              <Card title="Actions" sub="Clicks that count, once per visit">
                <Ranked rows={report.actions} label={(name) => ACTION_LABELS[name] ?? name} />
              </Card>
              <Card title="Sections reached" sub="Scrolled to the middle of the screen">
                <Ranked rows={report.sections} label={(name) => name[0].toUpperCase() + name.slice(1)} />
              </Card>
              <Card title="Countries">
                <Ranked rows={report.countries} label={(code) => `${flag(code)} ${countryName(code)}`} />
              </Card>
              <Card title="Devices" sub="By screen width">
                <Ranked rows={report.devices} label={(name) => name[0].toUpperCase() + name.slice(1)} />
              </Card>
              <Card title="New vs returning">
                <Ranked rows={report.returning} label={(name) => (name === "new" ? "First visit" : "Been here before")} />
              </Card>
            </div>

            <Card title="Recent visits" sub="The last 30 sessions and what each one did" className="hq-card--wide">
              <Sessions sessions={report.sessions} />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
