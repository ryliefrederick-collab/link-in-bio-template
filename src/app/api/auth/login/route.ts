import { NextRequest, NextResponse } from "next/server";
import { getAuthState, signToken, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const { isSetup, passwordHash, sessionSecret } = await getAuthState();

  if (!isSetup || !passwordHash || !sessionSecret) {
    return NextResponse.json(
      { error: "Not configured", needsSetup: true },
      { status: 409 }
    );
  }

  const ok = await verifyPassword(password, passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signToken("authenticated", sessionSecret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
