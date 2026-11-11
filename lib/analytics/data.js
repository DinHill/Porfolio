// Turns tracker events into Redis counters, and counters back into the dashboard report.
//
// Keys (one set per day, kept ~13 months):
//   a:<day>:pv           page views
//   a:<day>:f:<step>     set of session ids that reached a funnel step
//   a:<day>:<dim>        hash of counts: ref, src, country, device, ret, sec, proj, act
//   a:s:<sid>            session details (30 days)    a:j:<sid>  session journey (30 days)
//   a:recent             newest session ids
import { projects } from "@/data/portfolio";
import { ACTIONS, CONTACT_ACTIONS, FUNNEL, SECTIONS } from "./shared";
import { run } from "./store";

export const TIME_ZONE = "Asia/Ho_Chi_Minh";
const DAY_TTL = 60 * 60 * 24 * 400;
const SESSION_TTL = 60 * 60 * 24 * 30;
const RECENT = 200;

const PROJECT_TITLES = new Set(projects.map((project) => project.title));

// Link-preview fetchers, crawlers and scripts — they rarely run JS, but some headless ones do
export const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http/i;

export const dayKey = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

const key = (day, name) => `a:${day}:${name}`;
const text = (value, max = 80) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : "";
const deviceFor = (width) => (width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop");

// Validates a raw event from the browser; returns null for anything unexpected
export function parseEvent(body) {
  if (!body || typeof body !== "object" || !/^[a-z0-9]{12,32}$/.test(body.sid ?? "")) return null;
  const base = { sid: body.sid, e: body.e };
  switch (body.e) {
    case "visit":
      return {
        ...base,
        first: body.first === true,
        returning: body.returning === true,
        ref: text(body.ref, 100).toLowerCase(),
        src: text(body.src, 40).toLowerCase(),
        device: deviceFor(Number(body.w) || 0),
      };
    case "section":
      return SECTIONS.includes(body.id) ? { ...base, id: body.id } : null;
    case "project":
      return PROJECT_TITLES.has(body.title) ? { ...base, title: body.title } : null;
    case "action":
      return ACTIONS.includes(body.type) ? { ...base, type: body.type } : null;
    default:
      return null;
  }
}

export async function recordEvent(event, { country = "" } = {}) {
  const day = dayKey();
  const { sid } = event;
  const commands = [];

  const expire = (k, ttl = DAY_TTL) => commands.push(["EXPIRE", k, ttl]);
  const step = (id) => {
    commands.push(["SADD", key(day, `f:${id}`), sid]);
    expire(key(day, `f:${id}`));
  };
  const count = (dim, field) => {
    commands.push(["HINCRBY", key(day, dim), field, 1]);
    expire(key(day, dim));
  };
  const journey = (label) => {
    const k = `a:j:${sid}`;
    commands.push(["RPUSH", k, JSON.stringify({ t: Date.now(), e: label })], ["LTRIM", k, -60, -1]);
    expire(k, SESSION_TTL);
  };

  switch (event.e) {
    case "visit": {
      commands.push(["INCR", key(day, "pv")]);
      expire(key(day, "pv"));
      step("visit");
      if (!event.first) break; // a reload: count the page view only
      const where = (country || "").toUpperCase().slice(0, 2) || "??";
      count("ref", event.ref || "direct");
      if (event.src) count("src", event.src);
      count("country", where);
      count("device", event.device);
      count("ret", event.returning ? "returning" : "new");
      commands.push([
        "HSET", `a:s:${sid}`,
        "t", Date.now(), "ref", event.ref || "direct", "src", event.src, "country", where,
        "device", event.device, "returning", event.returning ? 1 : 0,
      ]);
      expire(`a:s:${sid}`, SESSION_TTL);
      commands.push(["LPUSH", "a:recent", sid], ["LTRIM", "a:recent", 0, RECENT - 1]);
      journey("visit");
      break;
    }
    case "section":
      if (event.id === "work" || event.id === "contact") step(event.id);
      count("sec", event.id);
      journey(`section:${event.id}`);
      break;
    case "project":
      step("project");
      count("proj", event.title);
      journey(`project:${event.title}`);
      break;
    case "action":
      if (CONTACT_ACTIONS.includes(event.type)) step("reach");
      count("act", event.type);
      journey(`action:${event.type}`);
      break;
  }

  await run(commands);
}

// ---------- Reading ----------

const DIMENSIONS = ["ref", "src", "country", "device", "ret", "sec", "proj", "act"];

const toObject = (flat) => {
  const obj = {};
  for (let i = 0; i < (flat?.length ?? 0); i += 2) obj[flat[i]] = Number(flat[i + 1]) || 0;
  return obj;
};
const ranked = (totals) =>
  Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

// Calendar days ending today (owner's time zone), oldest first
const lastDays = (n) =>
  Array.from({ length: n }, (_, i) => dayKey(new Date(Date.now() - (n - 1 - i) * 86400000)));

export async function loadReport(range) {
  const days = lastDays(range);
  const perDay = 1 + FUNNEL.length + DIMENSIONS.length;

  const commands = days.flatMap((day) => [
    ["GET", key(day, "pv")],
    ...FUNNEL.map((step) => ["SMEMBERS", key(day, `f:${step.id}`)]),
    ...DIMENSIONS.map((dim) => ["HGETALL", key(day, dim)]),
  ]);
  commands.push(["LRANGE", "a:recent", 0, 29]);
  const results = await run(commands);

  const reached = Object.fromEntries(FUNNEL.map((step) => [step.id, new Set()]));
  const totals = Object.fromEntries(DIMENSIONS.map((dim) => [dim, {}]));
  const daily = days.map((day, d) => {
    const row = results.slice(d * perDay, (d + 1) * perDay);
    FUNNEL.forEach((step, i) => row[1 + i]?.forEach((sid) => reached[step.id].add(sid)));
    DIMENSIONS.forEach((dim, i) => {
      for (const [name, value] of Object.entries(toObject(row[1 + FUNNEL.length + i]))) {
        totals[dim][name] = (totals[dim][name] ?? 0) + value;
      }
    });
    return { day, views: Number(row[0]) || 0, visits: row[1]?.length ?? 0 };
  });

  // Strict funnel over the whole range: each step keeps only sessions that hit every earlier step.
  // (Done over the range, not per day, so a visit that crosses midnight still counts.)
  let survivors = reached.visit;
  const funnel = FUNNEL.map((step, i) => {
    if (i > 0) survivors = new Set([...survivors].filter((sid) => reached[step.id].has(sid)));
    return { ...step, count: survivors.size, anyOrder: reached[step.id].size };
  });

  const recentIds = results.at(-1) ?? [];
  const sessionResults = await run(
    recentIds.flatMap((sid) => [["HGETALL", `a:s:${sid}`], ["LRANGE", `a:j:${sid}`, 0, -1]])
  );
  const sessions = recentIds
    .map((sid, i) => {
      const flat = sessionResults[i * 2] ?? [];
      const info = Object.fromEntries(Array.from({ length: flat.length / 2 }, (_, j) => [flat[j * 2], flat[j * 2 + 1]]));
      const steps = (sessionResults[i * 2 + 1] ?? []).map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      });
      return { sid, ...info, t: Number(info.t) || null, steps: steps.filter(Boolean) };
    })
    .filter((session) => session.t);

  return {
    range,
    daily,
    funnel,
    visits: reached.visit.size,
    views: daily.reduce((sum, day) => sum + day.views, 0),
    sources: ranked(totals.ref),
    campaigns: ranked(totals.src),
    countries: ranked(totals.country),
    devices: ranked(totals.device),
    returning: ranked(totals.ret),
    sections: SECTIONS.map((id) => ({ name: id, value: totals.sec[id] ?? 0 })),
    projects: ranked(totals.proj),
    actions: ranked(totals.act),
    sessions,
  };
}
