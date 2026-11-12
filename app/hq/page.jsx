// Private visitor analytics. Anyone without the owner cookie gets the site's normal 404,
// so the page looks like it doesn't exist. The way in is in components/SecretDoor.jsx.
import { notFound } from "next/navigation";
import { isOwner } from "@/lib/analytics/auth";
import { loadReport, loadVisitors } from "@/lib/analytics/data";
import { ACTION_LABELS } from "@/lib/analytics/shared";
import { capital, countryName, dateLabel, flag, num, pct } from "./format";
import HqHeader, { rangeFrom } from "./HqHeader";
import { Card, StoreNotice } from "./parts";
import VisitorTable from "./VisitorTable";
import { PxIcon } from "@/components/Pixel";
import "./hq.css";

// Nothing in the metadata either, unless it's you
export async function generateMetadata() {
  if (!(await isOwner())) return {};
  return { title: "HQ · Visitor analytics", robots: { index: false, follow: false } };
}

// A clean tick step (1, 2, 5 × 10ⁿ) so the axis reads 0 / step / 2·step
const niceStep = (max) => {
  const raw = Math.max(1, max / 2);
  const pow = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw);
};

// ---------- pieces ----------

// Ranked list with a rank badge and a segmented share bar per row; long tails fold into "Other"
const Ranked = ({ rows, label = (name) => name, empty = "Nothing yet.", limit = 8 }) => {
  if (rows.length === 0 || rows.every((row) => row.value === 0)) return <p className="hq-empty">{empty}</p>;
  const shown = rows.slice(0, limit);
  const rest = rows.slice(limit).reduce((sum, row) => sum + row.value, 0);
  if (rest > 0) shown.push({ name: "__other", value: rest });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(...shown.map((row) => row.value));
  return (
    <ul className="hq-rank">
      {shown.map((row, i) => (
        <li key={row.name}>
          <span className="hq-rank__name">
            <b className="hq-rank__pos" aria-hidden="true">{row.name === "__other" ? "…" : i + 1}</b>
            <span>{row.name === "__other" ? "Other" : label(row.name)}</span>
          </span>
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

// ---------- page ----------

export default async function HQ({ searchParams }) {
  if (!(await isOwner())) notFound();

  const range = rangeFrom((await searchParams).d);

  let report = null;
  let latest = null;
  let error = null;
  try {
    [report, latest] = await Promise.all([loadReport(range), loadVisitors({ range, perPage: 10 })]);
  } catch (err) {
    error = err.message;
  }

  const step = (id) => report?.funnel.find((s) => s.id === id)?.anyOrder ?? 0;

  // Percentage tiles: share of visits that did the step, with an XP-style meter
  const tiles = [
    { id: "work", label: "Saw the Work section", icon: "star" },
    { id: "project", label: "Opened a project", icon: "play" },
    { id: "reach", label: "Reached out", icon: "mail", note: "message, email, CV, LinkedIn or phone" },
  ];

  return (
    <div className="hq">
      <HqHeader
        title="Visitor analytics"
        sub={`Last ${range} days · times in Da Nang (ICT) · your own visits aren't counted`}
        current="/hq"
        range={range}
        hrefFor={(r) => `/hq?d=${r}`}
      />

      <div className="wrap hq-body">
        <StoreNotice />
        {error && <p className="hq-notice hq-notice--error">Couldn&apos;t load analytics: {error}</p>}

        {report && (
          <>
            <section className="hq-kpis" aria-label="Summary">
              <div className="hq-kpi hq-kpi--hero">
                <span><PxIcon name="gamepad" /> Visits</span>
                <b>{num(report.visits)}</b>
                <small>{num(report.views)} page views</small>
              </div>
              {tiles.map((tile) => (
                <div className="hq-kpi" key={tile.id}>
                  <span><PxIcon name={tile.icon} /> {tile.label}</span>
                  <b>{pct(step(tile.id), report.visits)}</b>
                  <span className="hq-kpi__meter" aria-hidden="true">
                    <i style={{ "--p": report.visits ? step(tile.id) / report.visits : 0 }} />
                  </span>
                  <small>{num(step(tile.id))} visits{tile.note ? ` · ${tile.note}` : ""}</small>
                </div>
              ))}
            </section>

            <Card
              title="Latest visitors"
              sub={`The newest ${Math.min(10, latest.total)} of ${num(latest.total)} in the last ${range} days`}
              action={
                latest.total > 0 && (
                  <a className="btn btn--ghost btn--sm" href={`/hq/visitors?d=${range}`}>See all visitors <PxIcon name="arrowRight" /></a>
                )
              }
            >
              <VisitorTable visitors={latest.visitors} />
            </Card>

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
                <Ranked rows={report.sections} label={capital} />
              </Card>
              <Card title="Countries" sub="Estimated from the network, so cities can be off (see the Visitors page)">
                <Ranked rows={report.countries} label={(code) => `${flag(code)} ${countryName(code)}`} />
              </Card>
              <Card title="Devices" sub="From the browser's own device info">
                <Ranked rows={report.devices} label={capital} />
              </Card>
              <Card title="New vs returning">
                <Ranked rows={report.returning} label={(name) => (name === "new" ? "First visit" : "Been here before")} />
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
