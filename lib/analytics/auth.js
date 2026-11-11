// Owner-only access to the dashboard: a passphrase from the environment, exchanged for a signed, HttpOnly cookie.
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const OWNER_COOKIE = "hq_owner";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

const password = () => process.env.ANALYTICS_PASSWORD || "";

// Login stays off (and the dashboard 404s) until a passphrase of 12+ characters is configured
export const loginEnabled = () => password().length >= 12;

// Derived from the passphrase unless set, so changing the passphrase signs out every old cookie
const secret = () => process.env.ANALYTICS_SECRET || createHash("sha256").update(`hq:${password()}`).digest("hex");
const sign = (value) => createHmac("sha256", secret()).update(value).digest("hex");
const sha256 = (value) => createHash("sha256").update(value).digest();

const safeEqual = (a, b) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const checkPassword = (input) =>
  loginEnabled() && typeof input === "string" && timingSafeEqual(sha256(input), sha256(password()));

export const ownerToken = () => {
  const expires = Date.now() + MAX_AGE * 1000;
  return `${expires}.${sign(`owner.${expires}`)}`;
};

export const isOwnerToken = (token) => {
  if (!loginEnabled() || typeof token !== "string") return false;
  const [expires, mac] = token.split(".");
  if (!expires || !mac || Number(expires) < Date.now()) return false;
  return safeEqual(mac, sign(`owner.${expires}`));
};

export async function isOwner() {
  const jar = await cookies();
  return isOwnerToken(jar.get(OWNER_COOKIE)?.value);
}

export const ownerCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: MAX_AGE,
};

// Used only as a short-lived rate-limit key, so raw IPs are never stored
export const hashIp = (ip) => sign(`ip.${ip}`).slice(0, 16);
