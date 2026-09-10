import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isUSState } from "@/lib/lexguard/types";

// POST /api/reports — anonymous content-correction reports (PRD §14 trust
// metric, §15 "content-correction requests" mitigation). Deliberately stores
// NO user identifier — same anonymity design as /api/quiz. Reports feed the
// admin trust queue so corrections can be tracked and closed.

const CATEGORIES = new Set(["error", "outdated", "unclear", "other"]);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const { category, slug, locale, state, message } = (body ?? {}) as {
    category?: unknown;
    slug?: unknown;
    locale?: unknown;
    state?: unknown;
    message?: unknown;
  };
  if (typeof category !== "string" || !CATEGORIES.has(category)) {
    return NextResponse.json({ error: "bad_category" }, { status: 400 });
  }
  const loc = locale === "es" ? "es" : "en";
  const slugClean = typeof slug === "string" ? slug.slice(0, 80) : null;
  const stateClean = isUSState(state) ? state : null;
  const msgClean = typeof message === "string" ? message.trim().slice(0, 1000) : null;
  // abuse cap: ignore absurd volumes inside the same anonymous minute-window
  const recent = await db.contentReport.count({ where: { createdAt: { gte: new Date(Date.now() - 60 * 1000) } } });
  if (recent > 50) return NextResponse.json({ ok: true, skipped: "rate" });
  const report = await db.contentReport.create({
    data: { category, slug: slugClean, locale: loc, state: stateClean, message: msgClean },
  });
  return NextResponse.json({ ok: true, id: report.id });
}
