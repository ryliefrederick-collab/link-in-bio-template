import { NextResponse } from "next/server";
import { getAuthState } from "@/lib/auth";

export async function GET() {
  const { isSetup } = await getAuthState();
  return NextResponse.json({ isSetup });
}
