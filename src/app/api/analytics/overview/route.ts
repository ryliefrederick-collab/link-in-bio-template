import { NextRequest, NextResponse } from "next/server";
import { getOverviewStats, getDeviceBreakdown, getReferrerBreakdown } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const period = new URL(request.url).searchParams.get("period") || "30d";

  const [overview, devices, referrers] = await Promise.all([
    getOverviewStats(period),
    getDeviceBreakdown(period),
    getReferrerBreakdown(period),
  ]);

  return NextResponse.json({ ...overview, devices, referrers });
}
