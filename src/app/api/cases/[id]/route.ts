import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";

async function ownedCase(caseId: string, userId: string) {
  const c = await db.case.findUnique({ where: { id: caseId } });
  return c && c.userId === userId ? c : null;
}

// GET /api/cases/[id] — full case: entries + document metadata
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const c = await ownedCase(id, user.id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const [entries, documents] = await Promise.all([
    db.entry.findMany({ where: { caseId: id }, orderBy: { occurredAt: "desc" } }),
    db.document.findMany({
      where: { caseId: id },
      orderBy: { createdAt: "desc" },
      select: { id: true, caseId: true, filename: true, mime: true, size: true, tags: true, createdAt: true, entryId: true, ocrText: true },
    }),
  ]);
  return NextResponse.json({ case: c, entries, documents });
}

// PATCH /api/cases/[id] — update
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const c = await ownedCase(id, user.id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const b = await req.json();
  const updated = await db.case.update({
    where: { id },
    data: {
      attorneyName: b.attorneyName != null ? String(b.attorneyName).slice(0, 200) : undefined,
      firm: b.firm !== undefined ? (b.firm ? String(b.firm).slice(0, 200) : null) : undefined,
      caseType: b.caseType != null ? String(b.caseType) : undefined,
      engagementStart: b.engagementStart !== undefined ? (b.engagementStart ? new Date(b.engagementStart) : null) : undefined,
      engagementEnd: b.engagementEnd !== undefined ? (b.engagementEnd ? new Date(b.engagementEnd) : null) : undefined,
      status: b.status != null ? (b.status === "ended" ? "ended" : "active") : undefined,
      feeType: b.feeType !== undefined ? b.feeType : undefined,
      agreedFeeAmount: b.agreedFeeAmount !== undefined ? (b.agreedFeeAmount != null && b.agreedFeeAmount !== "" ? Number(b.agreedFeeAmount) : null) : undefined,
      contingencyPercent: b.contingencyPercent !== undefined ? (b.contingencyPercent != null && b.contingencyPercent !== "" ? Number(b.contingencyPercent) : null) : undefined,
    },
  });
  return NextResponse.json({ case: updated });
}

// DELETE /api/cases/[id] — Phase 5c: ?purge=1 hard-deletes immediately;
// otherwise the case is soft-deleted (trash, 30-day recovery window).
// PRD Open Question 5 decision implemented: short soft-delete window for
// accidental-deletion recovery, then automatic purge.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const c = await ownedCase(id, user.id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const purge = new URL(req.url).searchParams.get("purge");
  if (purge) {
    await db.case.delete({ where: { id } });
  } else {
    await db.case.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  return NextResponse.json({ ok: true });
}

// POST /api/cases/[id]/restore — clear the soft-delete marker (Phase 5c)
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const c = await ownedCase(id, user.id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const restored = await db.case.update({ where: { id }, data: { deletedAt: null } });
  return NextResponse.json({ case: restored });
}
