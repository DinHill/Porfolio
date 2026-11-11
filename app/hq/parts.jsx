// Small building blocks shared by the dashboard pages
import { storeKind } from "@/lib/analytics/store";

export const Card = ({ title, sub, action, children, className = "" }) => (
  <section className={`hq-card ${className}`}>
    <header className="hq-card__head">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

export const StoreNotice = () =>
  storeKind === "redis" ? null : (
    <p className="hq-notice">
      {storeKind === "file"
        ? "Dev mode: events are saved to .analytics.json in the project folder."
        : "No database connected, so visits are only kept in memory and vanish on redeploy. Connect Upstash Redis (see README)."}
    </p>
  );
