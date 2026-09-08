// LexGuard deadline intelligence — PRD roadmap item ("rules like 'CA CSF 4-year
// window' auto-flagged when dates logged") pulled forward into the Phase-2 build.
//
// Deterministic and informational only: every item uses neutral wording, states
// what it is derived from, and directs the user to official sources. LexGuard
// does not compute the user's actual legal deadlines (PRD §3 principle 5).

import type { CaseData, EntryData, Locale, USState } from "./types";

export interface DeadlineInsight {
  id: string;
  caseId: string;
  caseName: string;
  state: USState;
  kind: "user_deadline" | "statutory_window";
  tone: "overdue" | "soon" | "info";
  title: string;
  detail: string;
  when?: string; // ISO date of the deadline / computed window end (when derivable)
  daysLeft?: number; // negative = overdue
}

const DAY = 86400000;
const YEAR = 365 * DAY;

function fmt(d: Date, locale: Locale): string {
  return d.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" });
}

function caseLabel(c: CaseData): string {
  const type = c.caseType.replace(/_/g, " ");
  return c.attorneyName ? `${c.attorneyName} (${type})` : type;
}

/** Deadline-entry items the user logged themselves (FR-2.5 auto-reminders). */
function userDeadlineItems(cf: { case: CaseData; entries: EntryData[] }, now: Date, locale: Locale): DeadlineInsight[] {
  const out: DeadlineInsight[] = [];
  const name = caseLabel(cf.case);
  for (const e of cf.entries) {
    if (e.type !== "deadline") continue;
    const data = (e.data ?? {}) as { status?: string; kind?: string };
    if (data.status && data.status !== "upcoming") continue; // met/missed already resolved by the user
    const when = new Date(e.occurredAt);
    if (Number.isNaN(when.getTime())) continue;
    const diffDays = Math.round((when.getTime() - now.getTime()) / DAY);
    const kindWord =
      data.kind === "court"
        ? locale === "es" ? "fecha judicial" : "court date"
        : data.kind === "filing"
          ? locale === "es" ? "fecha de presentación" : "filing deadline"
          : data.kind === "follow_up"
            ? locale === "es" ? "seguimiento" : "follow-up"
            : locale === "es" ? "fecha" : "deadline";
    const whenTxt = fmt(when, locale);
    const rel =
      diffDays < 0
        ? locale === "es" ? `vencida hace ${Math.abs(diffDays)} día(s)` : `${Math.abs(diffDays)} day(s) overdue`
        : diffDays === 0
          ? locale === "es" ? "vence hoy" : "due today"
          : locale === "es" ? `en ${diffDays} día(s)` : `in ${diffDays} day(s)`;
    const statusNote =
      locale === "es"
        ? "Sigue marcada como pendiente en su diario. Actualícela a cumplida o incumplida cuando la resuelva."
        : "It is still marked upcoming in your journal. Update it to met or missed once resolved.";
    out.push({
      id: `dl_${e.id}`,
      caseId: cf.case.id,
      caseName: name,
      state: cf.case.state,
      kind: "user_deadline",
      tone: diffDays < 0 ? "overdue" : diffDays <= 30 ? "soon" : "info",
      title: e.title,
      detail: `${kindWord.charAt(0).toUpperCase() + kindWord.slice(1)} — ${whenTxt} (${rel}). ${statusNote}`,
      when: e.occurredAt,
      daysLeft: diffDays,
    });
  }
  return out;
}

function hasSettlementNeedingWindow(entries: EntryData[]): { receivedAt: Date } | null {
  let received: Date | null = null;
  for (const e of entries) {
    if (e.type !== "payment") continue;
    const d = (e.data ?? {}) as { kind?: string };
    if (d.kind === "settlement_received") {
      const at = new Date(e.occurredAt);
      if (!received || at > received) received = at; // most recent receipt
    }
    if (d.kind === "disbursement" || d.kind === "contingency_payout") {
      const at = new Date(e.occurredAt);
      if (!received || at > received) return null; // funds moved after receipt — window not triggered
    }
  }
  return received ? { receivedAt: received } : null;
}

/** Statutory/informational windows derived from journal facts. */
function statutoryItems(cf: { case: CaseData; entries: EntryData[] }, now: Date, locale: Locale): DeadlineInsight[] {
  const out: DeadlineInsight[] = [];
  const name = caseLabel(cf.case);
  const state = cf.case.state;
  const settlement = hasSettlementNeedingWindow(cf.entries);

  if (settlement) {
    if (state === "CA") {
      const end = new Date(settlement.receivedAt.getTime() + 4 * YEAR);
      const daysLeft = Math.round((end.getTime() - now.getTime()) / DAY);
      out.push({
        id: `win_csf_ca_${cf.case.id}`,
        caseId: cf.case.id,
        caseName: name,
        state,
        kind: "statutory_window",
        tone: daysLeft <= 90 ? "soon" : "info",
        title:
          locale === "es"
            ? "Posible ventana del Fondo de Seguridad del Cliente (fondos de acuerdo registrados como recibidos)"
            : "Possible Client Security Fund window (settlement funds logged as received)",
        detail:
          locale === "es"
            ? `El Fondo de Seguridad del Cliente de California puede reembolsar el robo de fondos en custodia (hasta $100,000 por reclamo); en general se presenta dentro de los 4 años desde que la pérdida se descubrió o debió descubrirse. Esta fecha se calcula desde su registro de recepción del acuerdo (${fmt(settlement.receivedAt, locale)}); la fecha de descubrimiento puede ser distinta. El Fondo excluye mala praxis y disputas de honorarios, y exige condiciones sobre la situación del abogado. Verifique en la página oficial.`
            : `California's Client Security Fund can reimburse theft of entrusted funds (up to $100,000 per claim); a claim is generally filed within 4 years after the loss was or should have been discovered. This date is computed from your settlement-receipt entry (${fmt(settlement.receivedAt, locale)}) — the discovery date may differ. The Fund excludes malpractice and fee disputes and requires attorney-status conditions. Verify on the official page.`,
        when: end.toISOString(),
        daysLeft,
      });
    } else {
      out.push({
        id: `win_csf_tx_${cf.case.id}`,
        caseId: cf.case.id,
        caseName: name,
        state,
        kind: "statutory_window",
        tone: "info",
        title:
          locale === "es"
            ? "Fondo de Seguridad del Cliente de Texas — condiciones aplicables"
            : "Texas Client Security Fund — applicable conditions",
        detail:
          locale === "es"
            ? `Registró fondos de acuerdo recibidos por el abogado sin desembolso posterior. El Fondo de Texas puede reembolsar robo de fondos o honorarios no reembolsados, pero exige primero una queja disciplinaria y la solicitud dentro de los 18 meses tras la sentencia disciplinaria firme. Aún no existe cuenta regresiva: la ventana comienza cuando concluye la disciplina. Documentar ahora protege esa futura solicitud.`
            : `You logged settlement funds received by the attorney with no later disbursement. Texas's Client Security Fund may reimburse stolen funds or unearned fees, but it requires a grievance first and an application within 18 months after the disciplinary judgment is final. No countdown exists yet — the window starts when discipline concludes. Documenting now protects that future application.`,
      });
    }
  }

  const end = cf.case.engagementEnd ? new Date(cf.case.engagementEnd) : null;
  if (end && !Number.isNaN(end.getTime())) {
    if (state === "TX") {
      const outside = new Date(end.getTime() + 2 * YEAR);
      out.push({
        id: `win_sol_tx_${cf.case.id}`,
        caseId: cf.case.id,
        caseName: name,
        state,
        kind: "statutory_window",
        tone: "info",
        title: locale === "es" ? "Información de prescripción (mala praxis)" : "Limitations information (malpractice)",
        detail:
          locale === "es"
            ? `Texas generalmente aplica un plazo de dos años con tope de diez años. Esta fecha se calcula desde el fin de la relación registrada (${fmt(end, locale)}); el reloj puede iniciar más tarde (al descubrir el daño) y los plazos exactos dependen de sus hechos. LexGuard no evalúa reclamos; verifique con un abogado con licencia o asistencia legal.`
            : `Texas generally applies a two-year limitations period with a ten-year repose cap. This date is computed from the logged end of the engagement (${fmt(end, locale)}); the clock may start later (at discovery) and exact deadlines depend on your facts. LexGuard does not evaluate claims — verify with a licensed attorney or legal aid.`,
        when: outside.toISOString(),
        daysLeft: Math.round((outside.getTime() - now.getTime()) / DAY),
      });
    } else {
      const outside = new Date(end.getTime() + YEAR);
      out.push({
        id: `win_sol_ca_${cf.case.id}`,
        caseId: cf.case.id,
        caseName: name,
        state,
        kind: "statutory_window",
        tone: "info",
        title: locale === "es" ? "Información de prescripción (mala praxis)" : "Limitations information (malpractice)",
        detail:
          locale === "es"
            ? `California generalmente aplica un año desde el descubrimiento, con máximo de cuatro años (Cód. Proc. Civil 340.6). Esta fecha se calcula desde el fin de la relación registrada (${fmt(end, locale)}); el descubrimiento puede ser posterior y los plazos exactos dependen de sus hechos. LexGuard no evalúa reclamos; verifique con un abogado con licencia o asistencia legal.`
            : `California generally applies one year from discovery, with a four-year maximum (Code Civ. Proc. 340.6). This date is computed from the logged end of the engagement (${fmt(end, locale)}); discovery may occur later and exact deadlines depend on your facts. LexGuard does not evaluate claims — verify with a licensed attorney or legal aid.`,
        when: outside.toISOString(),
        daysLeft: Math.round((outside.getTime() - now.getTime()) / DAY),
      });
    }
  }

  return out;
}

const TONE_ORDER: Record<DeadlineInsight["tone"], number> = { overdue: 0, soon: 1, info: 2 };

/** Compute all insights for a set of loaded cases, sorted: overdue → soon → info. */
export function computeDeadlines(
  cases: { case: CaseData; entries: EntryData[] }[],
  now: Date,
  locale: Locale,
): DeadlineInsight[] {
  const out: DeadlineInsight[] = [];
  for (const cf of cases) {
    out.push(...userDeadlineItems(cf, now, locale));
    out.push(...statutoryItems(cf, now, locale));
  }
  return out.sort((a, b) => {
    const t = TONE_ORDER[a.tone] - TONE_ORDER[b.tone];
    if (t !== 0) return t;
    const ad = a.daysLeft ?? Number.MAX_SAFE_INTEGER;
    const bd = b.daysLeft ?? Number.MAX_SAFE_INTEGER;
    if (ad !== bd) return ad - bd;
    return a.caseName.localeCompare(b.caseName);
  });
}
