// Tiny Redis-style store for the analytics.
// - Production: Upstash Redis over its REST API (free tier; also what Vercel's "Upstash for Redis" integration sets up).
// - Local dev without Redis: the same commands run against .analytics.json in the project root.
// - Production without Redis: in memory only (lost on restart) — the dashboard shows a warning.
import { promises as fs } from "fs";
import path from "path";

const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const storeKind = url && token ? "redis" : process.env.NODE_ENV === "production" ? "memory" : "file";

// Runs a batch of commands, e.g. [["INCR", "k"], ["SADD", "s", "x"]], and returns their results in order
export async function run(commands) {
  if (commands.length === 0) return [];
  if (storeKind === "redis") {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands.map((cmd) => cmd.map(String))),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis responded ${res.status}`);
    const results = await res.json();
    return results.map((r) => (r.error ? null : r.result));
  }
  const db = await loadLocal();
  const results = commands.map((cmd) => exec(db, cmd.map(String)));
  scheduleSave();
  return results;
}

// ---------- Local fallback: the handful of Redis commands the analytics uses ----------

const FILE = path.join(process.cwd(), ".analytics.json");
const g = globalThis;

async function loadLocal() {
  if (!g.__hqDb) {
    g.__hqDb = {};
    if (storeKind === "file") {
      try {
        g.__hqDb = JSON.parse(await fs.readFile(FILE, "utf8"));
      } catch {
        // No file yet
      }
    }
  }
  return g.__hqDb;
}

function scheduleSave() {
  if (storeKind !== "file" || g.__hqSaveTimer) return;
  g.__hqSaveTimer = setTimeout(() => {
    g.__hqSaveTimer = null;
    fs.writeFile(FILE, JSON.stringify(g.__hqDb)).catch(() => {});
  }, 400);
}

// Each key is { v: value, x: expiry in ms or null }
const live = (db, key) => {
  const entry = db[key];
  if (entry?.x && entry.x < Date.now()) {
    delete db[key];
    return undefined;
  }
  return entry;
};
const put = (db, key, v, prev) => {
  db[key] = { v, x: prev?.x ?? null };
};
const range = (list, start, stop) => {
  const n = list.length;
  const from = Math.max(0, start < 0 ? n + start : start);
  const to = stop < 0 ? n + stop : Math.min(stop, n - 1);
  return list.slice(from, to + 1);
};

function exec(db, [cmd, key, ...args]) {
  const entry = live(db, key);
  switch (cmd) {
    case "GET":
      return entry ? String(entry.v) : null;
    case "INCR": {
      const v = (Number(entry?.v) || 0) + 1;
      put(db, key, v, entry);
      return v;
    }
    case "HINCRBY": {
      const hash = entry?.v ?? {};
      hash[args[0]] = (Number(hash[args[0]]) || 0) + Number(args[1]);
      put(db, key, hash, entry);
      return hash[args[0]];
    }
    case "HSET": {
      const hash = entry?.v ?? {};
      for (let i = 0; i < args.length; i += 2) hash[args[i]] = args[i + 1];
      put(db, key, hash, entry);
      return args.length / 2;
    }
    case "HGETALL":
      return entry ? Object.entries(entry.v).flatMap(([f, v]) => [f, String(v)]) : [];
    case "SADD": {
      const set = entry?.v ?? [];
      const added = args.filter((m) => !set.includes(m));
      set.push(...added);
      put(db, key, set, entry);
      return added.length;
    }
    case "SMEMBERS":
      return entry ? [...entry.v] : [];
    case "LPUSH":
    case "RPUSH": {
      const list = entry?.v ?? [];
      for (const v of args) cmd === "LPUSH" ? list.unshift(v) : list.push(v);
      put(db, key, list, entry);
      return list.length;
    }
    case "LTRIM":
      if (entry) entry.v = range(entry.v, Number(args[0]), Number(args[1]));
      return "OK";
    case "LRANGE":
      return entry ? range(entry.v, Number(args[0]), Number(args[1])) : [];
    case "EXPIRE":
      if (!entry) return 0;
      entry.x = Date.now() + Number(args[0]) * 1000;
      return 1;
    case "DEL":
      return delete db[key] ? 1 : 0;
    default:
      throw new Error(`Local analytics store doesn't support ${cmd}`);
  }
}
