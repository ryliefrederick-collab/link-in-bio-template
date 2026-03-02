import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
    }

    await Promise.all(
      orderedIds.map((id: number, i: number) =>
        db
          .update(links)
          .set({ sortOrder: i, updatedAt: new Date().toISOString() })
          .where(eq(links.id, id))
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder links" }, { status: 500 });
  }
}
