import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/quiz — anonymous knowledge-lift submission (PRD §14).
// Deliberately stores NO user identifier: { phase, score } only, so admin can
// compute aggregate pre/post averages and never link a score to a person.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const { phase, score } = (body ?? {}) as { phase?: unknown; score?: unknown };
  if (phase !== "pre" && phase !== "post") return NextResponse.json({ error: "bad_phase" }, { status: 400 });
  if (typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 5) {
    return NextResponse.json({ error: "bad_score" }, { status: 400 });
  }
  // abuse cap: ignore absurd volumes inside the same anonymous minute-window
  const recent = await db.quizResponse.count({ where: { createdAt: { gte: new Date(Date.now() - 60 * 1000) } } });
  if (recent > 100) return NextResponse.json({ ok: true, skipped: "rate" });
  await db.quizResponse.create({ data: { phase, score } });
  return NextResponse.json({ ok: true });
}
