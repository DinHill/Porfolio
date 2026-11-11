// Turns tracker events into Redis counters, and counters back into the dashboard report.
//
// Keys (one set per day, kept ~13 months):
//   a:<day>:pv           page views
//   a:<day>:f:<step>     set of session ids that reached a funnel step
//   a:<day>:<dim>        hash of counts: ref, src, country, device, ret, sec, proj, act
//   a:<day>:sids         list of that day's visitors (session ids, newest first)
//   a:s:<sid>            visitor details              a:j:<sid>  what they did, in order
import { projects } from "@/data/portfolio";
import { ACTIONS, CONTACT_ACTIONS, FUNNEL, SECTIONS } from "./shared";
import { run } from "./store";

export const TIME_ZONE = "Asia/Ho_Chi_Minh";
const DAY_TTL = 60 * 60 * 24 * 400;
const SESSION_TTL = DAY_TTL;

const PROJECT_TITLES = new Set(projects.map((project) => project.title));

// Link-preview fetchers, crawlers and scripts — they rarely run JS, but some headless ones do
export const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http/i;

export const dayKey = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

const key = (day, name) => `a:${day}:${name}`;
const text = (value, max = 80) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : "";
// Device type from the user agent; window width is only a last resort, because a laptop browser
// that isn't maximised (or runs at 125-150% display scaling) is easily under 1024px wide.
// iPads ask for the desktop site and claim to be a Mac, so a touch screen gives them away.
const isIpad = (ua, touch) => /ipad/i.test(ua) || (/macintosh/i.test(ua) && touch > 1);
const deviceFor = (ua, width, touch) => {
  if (isIpad(ua, touch) || /tablet|kindle|silk|playbook/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "tablet";
  if (/mobi|iphone|ipod|windows phone/i.test(ua)) return "mobile";
  if (/windows|macintosh|cros|x11|linux/i.test(ua)) return "desktop";
  return width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
};

// Browser and OS from the user agent. In-app browsers first: "LinkedIn app" says more than "Safari".
const BROWSERS = [
  [/linkedinapp/i, "LinkedIn app"],
  [/fban|fbav|fb_iab/i, "Facebook app"],
  [/instagram/i, "Instagram app"],
  [/zalo/i, "Zalo app"],
  [/edg(a|ios)?\//i, "Edge"],
  [/opr\/|opera/i, "Opera"],
  [/samsungbrowser/i, "Samsung Internet"],
  [/coc_coc|coccoc/i, "Cốc Cốc"],
  [/firefox|fxios/i, "Firefox"],
  [/chrome|crios/i, "Chrome"],
  [/safari/i, "Safari"],
];
const SYSTEMS = [
  [/iphone|ipod/i, "iPhone"],
  [/ipad/i, "iPad"],
  [/android/i, "Android"],
  [/windows/i, "Windows"],
  [/cros/i, "ChromeOS"],
  [/mac os x|macintosh/i, "Mac"],
  [/linux/i, "Linux"],
];
const pick = (list, ua) => list.find(([pattern]) => pattern.test(ua))?.[1] ?? "Other";

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
        w: Math.round(Number(body.w)) || 0,
        touch: Math.round(Number(body.touch)) || 0,
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

export async function recordEvent(event, { country = "", city = "", ua = "" } = {}) {
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
      const device = deviceFor(ua, event.w, event.touch);
      count("ref", event.ref || "direct");
      if (event.src) count("src", event.src);
      count("country", where);
      count("device", device);
      count("ret", event.returning ? "returning" : "new");
      commands.push([
        "HSET", `a:s:${sid}`,
        "t", Date.now(), "ref", event.ref || "direct", "src", event.src, "country", where, "city", text(city, 60),
        "device", device, "browser", pick(BROWSERS, ua), "os", isIpad(ua, event.touch) ? "iPad" : pick(SYSTEMS, ua),
        "returning", event.returning ? 1 : 0,
      ]);
      expire(`a:s:${sid}`, SESSION_TTL);
      commands.push(["LPUSH", key(day, "sids"), sid]);
      expire(key(day, "sids"));
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
  };
}

// ---------- Visitor list ----------

const parseStep = (item) => {
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

// Details and what each visitor did, for a page of session ids
async function loadSessions(ids) {
  const results = await run(ids.flatMap((sid) => [["HGETALL", `a:s:${sid}`], ["LRANGE", `a:j:${sid}`, 0, -1]]));
  return ids
    .map((sid, i) => {
      const flat = results[i * 2] ?? [];
      const info = {};
      for (let j = 0; j < flat.length; j += 2) info[flat[j]] = flat[j + 1];
      const steps = (results[i * 2 + 1] ?? []).map(parseStep).filter(Boolean);
      const of = (kind) =>
        steps.filter((step) => step.e.startsWith(`${kind}:`)).map((step) => step.e.slice(kind.length + 1));
      const t = Number(info.t) || null;
      const last = steps.at(-1)?.t ?? t;
      return {
        sid,
        t,
        ref: info.ref || "direct",
        src: info.src || "",
        country: info.country || "??",
        city: info.city || "",
        device: info.device || "",
        browser: info.browser || "",
        os: info.os || "",
        returning: info.returning === "1",
        sections: of("section"),
        projects: of("project"),
        actions: of("action"),
        activeMs: t && last ? Math.max(0, last - t) : 0,
      };
    })
    .filter((visitor) => visitor.t);
}

export const VISITOR_FILTERS = ["all", "project", "reach"];

// Every visitor in the range, newest first, one page at a time.
// only = "project" | "reach" keeps visitors who opened a project / reached out.
export async function loadVisitors({ range, page = 1, perPage = 50, only = "all" }) {
  const days = lastDays(range).reverse();
  const step = only === "project" || only === "reach" ? only : null;
  const results = await run([
    ...days.map((day) => ["LRANGE", key(day, "sids"), 0, -1]),
    ...(step ? days.map((day) => ["SMEMBERS", key(day, `f:${step}`)]) : []),
  ]);

  let ids = [...new Set(results.slice(0, days.length).flatMap((list) => list ?? []))];
  if (step) {
    const keep = new Set(results.slice(days.length).flatMap((members) => members ?? []));
    ids = ids.filter((sid) => keep.has(sid));
  }

  const pages = Math.max(1, Math.ceil(ids.length / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const visitors = await loadSessions(ids.slice((current - 1) * perPage, current * perPage));
  return { total: ids.length, page: current, pages, perPage, visitors };
}
