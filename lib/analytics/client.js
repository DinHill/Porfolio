// Browser side of the private analytics. No cookies and no personal data: a random id per browser tab
// session (sessionStorage) plus a "has visited before" flag (localStorage). Visitors who send
// Global Privacy Control or Do Not Track, or who opt out on /privacy, are not tracked at all.
import { SECTIONS } from "./shared";

const ENDPOINT = "/api/t";
const SID_KEY = "hq_sid";
const SENT_KEY = "hq_sent";
const SEEN_KEY = "hq_seen";

const storage = (name) => {
  try {
    return window[name];
  } catch {
    return null;
  }
};

// The visitor's own "don't count my visits" choice from the privacy page (app/privacy)
const OPT_OUT_KEY = "hq_optout";

export const browserOptedOut = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
export const userOptedOut = () => storage("localStorage")?.getItem(OPT_OUT_KEY) === "1";
export const setUserOptOut = (off) => {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, "1");
    else localStorage.removeItem(OPT_OUT_KEY);
    return true;
  } catch {
    return false;
  }
};

const optedOut = () => browserOptedOut() || userOptedOut();

const newId = () =>
  (crypto.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`)
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);

let sid = null;
const session = () => {
  if (sid) return { sid, isNew: false };
  const ss = storage("sessionStorage");
  sid = ss?.getItem(SID_KEY);
  if (sid) return { sid, isNew: false };
  sid = newId();
  ss?.setItem(SID_KEY, sid);
  return { sid, isNew: true };
};

// True the first time a key is seen this session, so each section/project/action counts once
const firstTime = (key) => {
  const ss = storage("sessionStorage");
  try {
    const sent = JSON.parse(ss?.getItem(SENT_KEY) ?? "[]");
    if (sent.includes(key)) return false;
    ss?.setItem(SENT_KEY, JSON.stringify([...sent, key]));
  } catch {
    // Storage blocked: just send it
  }
  return true;
};

const send = (event) => {
  const body = JSON.stringify({ sid: session().sid, ...event });
  const blob = new Blob([body], { type: "text/plain" });
  if (!navigator.sendBeacon?.(ENDPOINT, blob)) {
    fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
  }
};

const track = (event, dedupeKey) => {
  if (typeof window === "undefined" || optedOut()) return;
  if (dedupeKey && !firstTime(dedupeKey)) return;
  send(event);
};

export const trackProject = (title) => track({ e: "project", title }, `p:${title}`);
export const trackAction = (type) => track({ e: "action", type }, `a:${type}`);

// What a click on a link or button means, if anything. data-track="..." wins over guessing from the href.
const actionFor = (el) => {
  if (el.dataset.track) return el.dataset.track;
  const href = el.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/\.pdf($|\?)/i.test(href)) return "cv";
  if (/linkedin\.com/i.test(href)) return "linkedin";
  if (/github\.com/i.test(href)) return "github";
  if (/roblox\.com\/games/i.test(href)) return "play";
  if (/youtube\.com|youtu\.be/i.test(href)) return "video";
  return null;
};

const referrerHost = () => {
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host === location.hostname.replace(/^www\./, "") ? "" : host;
  } catch {
    return "";
  }
};

// Starts tracking the page; returns a cleanup function
export function startTracking() {
  if (optedOut()) return () => {};

  const { isNew } = session();
  const local = storage("localStorage");
  const returning = Boolean(local?.getItem(SEEN_KEY));
  try {
    local?.setItem(SEEN_KEY, "1");
  } catch {}

  // ?ref=cv or ?utm_source=linkedin on links you share tells you which one people came from
  const params = new URLSearchParams(location.search);
  track({
    e: "visit",
    first: isNew,
    returning,
    ref: referrerHost(),
    src: params.get("utm_source") ?? params.get("ref") ?? "",
    w: window.innerWidth,
    touch: navigator.maxTouchPoints || 0,
  });

  // A section counts as seen once it crosses the middle of the screen (works for sections of any height)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        track({ e: "section", id: entry.target.id }, `s:${entry.target.id}`);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const onClick = (e) => {
    const el = e.target.closest?.("a, button, [data-track]");
    const type = el && actionFor(el);
    if (type) trackAction(type);
  };
  document.addEventListener("click", onClick, { capture: true });

  return () => {
    observer.disconnect();
    document.removeEventListener("click", onClick, { capture: true });
  };
}
