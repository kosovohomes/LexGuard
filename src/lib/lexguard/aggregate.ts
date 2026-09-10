// LexGuard anonymized aggregate reporting (PRD §13 Phase 4: "Anonymized
// aggregate reporting — e.g. 'N documented complaints concern fee practices in
// TX'"). Privacy-first by construction: counts only, k-anonymity suppression
// (cells under MIN_CELL are never released), no narrative, no free text, no
// identifiers. Runs the same deterministic rules engine used in the product.

import { STATE_CODES } from "./types";
import type { CaseData, ChannelKind, EntryData, USState } from "./types";
import { evaluateCase } from "./engine";

// Pattern categories mirror PRD §8's rule groupings; RF ids map in order.
export const PATTERN_CATEGORIES = [
  "trust_money",
  "diligence",
  "communication",
  "authority_conflict",
  "fees",
  "other",
] as const;
export type PatternCategory = (typeof PATTERN_CATEGORIES)[number];

const CATEGORY_BY_RULE: Record<string, PatternCategory> = {};
const RANGES: [PatternCategory, number, number][] = [
  ["trust_money", 1, 4],
  ["diligence", 5, 8],
  ["communication", 9, 10],
  ["authority_conflict", 11, 13],
  ["fees", 14, 17],
  ["other", 18, 20],
];
for (const [cat, lo, hi] of RANGES) {
  for (let i = lo; i <= hi; i++) {
    const id = `RF-${String(i).padStart(2, "0")}`;
    CATEGORY_BY_RULE[id] = cat;
  }
}

// k-anonymity floor: aggregate cells with fewer cases than this show as null
// (never published) so the aggregate cannot single anyone out (PRD §14:
// "Explicitly NOT measured" spirit + §9.2 minimum-PII posture).
export const MIN_CELL = 5;

export type PatternCounts = Record<USState, Record<PatternCategory, number | null>>;

export interface AggregateInputCase {
  case: CaseData;
  entries: EntryData[];
  hasFeeAgreement: boolean;
}

export interface AggregateReport {
  totalCasesConsidered: number;
  casesWithObservations: number;
  patterns: PatternCounts;
}

export function aggregatePatterns(inputs: AggregateInputCase[], now: Date = new Date()): AggregateReport {
  const base = {
    trust_money: 0,
    diligence: 0,
    communication: 0,
    authority_conflict: 0,
    fees: 0,
    other: 0,
  } as Record<PatternCategory, number>;
  const counts: PatternCounts = Object.fromEntries(STATE_CODES.map((st) => [st, { ...base }])) as PatternCounts;

  let casesWithObservations = 0;
  for (const input of inputs) {
    const state: USState = input.case.state;
    // locale only affects wording, not triggering — use "en" for determinism
    const observations = evaluateCase(input.case, input.entries, input.hasFeeAgreement, "en", now);
    if (observations.length === 0) continue;
    casesWithObservations++;
    const seen = new Set<PatternCategory>();
    for (const o of observations) {
      const cat = CATEGORY_BY_RULE[o.ruleId];
      if (cat && !seen.has(cat)) {
        seen.add(cat);
        counts[state][cat] = (counts[state][cat] ?? 0) + 1;
      }
    }
  }

  // suppress small cells (k-anonymity)
  for (const st of STATE_CODES) {
    for (const cat of PATTERN_CATEGORIES) {
      const v = counts[st][cat];
      if (v != null && v < MIN_CELL) counts[st][cat] = null;
    }
  }

  return { totalCasesConsidered: inputs.length, casesWithObservations, patterns: counts };
}

export function categoryChannels(cat: PatternCategory): ChannelKind[] {
  switch (cat) {
    case "trust_money":
      return ["discipline", "csf"];
    case "fees":
      return ["fee", "discipline"];
    case "diligence":
    case "communication":
    case "authority_conflict":
      return ["discipline"];
    case "other":
      return ["discipline", "malpractice"];
  }
}
