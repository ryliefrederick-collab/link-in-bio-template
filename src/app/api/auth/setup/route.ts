import { NextRequest, NextResponse } from "next/server";
import { completeSetup, signToken, getAuthState } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const state = await getAuthState();
  if (state.isSetup) {
    return NextResponse.json(
      { error: "Already configured. Use login instead." },
      { status: 409 }
    );
  }

  const secret = await completeSetup(password);
  const token = await signToken("authenticated", secret);

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
