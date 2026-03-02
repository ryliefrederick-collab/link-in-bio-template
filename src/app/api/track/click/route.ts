import { NextRequest } from "next/server";
import { db } from "@/db";
import { linkClicks } from "@/db/schema";
import { parseDeviceType, extractGeoFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, campaignTag } = body;

    if (!linkId) {
      return new Response(null, { status: 400 });
    }

    const headers = request.headers;
    const geo = extractGeoFromHeaders(headers);

    await db.insert(linkClicks).values({
      linkId,
      referrer: headers.get("referer") || null,
      userAgent: headers.get("user-agent") || null,
      deviceType: parseDeviceType(headers.get("user-agent")),
      country: geo.country,
      city: geo.city,
      campaignTag: campaignTag || null,
    });

    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
