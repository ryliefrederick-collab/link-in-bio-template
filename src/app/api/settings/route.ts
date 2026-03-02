import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });

  if (!settings) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const [result] = await db
      .update(siteSettings)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(siteSettings.id, 1))
      .returning();

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
