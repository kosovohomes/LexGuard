// LexGuard Rules-Library Governance (Phase 5e) — PRD Open Question 2:
// "rules-as-JSON authoring" + FR-3.4 attorney-review sign-off workflow.
//
// The runtime engine always uses the compiled, versioned RULES array — no
// runtime substitution — so determinism (PRD FR-3) can never be compromised by
// an import. This module instead provides the *authoring pipeline*: a
// canonical, versioned JSON export with a SHA-256 integrity hash, and a
// structural validator used when a reviewed candidate library is imported for
// comparison. A candidate that passes validation can be compared rule-by-rule
// against the live library and then shipped as a new compiled version after
// counsel sign-off — the same gate every previous rule change went through.

import { CORE_RULES, RULE_LIBRARY_VERSION, RULES, ruleCitationString } from "./rules";
import { STATE_CODES } from "./types";
import type { USState } from "./types";

export const RULES_DOC_FORMAT = "lexguard-rules";
export const RULES_DOC_FORMAT_VERSION = 2;

export interface RulesLibraryDoc {
  format: string;
  formatVersion: number;
  libraryVersion: string;
  exportedAt: string;
  ruleCount: number;
  hash: string; // SHA-256 hex of the canonical rules payload
  rules: unknown[];
}

const TRIGGERS = new Set([
  "settlement_no_disbursement",
  "retainer_no_refund",
  "cash_or_personal_payments",
  "charges_not_in_agreement",
  "silence_after_attempts_30d",
  "missed_deadline_no_prep",
  "missed_appearance",
  "case_dormant_90d",
  "repeated_unanswered_14d",
  "staff_only_contact",
  "settlement_without_authorization",
  "file_not_returned",
  "conflict_of_interest",
  "paid_exceeds_agreement",
  "contingency_overage",
  "unrelated_billing",
  "admin_fees_not_in_agreement",
  "asked_to_lie",
  "guaranteed_outcome",
  "missing_fee_agreement",
]);

const SEVERITIES = new Set(["high", "medium", "standard"]);
const CHANNELS = new Set(["discipline", "csf", "fee", "malpractice"]);

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  count: number;
}

function isBilingual(x: unknown): boolean {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.en === "string" && typeof o.es === "string";
}

function isStringArray(x: unknown): boolean {
  return Array.isArray(x) && x.every((v) => typeof v === "string");
}

/** Structural validation of a candidate rules library document. */
export function validateRulesLibrary(doc: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof doc !== "object" || doc === null) return { ok: false, errors: ["not_an_object"], count: 0 };
  const d = doc as Record<string, unknown>;
  if (d.format !== RULES_DOC_FORMAT) errors.push("format_mismatch");
  if (d.formatVersion !== RULES_DOC_FORMAT_VERSION) errors.push("format_version_mismatch");
  if (typeof d.libraryVersion !== "string" || (d.libraryVersion as string).length === 0) errors.push("missing_library_version");
  if (!Array.isArray(d.rules)) return { ok: false, errors: [...errors, "rules_not_array"], count: 0 };

  const rules = d.rules;
  const seenIds = new Set<string>();
  for (let i = 0; i < rules.length; i++) {
    const r: unknown = rules[i];
    if (typeof r !== "object" || r === null) {
      errors.push(`rule_${i}:not_an_object`);
      continue;
    }
    const rule = r as Record<string, unknown>;
    const id: string = typeof rule.id === "string" ? rule.id : `#${i}`;
    if (typeof rule.id !== "string" || !/^RF-\d{2}$/.test(rule.id)) errors.push(`${id}:bad_id`);
    if (seenIds.has(id)) errors.push(`${id}:duplicate`);
    if (typeof rule.id === "string") seenIds.add(rule.id);
    if (typeof rule.trigger !== "string" || !TRIGGERS.has(rule.trigger)) errors.push(`${id}:bad_trigger`);
    if (
      !Array.isArray(rule.states) ||
      (rule.states as unknown[]).length === 0 ||
      !(rule.states as unknown[]).every((s) => typeof s === "string" && (STATE_CODES as readonly string[]).includes(s))
    ) {
      errors.push(`${id}:bad_states`);
    }
    if (typeof rule.severity !== "string" || !SEVERITIES.has(rule.severity)) errors.push(`${id}:bad_severity`);
    if (!isBilingual(rule.title)) errors.push(`${id}:bad_title`);
    if (!isBilingual(rule.template)) errors.push(`${id}:bad_template`);
    if (
      !Array.isArray(rule.channels) ||
      (rule.channels as unknown[]).length === 0 ||
      !(rule.channels as unknown[]).every((c) => typeof c === "string" && CHANNELS.has(c))
    ) {
      errors.push(`${id}:bad_channels`);
    }
    const ev = rule.evidence as Record<string, unknown> | undefined;
    if (!isStringArray(ev?.en) || !isStringArray(ev?.es)) errors.push(`${id}:bad_evidence`);
    if (typeof rule.citations !== "object" || rule.citations === null) {
      errors.push(`${id}:bad_citations`);
    } else {
      for (const st of STATE_CODES) {
        const c = (rule.citations as Record<string, unknown>)[st as USState];
        if (!isStringArray(c)) errors.push(`${id}:citations_missing_${st}`);
      }
    }
    if (rule.reviewer !== null && typeof rule.reviewer !== "string") errors.push(`${id}:bad_reviewer`);
    if (rule.reviewedAt !== null && typeof rule.reviewedAt !== "string") errors.push(`${id}:bad_reviewedAt`);
    if (typeof rule.effectiveFrom !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(rule.effectiveFrom)) errors.push(`${id}:bad_effectiveFrom`);
  }
  return { ok: errors.length === 0, errors: errors.slice(0, 25), count: rules.length };
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function canonicalRulesPayload(): string {
  // Canonical serialization: stable key order (as authored) — any future
  // change to a rule changes the hash, which is exactly the point.
  return JSON.stringify(
    {
      format: RULES_DOC_FORMAT,
      formatVersion: RULES_DOC_FORMAT_VERSION,
      libraryVersion: RULE_LIBRARY_VERSION,
      rules: RULES,
    },
    null,
    2,
  );
}

/** Build the exportable governance document with an integrity hash. */
export async function buildRulesLibraryDoc(): Promise<RulesLibraryDoc> {
  const payload = canonicalRulesPayload();
  const hash = await sha256Hex(payload);
  return {
    format: RULES_DOC_FORMAT,
    formatVersion: RULES_DOC_FORMAT_VERSION,
    libraryVersion: RULE_LIBRARY_VERSION,
    exportedAt: new Date().toISOString(),
    ruleCount: RULES.length,
    hash,
    rules: RULES,
  };
}

/** Export the live library as a downloadable, hash-stamped JSON document. */
export async function downloadRulesLibrary(): Promise<string> {
  const doc = await buildRulesLibraryDoc();
  const text = JSON.stringify(doc, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lexguard-rules-${RULE_LIBRARY_VERSION}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return doc.hash;
}

/** Validate an imported candidate document and report differences vs live. */
export async function importRulesLibrary(text: string): Promise<ValidationResult & { hash?: string; changedRuleIds?: string[] }> {
  let doc: unknown;
  try {
    doc = JSON.parse(text);
  } catch {
    return { ok: false, errors: ["bad_json"], count: 0 };
  }
  const result = validateRulesLibrary(doc);
  if (!result.ok) return result;
  const d = doc as { hash?: string; rules: { id: string; template?: unknown; citations?: unknown; severity?: unknown }[] };
  // compare against the live library rule-by-rule (template+citations+severity)
  const live = new Map(RULES.map((r) => [r.id, JSON.stringify({ t: r.template, c: r.citations, s: r.severity })]));
  const changed: string[] = [];
  for (const r of d.rules) {
    const key = JSON.stringify({ t: r.template, c: r.citations, s: r.severity });
    if (live.get(r.id) !== key) changed.push(r.id);
  }
  const hash = typeof d.hash === "string" ? d.hash : await sha256Hex(canonicalRulesPayload());
  return { ...result, hash, changedRuleIds: changed };
}

// Authoring-side helper for reviewing a candidate: per-rule citation strings.
export function ruleCitationsForReview(): { id: string; citations: Record<USState, string>; reviewer: string | null }[] {
  return RULES.map((r) => ({
    id: r.id,
    citations: Object.fromEntries(STATE_CODES.map((st) => [st, ruleCitationString(r, st)])) as Record<USState, string>,
    reviewer: r.reviewer,
  }));
}

// Exposed for the admin governance card: authored (core) rule count and live count.
export function libraryStats(): { core: number; live: number; version: string } {
  return { core: CORE_RULES.length, live: RULES.length, version: RULE_LIBRARY_VERSION };
}
