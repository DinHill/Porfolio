// Collects tracker events (lib/analytics/client.js). Always answers 204 so it gives nothing away.
import { isOwnerToken, OWNER_COOKIE } from "@/lib/analytics/auth";
import { BOT_PATTERN, parseEvent, recordEvent } from "@/lib/analytics/data";

const done = () => new Response(null, { status: 204 });

export async function POST(request) {
  try {
    // Your own visits (signed in to the dashboard) are never counted
    if (isOwnerToken(request.cookies.get(OWNER_COOKIE)?.value)) return done();

    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT_PATTERN.test(ua)) return done();

    // Only accept events posted from this site
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) return done();

    const body = await request.text();
    if (body.length > 2000) return done();
    const event = parseEvent(JSON.parse(body));
    if (!event) return done();

    const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? "";
    await recordEvent(event, { country });
  } catch (error) {
    console.error("[analytics] event not recorded:", error.message);
  }
  return done();
}
