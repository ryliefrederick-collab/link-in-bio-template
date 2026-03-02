import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const link = await db.query.links.findFirst({
    where: eq(links.id, Number(id)),
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [result] = await db
      .update(links)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(links.id, Number(id)))
      .returning();

    if (!result) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.delete(links).where(eq(links.id, Number(id)));

    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
