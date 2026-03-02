import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { earnings } from "@/db/schema";
import { desc, gte, and, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const startDate = searchParams.get("startDate");

  let conditions;
  if (platform && startDate) {
    conditions = and(eq(earnings.platform, platform), gte(earnings.earnedDate, startDate));
  } else if (platform) {
    conditions = eq(earnings.platform, platform);
  } else if (startDate) {
    conditions = gte(earnings.earnedDate, startDate);
  }

  const result = conditions
    ? await db.query.earnings.findMany({
        where: conditions,
        orderBy: [desc(earnings.earnedDate)],
      })
    : await db.query.earnings.findMany({
        orderBy: [desc(earnings.earnedDate)],
      });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, amount, earnedDate, note } = body;

    if (!platform || amount === undefined || !earnedDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [result] = await db
      .insert(earnings)
      .values({
        platform,
        amount: Number(amount),
        earnedDate,
        note: note || null,
      })
      .returning();

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create earning" }, { status: 500 });
  }
}
