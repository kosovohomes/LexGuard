import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser, destroySession } from "@/lib/lexguard/auth";

// GET /api/account — full JSON export (PRD FR-5.2, §3.4 data ownership, CCPA/CPRA access+portability)
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const u = await db.user.findUnique({
    where: { id: user.id },
    include: {
      cases: {
        include: {
          entries: true,
          documents: { select: { id: true, caseId: true, filename: true, mime: true, size: true, tags: true, createdAt: true, sha256: true } },
          dossiers: true,
        },
      },
    },
  });
  if (!u) return NextResponse.json({ error: "auth" }, { status: 401 });
  const exportData = {
    exportedAt: new Date().toISOString(),
    format: "lexguard-export-v1",
    account: { email: u.email, state: u.state, locale: u.locale, createdAt: u.createdAt },
    cases: u.cases.map((c) => ({
      ...c,
      entries: c.entries.map((e) => ({ ...e, data: e.data ? JSON.parse(e.data) : null })),
      documents: c.documents.map(({ sha256: _s, ...rest }) => rest),
    })),
  };
  return NextResponse.json(exportData, {
    headers: { "Content-Disposition": `attachment; filename="lexguard-export-${new Date().toISOString().slice(0, 10)}.json"` },
  });
}

// DELETE /api/account — full erasure request (PRD §9.2: purge within 30 days; MVP: immediate)
export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  await db.user.delete({ where: { id: user.id } }); // cascades sessions/cases/entries/documents
  await destroySession();
  return NextResponse.json({ ok: true });
}
