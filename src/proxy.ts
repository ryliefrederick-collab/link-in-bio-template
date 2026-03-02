import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  const expectedHex = Array.from(new Uint8Array(expected))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signature === expectedHex;
}

export async function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.error("SESSION_SECRET is not set");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookie = request.cookies.get("auth-session");
  const isValid = cookie ? await verifyToken(cookie.value, secret) : false;

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
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
