// Shared top bar for the dashboard pages: title, page switcher, date range, theme, sign out
import ThemeToggle from "@/components/ThemeToggle";
import SignOut from "./SignOut";

export const RANGES = [7, 30, 90];
export const rangeFrom = (d) => (RANGES.includes(Number(d)) ? Number(d) : 30);

const PAGES = [
  { href: "/hq", label: "Overview" },
  { href: "/hq/visitors", label: "Visitors" },
];

export default function HqHeader({ title, sub, current, range, hrefFor }) {
  return (
    <header className="wrap hq-top">
      <div>
        <span className="eyebrow"><i /><b>HQ</b> Private · only you can see this</span>
        <h1>{title}</h1>
        <p className="hq-top__sub">{sub}</p>
      </div>
      <div className="hq-top__actions">
        <nav className="hq-range" aria-label="Dashboard pages">
          {PAGES.map((page) => (
            <a
              key={page.href}
              href={`${page.href}?d=${range}`}
              className={page.href === current ? "is-active" : ""}
              aria-current={page.href === current ? "page" : undefined}
            >
              {page.label}
            </a>
          ))}
        </nav>
        <nav className="hq-range" aria-label="Date range">
          {RANGES.map((r) => (
            <a key={r} href={hrefFor(r)} className={r === range ? "is-active" : ""} aria-current={r === range ? "true" : undefined}>
              {r}d
            </a>
          ))}
        </nav>
        <ThemeToggle />
        <a className="btn btn--ghost btn--sm" href="/">Site</a>
        <SignOut />
      </div>
    </header>
  );
}
