import { NextRequest, NextResponse } from "next/server";
import { getClicksByDay } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";
  const linkId = searchParams.get("linkId");

  const data = await getClicksByDay(period, linkId ? Number(linkId) : undefined);

  return NextResponse.json(data);
}
