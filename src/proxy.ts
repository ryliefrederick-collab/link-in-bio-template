import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthState, verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { isSetup, sessionSecret } = await getAuthState();

  if (!isSetup || !sessionSecret) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not configured" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  const cookie = request.cookies.get("auth-session");
  const isValid = cookie ? await verifyToken(cookie.value, sessionSecret) : false;

  if (!isValid) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/links/:path*",
    "/api/settings",
    "/api/analytics/:path*",
    "/api/earnings/:path*",
  ],
};
