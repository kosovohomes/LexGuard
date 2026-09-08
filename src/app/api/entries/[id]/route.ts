import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";

async function ownedEntry(entryId: string, userId: string) {
  const e = await db.entry.findUnique({ where: { id: entryId }, include: { case: true } });
  return e && e.case.userId === userId ? e : null;
}

// PATCH /api/entries/[id] — edit content; createdAt stays immutable, editedAt set (FR-2.3)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const e = await ownedEntry(id, user.id);
  if (!e) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const b = await req.json();
  const updated = await db.entry.update({
    where: { id },
    data: {
      title: b.title != null ? String(b.title).slice(0, 300) : undefined,
      body: b.body !== undefined ? (b.body ? String(b.body).slice(0, 20000) : null) : undefined,
      occurredAt: b.occurredAt != null ? new Date(b.occurredAt) : undefined,
      data: b.data !== undefined ? (b.data ? JSON.stringify(b.data) : null) : undefined,
      editedAt: new Date(),
    },
  });
  return NextResponse.json({ entry: updated });
}

// DELETE /api/entries/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const e = await ownedEntry(id, user.id);
  if (!e) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await db.entry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
