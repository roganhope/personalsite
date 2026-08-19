import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/admin-session";

// Defense-in-depth only: /secret/admin gates itself and every server action
// re-checks auth, since action POSTs don't reliably pass through here.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/secret/admin") {
    return NextResponse.next();
  }

  if (!verifySessionValue(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/secret/admin", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/secret/:path*"] };
