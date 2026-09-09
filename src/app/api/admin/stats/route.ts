import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RULES, RULE_LIBRARY_VERSION } from "@/lib/lexguard/rules";

// GET /api/admin/stats?code=... — aggregate-only stats (PRD FR-8, §14: no personal data)
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const expected = process.env.ADMIN_CODE ?? "lexguard-admin";
  if (code !== expected) return NextResponse.json({ error: "auth" }, { status: 401 });
  const [users, cases, entries, documents, dossiers, surveyTotal, surveyFiled] = await Promise.all([
    db.user.count(),
    db.case.count(),
    db.entry.count(),
    db.document.count(),
    db.dossier.count(),
    db.survey.count(),
    db.survey.count({ where: { status: "filed" } }),
  ]);
  return NextResponse.json({
    stats: {
      users,
      cases,
      entries,
      documents,
      dossiers,
      rulesLive: RULES.length,
      ruleLibraryVersion: RULE_LIBRARY_VERSION,
      // action-rate metric (PRD §14): self-reported filings / dossiers exported — counts only
      surveys: {
        total: surveyTotal,
        filed: surveyFiled,
        actionRate: dossiers > 0 ? surveyFiled / dossiers : null,
      },
    },
    rules: RULES.map((r) => ({
      id: r.id,
      trigger: r.trigger,
      states: r.states,
      severity: r.severity,
      title: r.title.en,
      reviewer: r.reviewer,
      reviewedAt: r.reviewedAt,
      effectiveFrom: r.effectiveFrom,
    })),
  });
}
