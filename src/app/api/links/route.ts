import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { generateCampaignTag } from "@/lib/utils";
import type { Link } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Link["category"] | null;

  const result = category
    ? await db.query.links.findMany({
        where: eq(links.category, category),
        orderBy: [asc(links.sortOrder)],
      })
    : await db.query.links.findMany({
        orderBy: [asc(links.sortOrder)],
      });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, category, socialPlatform, scheduledStart, autoHideDays, emoji } = body;

    if (!title || !url || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      return NextResponse.json(
        { error: "URL must start with http:// or https://" },
        { status: 400 },
      );
    }

    // Get max sort order for this category
    const existing = await db.query.links.findMany({
      where: eq(links.category, category as Link["category"]),
      orderBy: [asc(links.sortOrder)],
    });
    const maxSort = existing.length > 0
      ? Math.max(...existing.map((l) => l.sortOrder))
      : -1;

    const campaignTag = category === "campaign" ? generateCampaignTag(title) : null;

    const [result] = await db
      .insert(links)
      .values({
        title,
        url,
        category,
        sortOrder: maxSort + 1,
        isVisible: true,
        socialPlatform: socialPlatform || null,
        scheduledStart: scheduledStart || null,
        autoHideDays: autoHideDays || null,
        emoji: emoji || null,
        campaignTag,
      })
      .returning();

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
