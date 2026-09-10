import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RULES, RULE_LIBRARY_VERSION } from "@/lib/lexguard/rules";
import { aggregatePatterns } from "@/lib/lexguard/aggregate";
import { normalizeEntry } from "@/lib/lexguard/api";
import { isUSState } from "@/lib/lexguard/types";
import type { CaseData, EntryData, USState } from "@/lib/lexguard/types";

// GET /api/admin/stats?code=... — aggregate-only stats (PRD FR-8, §14: no
// personal data). Phase-4 additions: knowledge-lift quiz averages (anonymous
// QuizResponse rows) and anonymized pattern counts × state (k-anonymity
// suppression lives in aggregate.ts).
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const expected = process.env.ADMIN_CODE ?? "lexguard-admin";
  if (code !== expected) return NextResponse.json({ error: "auth" }, { status: 401 });

  const [users, cases, entries, documents, dossiers, surveyTotal, surveyFiled, quizRows, reportTotal, report30d, reportRows] = await Promise.all([
    db.user.count(),
    db.case.count(),
    db.entry.count(),
    db.document.count(),
    db.dossier.count(),
    db.survey.count(),
    db.survey.count({ where: { status: "filed" } }),
    db.quizResponse.findMany({ select: { phase: true, score: true } }),
    db.contentReport.count(),
    db.contentReport.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } }),
    db.contentReport.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  // Aggregate pre/post averages — no identifiers exist to expose.
  const pre = quizRows.filter((r) => r.phase === "pre").map((r) => r.score);
  const post = quizRows.filter((r) => r.phase === "post").map((r) => r.score);
  const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
  const preAvg = avg(pre);
  const postAvg = avg(post);

  // Anonymized pattern counts × state (counts only, k-anonymized inside).
  const caseRows = await db.case.findMany({
    select: {
      id: true,
      attorneyName: true,
      firm: true,
      caseType: true,
      state: true,
      engagementStart: true,
      engagementEnd: true,
      status: true,
      feeType: true,
      agreedFeeAmount: true,
      contingencyPercent: true,
      createdAt: true,
    },
  });
  const entryRows = await db.entry.findMany({
    select: { id: true, caseId: true, type: true, occurredAt: true, createdAt: true, editedAt: true, title: true, body: true, data: true, documentId: true },
  });
  const docTags = await db.document.findMany({ select: { caseId: true, tags: true } });

  const entriesByCase = new Map<string, EntryData[]>();
  for (const e of entryRows) {
    const arr = entriesByCase.get(e.caseId) ?? [];
    arr.push(normalizeEntry(e as unknown as EntryData));
    entriesByCase.set(e.caseId, arr);
  }
  const feeByCase = new Set<string>();
  for (const d of docTags) {
    if (String(d.tags).split(",").map((x) => x.trim()).includes("fee_agreement")) feeByCase.add(d.caseId);
  }
  const inputs = caseRows.map((c) => ({
    case: {
      ...c,
      state: (isUSState(c.state) ? c.state : "TX") as USState,
      caseType: c.caseType as CaseData["caseType"],
      status: c.status as CaseData["status"],
      feeType: (c.feeType ?? null) as CaseData["feeType"],
      engagementStart: c.engagementStart ? c.engagementStart.toISOString() : null,
      engagementEnd: c.engagementEnd ? c.engagementEnd.toISOString() : null,
      createdAt: c.createdAt.toISOString(),
    } satisfies CaseData,
    entries: entriesByCase.get(c.id) ?? [],
    hasFeeAgreement: feeByCase.has(c.id),
  }));
  const patterns = aggregatePatterns(inputs);

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
      // knowledge-lift metric (PRD §14): anonymous pre/post averages, 0–5 scale
      quiz: {
        preCount: pre.length,
        postCount: post.length,
        preAvg,
        postAvg,
        lift: preAvg != null && postAvg != null ? postAvg - preAvg : null,
      },
      // anonymized aggregate reporting (PRD §13 Phase 4) — k-anonymized counts
      patterns: {
        totalCasesConsidered: patterns.totalCasesConsidered,
        casesWithObservations: patterns.casesWithObservations,
        cells: patterns.patterns,
        minCell: 5,
      },
      // trust metric (PRD §14): content-correction requests — anonymous, counts + recent queue
      reports: {
        total: reportTotal,
        last30d: report30d,
        recent: reportRows.map((r) => ({
          id: r.id,
          category: r.category,
          slug: r.slug,
          locale: r.locale,
          state: r.state,
          message: r.message,
          createdAt: r.createdAt.toISOString(),
        })),
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
