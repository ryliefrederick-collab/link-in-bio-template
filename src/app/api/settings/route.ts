import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  let settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });

  if (!settings) {
    const [created] = await db.insert(siteSettings).values({ id: 1 }).returning();
    settings = created;
  }

  return NextResponse.json(settings);
}

const ALLOWED_SETTINGS_KEYS = [
  "profileName",
  "profileBio",
  "profileImageUrl",
  "colorPalette",
  "fontPairing",
  "buttonStyle",
  "themePreset",
] as const;

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const update: Record<string, unknown> = {};
    for (const key of ALLOWED_SETTINGS_KEYS) {
      if (key in body) update[key] = body[key];
    }

    const [result] = await db
      .insert(siteSettings)
      .values({ id: 1, ...update })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          ...update,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
