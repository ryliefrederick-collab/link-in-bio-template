import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { earnings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [result] = await db
      .update(earnings)
      .set(body)
      .where(eq(earnings.id, Number(id)))
      .returning();

    if (!result) {
      return NextResponse.json({ error: "Earning not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update earning" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(earnings).where(eq(earnings.id, Number(id)));
    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete earning" }, { status: 500 });
  }
}
