// Formatting shared by the dashboard pages
import { TIME_ZONE } from "@/lib/analytics/data";

export const num = (n) => n.toLocaleString("en-US");
export const pct = (part, whole) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–");
export const capital = (text) => (text ? text[0].toUpperCase() + text.slice(1) : "");

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
export const flag = (code) =>
  /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐";
export const countryName = (code) => {
  if (!/^[A-Z]{2}$/.test(code)) return "Unknown";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};

export const dateLabel = (day) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
export const timeLabel = (ms) =>
  new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });

// 0 → "–", 42s → "42s", 200s → "3m 20s", 2h+ → "2h 5m"
export const duration = (ms) => {
  const s = Math.round(ms / 1000);
  if (s < 1) return "–";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};
