import { NextRequest } from "next/server";
import { db } from "@/db";
import { pageVisits } from "@/db/schema";
import { parseDeviceType, extractGeoFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const geo = extractGeoFromHeaders(headers);

    await db.insert(pageVisits).values({
      referrer: headers.get("referer") || null,
      userAgent: headers.get("user-agent") || null,
      deviceType: parseDeviceType(headers.get("user-agent")),
      country: geo.country,
      city: geo.city,
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
