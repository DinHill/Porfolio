// Owner sign-in for the hidden dashboard.
//   GET    204 if you're signed in, otherwise 404
//   POST   { passphrase } -> sets the owner cookie
//   DELETE signs out
import { NextResponse } from "next/server";
import { checkPassword, hashIp, isOwnerToken, loginEnabled, OWNER_COOKIE, ownerCookieOptions, ownerToken } from "@/lib/analytics/auth";
import { run } from "@/lib/analytics/store";

const MAX_TRIES = 8; // per IP per 15 minutes
const status = (code) => new NextResponse(null, { status: code });

export async function GET(request) {
  return status(isOwnerToken(request.cookies.get(OWNER_COOKIE)?.value) ? 204 : 404);
}

export async function POST(request) {
  if (!loginEnabled()) return status(404);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const limitKey = `a:login:${hashIp(ip)}`;
  try {
    const [tries] = await run([["INCR", limitKey], ["EXPIRE", limitKey, 15 * 60]]);
    if (tries > MAX_TRIES) return status(429);
  } catch {
    // Store down: still allow the attempt rather than locking you out
  }

  let passphrase = "";
  try {
    passphrase = (await request.json())?.passphrase;
  } catch {
    return status(400);
  }

  if (!checkPassword(passphrase)) {
    await new Promise((resolve) => setTimeout(resolve, 600)); // slows down guessing
    return status(401);
  }

  await run([["DEL", limitKey]]).catch(() => {});
  const res = status(204);
  res.cookies.set(OWNER_COOKIE, ownerToken(), ownerCookieOptions);
  return res;
}

export async function DELETE() {
  const res = status(204);
  res.cookies.set(OWNER_COOKIE, "", { ...ownerCookieOptions, maxAge: 0 });
  return res;
}
