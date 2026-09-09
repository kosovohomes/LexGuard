// LexGuard outcome tracking (Phase 3, PRD §14 "Action rate: self-reported filings
// (in-app follow-up at 30/90 days) / dossiers exported"). Isomorphic milestone math,
// shared by /api/surveys (account mode) and the local-mode adapter. Neutral, optional,
// privacy-first: free-text notes are never surfaced in aggregates — counts only.

export type SurveyStatus = "filed" | "not_yet" | "declined";

export const SURVEY_MILESTONES = [30, 90] as const;
export const SURVEY_CHANNELS = ["discipline", "csf", "fee", "malpractice"] as const;
export type SurveyChannel = (typeof SURVEY_CHANNELS)[number];

export interface DossierExport {
  id: string;
  caseId: string;
  createdAt: string; // ISO — export time
}

export interface SurveyResponse {
  dossierId: string;
  milestone: number;
  status: SurveyStatus;
  channels?: string[];
  notes?: string;
  updatedAt: string; // ISO
}

export interface PendingSurvey {
  dossierId: string;
  caseId: string;
  milestone: number;
  exportedAt: string;
  dueAt: string; // when the milestone window opened
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function pendingSurveys(
  dossiers: DossierExport[],
  responses: SurveyResponse[],
  now: Date = new Date(),
): PendingSurvey[] {
  const answered = new Set(responses.map((r) => `${r.dossierId}:${r.milestone}`));
  const out: PendingSurvey[] = [];
  for (const d of dossiers) {
    const t = new Date(d.createdAt).getTime();
    if (Number.isNaN(t)) continue;
    for (const m of SURVEY_MILESTONES) {
      const due = t + m * DAY_MS;
      if (now.getTime() >= due && !answered.has(`${d.id}:${m}`)) {
        out.push({
          dossierId: d.id,
          caseId: d.caseId,
          milestone: m,
          exportedAt: d.createdAt,
          dueAt: new Date(due).toISOString(),
        });
      }
    }
  }
  return out.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export interface SurveyAggregate {
  exports: number;
  responded: number; // any answered milestone (declined included)
  filed: number; // self-reported action taken
  actionRate: number | null; // filed / exports, count-only (PRD §14)
}

export function surveyAggregate(exportsCount: number, responses: SurveyResponse[]): SurveyAggregate {
  const filedDossiers = new Set(responses.filter((r) => r.status === "filed").map((r) => r.dossierId));
  const respondedDossiers = new Set(responses.map((r) => r.dossierId));
  return {
    exports: exportsCount,
    responded: respondedDossiers.size,
    filed: filedDossiers.size,
    actionRate: exportsCount > 0 ? filedDossiers.size / exportsCount : null,
  };
}

export function isSurveyStatus(v: unknown): v is SurveyStatus {
  return v === "filed" || v === "not_yet" || v === "declined";
}

export function sanitizeChannels(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((c): c is SurveyChannel => (SURVEY_CHANNELS as readonly string[]).includes(String(c)));
}
