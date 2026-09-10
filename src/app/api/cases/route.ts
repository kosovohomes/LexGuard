import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";

// GET /api/cases — list user's cases with counts.
// Phase 5c: cases soft-deleted more than 30 days ago are purged permanently
// on list (the trash/recovery window); the response includes deletedAt so the
// client can separate live cases from trashed ones.
const TRASH_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  await db.case.deleteMany({
    where: { userId: user.id, deletedAt: { lt: new Date(Date.now() - TRASH_WINDOW_MS) } },
  });
  const cases = await db.case.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entries: true, documents: true, dossiers: true } } },
  });
  return NextResponse.json({ cases });
}

// POST /api/cases — create
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.attorneyName || !b.caseType || !["TX", "CA"].includes(b.state)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const created = await db.case.create({
      data: {
        userId: user.id,
        attorneyName: String(b.attorneyName).slice(0, 200),
        firm: b.firm ? String(b.firm).slice(0, 200) : null,
        caseType: String(b.caseType),
        state: b.state,
        engagementStart: b.engagementStart ? new Date(b.engagementStart) : null,
        engagementEnd: b.engagementEnd ? new Date(b.engagementEnd) : null,
        status: b.status === "ended" ? "ended" : "active",
        feeType: b.feeType ?? null,
        agreedFeeAmount: b.agreedFeeAmount != null && b.agreedFeeAmount !== "" ? Number(b.agreedFeeAmount) : null,
        contingencyPercent: b.contingencyPercent != null && b.contingencyPercent !== "" ? Number(b.contingencyPercent) : null,
      },
    });
    return NextResponse.json({ case: created });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
