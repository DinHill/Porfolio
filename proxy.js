// Hides the private dashboard: unless the request carries a valid owner cookie, /hq (and a GET of /api/hq)
// is served exactly like a URL that doesn't exist. Signing in (POST /api/hq) still goes through.
import { NextResponse } from "next/server";
import { isOwnerToken, OWNER_COOKIE } from "@/lib/analytics/auth";

export function proxy(request) {
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  if (isApi && request.method !== "GET") return NextResponse.next();
  if (isOwnerToken(request.cookies.get(OWNER_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/__missing", request.url));
}

export const config = {
  matcher: ["/hq", "/hq/:path*", "/api/hq"],
};
