// Every visitor in the chosen range as a table, 50 per page. Owner only, like /hq.
import { notFound } from "next/navigation";
import { isOwner } from "@/lib/analytics/auth";
import { loadVisitors, VISITOR_FILTERS } from "@/lib/analytics/data";
import { num } from "../format";
import HqHeader, { rangeFrom } from "../HqHeader";
import { Card, StoreNotice } from "../parts";
import VisitorTable from "../VisitorTable";
import "../hq.css";

const PER_PAGE = 50;

const FILTER_LABELS = {
  all: "Everyone",
  project: "Opened a project",
  reach: "Reached out",
};

export async function generateMetadata() {
  if (!(await isOwner())) return {};
  return { title: "HQ · Visitors", robots: { index: false, follow: false } };
}

export default async function Visitors({ searchParams }) {
  if (!(await isOwner())) notFound();

  const params = await searchParams;
  const range = rangeFrom(params.d);
  const only = VISITOR_FILTERS.includes(params.only) ? params.only : "all";
  const href = ({ d = range, f = only, p = 1 } = {}) => {
    const query = new URLSearchParams({ d: String(d) });
    if (f !== "all") query.set("only", f);
    if (p > 1) query.set("p", String(p));
    return `/hq/visitors?${query}`;
  };

  let result = null;
  let error = null;
  try {
    result = await loadVisitors({ range, only, perPage: PER_PAGE, page: Number.parseInt(params.p, 10) || 1 });
  } catch (err) {
    error = err.message;
  }

  const first = result ? (result.page - 1) * PER_PAGE + 1 : 0;
  const last = result ? first + result.visitors.length - 1 : 0;

  return (
    <div className="hq">
      <HqHeader
        title="Visitors"
        sub={`Every visit in the last ${range} days, newest first · times in Da Nang (ICT)`}
        current="/hq/visitors"
        range={range}
        hrefFor={(d) => href({ d })}
      />

      <div className="wrap hq-body">
        <StoreNotice />
        {error && <p className="hq-notice hq-notice--error">Couldn&apos;t load visitors: {error}</p>}

        {result && (
          <Card
            title={`${num(result.total)} ${result.total === 1 ? "visitor" : "visitors"}`}
            sub={result.total > 0 ? `Showing ${num(first)}–${num(last)}` : undefined}
            action={
              <nav className="hq-range" aria-label="Filter visitors">
                {VISITOR_FILTERS.map((f) => (
                  <a key={f} href={href({ f })} className={f === only ? "is-active" : ""} aria-current={f === only ? "true" : undefined}>
                    {FILTER_LABELS[f]}
                  </a>
                ))}
              </nav>
            }
          >
            <VisitorTable
              visitors={result.visitors}
              empty={only === "all" ? "No visits recorded in this range yet." : "Nobody in this range matches that filter yet."}
            />

            {result.pages > 1 && (
              <nav className="hq-pager" aria-label="Pages">
                {result.page > 1 ? <a className="btn btn--ghost btn--sm" href={href({ p: result.page - 1 })}>← Newer</a> : <span />}
                <span>Page {result.page} of {result.pages}</span>
                {result.page < result.pages ? <a className="btn btn--ghost btn--sm" href={href({ p: result.page + 1 })}>Older →</a> : <span />}
              </nav>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
