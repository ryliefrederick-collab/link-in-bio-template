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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const [result] = await db
      .insert(siteSettings)
      .values({ id: 1 })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
