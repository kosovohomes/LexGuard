// LexGuard Red-Flag Engine — PRD §6.3 / §7.3 (FR-3)
// Pure, deterministic evaluation of journal facts against the declarative rule
// library. Runs identically in account mode and anonymous local mode.
// Output is neutral observations — never legal conclusions (PRD §3.1).

import type {
  CaseData,
  CaseFacts,
  CommunicationData,
  DeadlineData,
  EntryData,
  Observation,
  PaymentData,
  PromiseData,
  USState,
} from "./types";
import { RULES, RULE_LIBRARY_VERSION, interpolate, ruleCitationString } from "./rules";

const DAY = 86400000;

function days(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / DAY);
}

function commData(e: EntryData): CommunicationData {
  return (e.data ?? {}) as CommunicationData;
}
function payData(e: EntryData): PaymentData {
  return (e.data ?? {}) as PaymentData;
}
function dlData(e: EntryData): DeadlineData {
  return (e.data ?? {}) as DeadlineData;
}

export function computeFacts(
  caseRow: CaseData,
  entries: EntryData[],
  hasFeeAgreementDoc: boolean,
  now: Date = new Date(),
): CaseFacts {
  const f: CaseFacts = {
    attemptCount: 0,
    unansweredDays: 0,
    attemptsLast14d: 0,
    attemptsSpanDays: 0,
    staffOnlyResponses: 0,
    requestedDirectContact: false,
    daysSinceSettlement: 0,
    settlementAmount: 0,
    totalPaid: 0,
    caseEnded: caseRow.status === "ended",
    endedAt: caseRow.engagementEnd ?? undefined,
    cashWithoutReceipt: 0,
    paidPersonally: 0,
    chargesNotInAgreement: 0,
    adminFeesNotInAgreement: 0,
    contingencyOverage: false,
    totalPaidExceedsAgreement: false,
    hasFeeAgreementDoc,
    missedDeadlines: 0,
    missedPrepBeforeDeadline: false,
    missedAppearance: false,
    dormantDays: 0,
    fileReturnRequested: false,
    fileReturnDaysWaiting: 0,
    fileReturnRefused: false,
    settledWithoutAuthorization: false,
    askedToLie: false,
    guaranteedOutcome: false,
    conflictFlag: false,
    unrelatedBilling: false,
    openPromisesPastDue: 0,
  };

  const attempts: Date[] = [];
  let firstUnanswered: Date | null = null;
  let latestActivity: Date | null = null;
  let settlement: Date | null = null;
  let disbursed: Date | null = null;
  let deadlineDates: { at: Date; missed: boolean; appearance: boolean }[] = [];

  for (const e of entries) {
    const at = new Date(e.occurredAt);
    if (!latestActivity || at > latestActivity) latestActivity = at;

    if (e.type === "communication") {
      const c = commData(e);
      if (c.direction === "to_attorney") {
        attempts.push(at);
        if (!firstUnanswered && !c.responseReceived) firstUnanswered = at;
      } else if (c.responseReceived || c.respondedBy) {
        if (c.respondedBy === "staff") f.staffOnlyResponses++;
        if (!f.lastResponseAt || at > new Date(f.lastResponseAt)) f.lastResponseAt = e.occurredAt;
      }
      if (c.requestedDirectAttorneyContact) f.requestedDirectContact = true;
      if (c.requestedFileReturn) {
        f.fileReturnRequested = true;
        if (!f.fileReturnRequestedAt) (f as { fileReturnRequestedAt?: Date }).fileReturnRequestedAt = at;
      }
      if (c.fileReturnRefused) f.fileReturnRefused = true;
      if (c.settledWithoutAuthorization) f.settledWithoutAuthorization = true;
      if (c.askedToLie) f.askedToLie = true;
      if (c.guaranteedOutcome) f.guaranteedOutcome = true;
      if (c.conflictFlag) f.conflictFlag = true;
      if (c.unrelatedBillingFlag) f.unrelatedBilling = true;
    }

    if (e.type === "payment") {
      const p = payData(e);
      f.totalPaid += p.amount;
      if (p.kind === "retainer") f.retainerPaid = (f.retainerPaid ?? 0) + p.amount;
      if (p.kind === "refund") f.refundReceived = (f.refundReceived ?? 0) + p.amount;
      if (p.kind === "settlement_received") {
        if (!settlement || at > settlement) {
          settlement = at;
          f.settlementAmount = (f.settlementAmount ?? 0) + p.amount;
        }
      }
      if (p.kind === "disbursement" && (!disbursed || at > disbursed)) disbursed = at;
      if (p.method === "cash" && !p.receipt) f.cashWithoutReceipt++;
      if (p.payee === "attorney_personally") f.paidPersonally++;
      if (p.notInAgreement) {
        f.chargesNotInAgreement++;
        if (p.kind === "administrative") f.adminFeesNotInAgreement++;
      }
      if (p.kind === "contingency_payout" && p.percentPaid != null && caseRow.contingencyPercent != null) {
        f.lastContingencyPercent = p.percentPaid;
        if (p.percentPaid > caseRow.contingencyPercent) f.contingencyOverage = true;
      }
    }

    if (e.type === "deadline") {
      const d = dlData(e);
      if (d.kind === "court" || d.kind === "filing") {
        deadlineDates.push({ at, missed: d.status === "missed", appearance: d.kind === "court" && !!d.missedAppearance });
        if (d.status === "missed") f.missedDeadlines++;
        if (d.missedAppearance) f.missedAppearance = true;
      }
    }

    if (e.type === "promise") {
      const pr = e.data as PromiseData;
      if (pr.promisedBy && pr.fulfilled === false) {
        if (new Date(pr.promisedBy) < now) f.openPromisesPastDue++;
      }
    }
  }

  // unanswered-window math (rules 5 & 9)
  const lastResponse = f.lastResponseAt ? new Date(f.lastResponseAt) : null;
  const unansweredAttempts = lastResponse
    ? attempts.filter((a) => a > lastResponse)
    : attempts;
  if (unansweredAttempts.length > 0) {
    const first = unansweredAttempts[0];
    const last = unansweredAttempts[unansweredAttempts.length - 1];
    const windowEnd = f.caseEnded && f.endedAt ? new Date(f.endedAt) : now;
    f.unansweredDays = Math.max(days(windowEnd, first), 1);
    f.attemptsSpanDays = Math.max(days(last, first), 0);
    f.attemptsLast14d = unansweredAttempts.filter((a) => days(windowEnd, a) <= 14).length;
  }

  if (attempts.length > 0) {
    f.attemptCount = attempts.length;
    f.firstAttemptAt = attempts[0].toISOString();
  }

  if (settlement) {
    f.settlementReceivedAt = settlement.toISOString();
    f.daysSinceSettlement = days(now, settlement);
  }
  if (disbursed) f.disbursedAt = disbursed.toISOString();

  if (f.caseEnded && f.endedAt) {
    const end = new Date(f.endedAt);
    if (f.fileReturnRequestedAt) {
      f.fileReturnDaysWaiting = Math.max(days(now, f.fileReturnRequestedAt as Date), 1);
    }
    void end;
  }

  // dormancy (rule 8): no entries in 90+ days while case active
  if (!f.caseEnded && latestActivity) {
    f.dormantDays = days(now, latestActivity);
  }

  // prep check for missed deadlines (rule 6): any substantive entry within 14 days before a missed deadline
  const substantive = entries.filter(
    (e) => e.type === "communication" || e.type === "note" || e.type === "document",
  );
  for (const d of deadlineDates) {
    if (d.missed) {
      const prep = substantive.some((e) => {
        const t = new Date(e.occurredAt).getTime();
        return t <= d.at.getTime() && t >= d.at.getTime() - 14 * DAY;
      });
      if (!prep) f.missedPrepBeforeDeadline = true;
    }
  }

  // fee agreement math (rules 14 & 20)
  const feeExempt = !caseRow.feeType || caseRow.feeType === "none" || caseRow.feeType === "contingency";
  if (caseRow.agreedFeeAmount != null && caseRow.agreedFeeAmount > 0 && !feeExempt) {
    f.totalPaidExceedsAgreement = f.totalPaid > caseRow.agreedFeeAmount;
  }

  return f;
}

// Evaluate rules for a case → neutral observations sorted by severity.
export function evaluateCase(
  caseRow: CaseData,
  entries: EntryData[],
  hasFeeAgreementDoc: boolean,
  locale: "en" | "es",
  now: Date = new Date(),
): Observation[] {
  const f = computeFacts(caseRow, entries, hasFeeAgreementDoc, now);
  const state = caseRow.state;
  const out: Observation[] = [];
  const money = (n: number) => `$${n.toLocaleString(locale === "es" ? "es-MX" : "en-US")}`;
  const fmt = (d: Date | string) =>
    new Date(d).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric" });

  const fire = (id: string, vars: Record<string, string | number>) => {
    const rule = RULES.find((r) => r.id === id);
    if (!rule || !rule.states.includes(state)) return;
    const text = interpolate(locale === "es" ? rule.template.es : rule.template.en, {
      ...vars,
      state: state,
      cite: ruleCitationString(rule, state),
    });
    out.push({
      ruleId: rule.id,
      ruleVersion: RULE_LIBRARY_VERSION,
      title: locale === "es" ? rule.title.es : rule.title.en,
      text,
      citations: rule.citations[state],
      channels: rule.channels,
      severity: rule.severity,
      evidence: locale === "es" ? rule.evidence.es : rule.evidence.en,
      generatedAt: now.toISOString(),
    });
  };

  // RF-01 — settlement held without disbursement (30/60/90-day tiers)
  if (f.settlementReceivedAt && !f.disbursedAt) {
    if (f.daysSinceSettlement >= 30) {
      fire("RF-01", { amount: money(f.settlementAmount ?? 0), date: fmt(f.settlementReceivedAt), days: f.daysSinceSettlement });
    }
  }
  // RF-02 — retainer, no refund, case ended
  if ((f.retainerPaid ?? 0) > 0 && f.caseEnded && !f.refundReceived) {
    fire("RF-02", {
      amount: money(f.retainerPaid ?? 0),
      ended: f.endedAt ? ` (${fmt(f.endedAt)})` : "",
    });
  }
  // RF-03 — cash without receipts / paid personally
  if (f.cashWithoutReceipt > 0 || f.paidPersonally > 0) {
    fire("RF-03", { cash: String(f.cashWithoutReceipt), personal: String(f.paidPersonally) });
  }
  // RF-04 — charges not in agreement
  if (f.chargesNotInAgreement > 0 && !(f.adminFeesNotInAgreement === f.chargesNotInAgreement)) {
    fire("RF-04", { count: String(f.chargesNotInAgreement) });
  }
  // RF-05 — 30+ days silence after repeated attempts
  if (f.attemptCount >= 3 && f.unansweredDays >= 30) {
    fire("RF-05", { attempts: String(f.attemptCount), span: String(Math.max(f.attemptsSpanDays, f.unansweredDays)) });
  }
  // RF-06 — missed deadline, no prep
  if (f.missedDeadlines > 0 && f.missedPrepBeforeDeadline) {
    fire("RF-06", { date: f.endedAt ? fmt(f.endedAt) : fmt(now) });
  }
  // RF-07 — missed appearance
  if (f.missedAppearance) {
    fire("RF-07", { date: f.endedAt ? fmt(f.endedAt) : fmt(now) });
  }
  // RF-08 — dormant 90+ days
  if (f.dormantDays >= 90) {
    fire("RF-08", { days: String(f.dormantDays) });
  }
  // RF-09 — 3+ unanswered attempts in 14 days
  if (f.attemptsLast14d >= 3) {
    fire("RF-09", { attempts: String(f.attemptsLast14d) });
  }
  // RF-10 — staff-only responses after request for attorney
  if (f.requestedDirectContact && f.staffOnlyResponses >= 2) {
    fire("RF-10", { count: String(f.staffOnlyResponses) });
  }
  // RF-11 — settled without authorization
  if (f.settledWithoutAuthorization) fire("RF-11", {});
  // RF-12 — file not returned
  if (f.caseEnded && f.fileReturnRequested && (f.fileReturnDaysWaiting >= 14 || f.fileReturnRefused)) {
    fire("RF-12", { days: String(f.fileReturnDaysWaiting), refused: f.fileReturnRefused ? (locale === "es" ? " y fue negado" : " and was refused") : "" });
  }
  // RF-13 — conflict
  if (f.conflictFlag) fire("RF-13", {});
  // RF-14 — paid exceeds agreement
  if (f.totalPaidExceedsAgreement && caseRow.agreedFeeAmount) {
    fire("RF-14", { paid: money(f.totalPaid), agreed: money(caseRow.agreedFeeAmount) });
  }
  // RF-15 — contingency overage
  if (f.contingencyOverage) {
    fire("RF-15", { percent: String(f.lastContingencyPercent ?? "?"), agreed: String(caseRow.contingencyPercent ?? "?") });
  }
  // RF-16 — unrelated billing
  if (f.unrelatedBilling) fire("RF-16", { count: "1" });
  // RF-17 — admin fees not in agreement
  if (f.adminFeesNotInAgreement > 0) fire("RF-17", { count: String(f.adminFeesNotInAgreement) });
  // RF-18 — asked to lie
  if (f.askedToLie) fire("RF-18", {});
  // RF-19 — guaranteed outcome
  if (f.guaranteedOutcome) fire("RF-19", {});
  // RF-20 — missing fee agreement
  const stateNote =
    state === "CA"
      ? locale === "es"
        ? "En California, un acuerdo por escrito generalmente se exige cuando los honorarios superan $1,000."
        : "In California, a written agreement is generally required when fees exceed $1,000."
      : locale === "es"
        ? "En Texas, las reglas exigen que las cuotas no razonables puedan evaluarse frente a lo acordado."
        : "In Texas, rules require fees to be evaluated against what was agreed.";
  if (f.totalPaid > 1000 && !f.hasFeeAgreementDoc) {
    fire("RF-20", { paid: money(f.totalPaid), stateNote });
  }

  const sevRank = { high: 0, medium: 1, standard: 2 } as const;
  return out.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
}

// Rules relevant to a set of observations (for the remedy router pre-fill)
export function channelsFromObservations(obs: Observation[]): string[] {
  const set = new Set<string>();
  for (const o of obs) o.channels.forEach((c) => set.add(c));
  return [...set];
}
