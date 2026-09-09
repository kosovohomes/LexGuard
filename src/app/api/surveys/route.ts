import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";
import {
  SURVEY_MILESTONES,
  isSurveyStatus,
  pendingSurveys,
  sanitizeChannels,
  type SurveyStatus,
} from "@/lib/lexguard/surveys";

// GET /api/surveys — pending 30/90-day follow-ups + the user's own past responses.
// Milestones are computed from dossier export times (PRD §14 action-rate metric).
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const [dossiers, responses] = await Promise.all([
      db.dossier.findMany({
        where: { case: { userId: user.id } },
        select: { id: true, caseId: true, createdAt: true },
      }),
      db.survey.findMany({
        where: { userId: user.id },
        select: { dossierId: true, milestone: true, status: true, channels: true, notes: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
    const mapped = responses.map((r) => ({
      dossierId: r.dossierId,
      milestone: r.milestone,
      status: r.status as SurveyStatus,
      channels: r.channels ? (JSON.parse(r.channels) as string[]) : [],
      notes: r.notes ?? "",
      updatedAt: r.updatedAt.toISOString(),
    }));
    const pending = pendingSurveys(
      dossiers.map((d) => ({ id: d.id, caseId: d.caseId, createdAt: d.createdAt.toISOString() })),
      mapped,
    );
    return NextResponse.json({ pending, responses: mapped });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

// POST /api/surveys — upsert a self-reported outcome for one dossier milestone.
// Answers are private to the user; only counts are used in admin aggregates.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const b = await req.json();
    const dossierId = String(b.dossierId ?? "");
    const milestone = Number(b.milestone);
    const status = b.status;
    if (!(SURVEY_MILESTONES as readonly number[]).includes(milestone)) {
      return NextResponse.json({ error: "milestone" }, { status: 400 });
    }
    if (!isSurveyStatus(status)) return NextResponse.json({ error: "status" }, { status: 400 });
    const dossier = await db.dossier.findUnique({ where: { id: dossierId }, include: { case: true } });
    if (!dossier || dossier.case.userId !== user.id) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const channels = sanitizeChannels(b.channels);
    const notes = typeof b.notes === "string" ? b.notes.slice(0, 2000) : "";
    await db.survey.upsert({
      where: { userId_dossierId_milestone: { userId: user.id, dossierId, milestone } },
      create: { userId: user.id, dossierId, milestone, status, channels: JSON.stringify(channels), notes: notes || null },
      update: { status, channels: JSON.stringify(channels), notes: notes || null },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
