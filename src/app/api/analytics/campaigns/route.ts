import { NextRequest, NextResponse } from "next/server";
import { getCampaignPerformance } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const period = new URL(request.url).searchParams.get("period") || "30d";
  const data = await getCampaignPerformance(period);
  return NextResponse.json(data);
}
