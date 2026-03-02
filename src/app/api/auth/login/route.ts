import { NextRequest, NextResponse } from "next/server";

async function signToken(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${payload}.${hex}`;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  const token = await signToken("authenticated", secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
