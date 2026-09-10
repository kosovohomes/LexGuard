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

// ---- Client-protection fund windows (Phase-5: all five states) --------------
// "discovery" mode = a computable countdown from the logged receipt date.
// "after_discipline" mode (Texas) = no countdown until a disciplinary judgment
// is final — surfaced as informational text only.
// Facts per PRD Appendix A (TX/CA) and docs/STATE_FACTS_PHASE5.md (FL/NY/AZ).
// All wording is informational and points to the official page — LexGuard does
// not compute the user's actual legal deadlines (PRD §3 principle 5).

type FundWindow =
  | { mode: "discovery"; years: number; fund: { en: string; es: string }; cap: { en: string; es: string }; note: { en: string; es: string } }
  | { mode: "after_discipline"; fund: { en: string; es: string }; note: { en: string; es: string } };

const FUND_WINDOWS: Record<USState, FundWindow> = {
  TX: {
    mode: "after_discipline",
    fund: { en: "Texas Client Security Fund", es: "Fondo de Seguridad del Cliente de Texas" },
    note: {
      en: "requires a grievance first and an application within 18 months after the disciplinary judgment is final",
      es: "exige primero una queja disciplinaria y la solicitud dentro de los 18 meses tras la sentencia disciplinaria firme",
    },
  },
  CA: {
    mode: "discovery",
    years: 4,
    fund: { en: "California's Client Security Fund", es: "El Fondo de Seguridad del Cliente de California" },
    cap: { en: "up to $100,000 per claim", es: "hasta $100,000 por reclamo" },
    note: {
      en: "The Fund excludes malpractice and fee disputes and requires attorney-status conditions. Verify on the official page.",
      es: "El Fondo excluye mala praxis y disputas de honorarios, y exige condiciones sobre la situación del abogado. Verifique en la página oficial.",
    },
  },
  FL: {
    mode: "discovery",
    years: 2,
    fund: { en: "Florida's Clients' Security Fund", es: "El Fondo de Seguridad del Cliente de Florida" },
    cap: { en: "up to $50,000 per claim", es: "hasta $50,000 por reclamo" },
    note: {
      en: "The Fund covers a lawyer's misappropriation or wrongful taking of funds, not negligence or fee disagreements, and generally requires assignment of recovery rights if it pays. Verify on the official page.",
      es: "El Fondo cubre la apropiación indebida o toma ilegítima de fondos por el abogado, no negligencia ni desacuerdos de honorarios, y generalmente exige ceder los derechos de recuperación si paga. Verifique en la página oficial.",
    },
  },
  NY: {
    mode: "discovery",
    years: 2,
    fund: { en: "New York's Lawyers' Fund for Client Protection", es: "El Fondo de Protección del Cliente de Nueva York" },
    cap: { en: "up to $450,000 per client loss", es: "hasta $450,000 por pérdida de un cliente" },
    note: {
      en: "The Fund covers a lawyer's dishonest conduct only — it has no jurisdiction over neglect, malpractice, or fee disputes. Verify on the official page.",
      es: "El Fondo cubre solo la conducta deshonesta del abogado — no tiene jurisdicción sobre negligencia, mala praxis ni disputas de honorarios. Verifique en la página oficial.",
    },
  },
  AZ: {
    mode: "discovery",
    years: 5,
    fund: { en: "Arizona's Client Protection Fund", es: "El Fondo de Protección del Cliente de Arizona" },
    cap: { en: "up to $100,000 per claimant", es: "hasta $100,000 por reclamante" },
    note: {
      en: "The Fund covers losses from a lawyer's dishonest conduct, not negligence or fee disagreements. Verify on the official page.",
      es: "El Fondo cubre pérdidas por conducta deshonesta del abogado, no negligencia ni desacuerdos de honorarios. Verifique en la página oficial.",
    },
  },
};

// ---- Malpractice limitations information (informational only) ---------------
const MALPRACTICE_SOL: Record<USState, { years: number; text: { en: string; es: string } }> = {
  TX: {
    years: 2,
    text: {
      en: "Texas generally applies a two-year limitations period with a ten-year repose cap.",
      es: "Texas generalmente aplica un plazo de dos años con tope de diez años.",
    },
  },
  CA: {
    years: 1,
    text: {
      en: "California generally applies one year from discovery, with a four-year maximum (Code Civ. Proc. 340.6).",
      es: "California generalmente aplica un año desde el descubrimiento, con máximo de cuatro años (Cód. Proc. Civil 340.6).",
    },
  },
  FL: {
    years: 2,
    text: {
      en: "Florida generally applies two years from discovery, with a four-year outer limit (Fla. Stat. ch. 95).",
      es: "Florida generalmente aplica dos años desde el descubrimiento, con un límite exterior de cuatro años (Fla. Stat. cap. 95).",
    },
  },
  NY: {
    years: 3,
    text: {
      en: "New York generally applies three years for attorney malpractice (CPLR 214).",
      es: "Nueva York generalmente aplica tres años para la mala praxis de abogados (CPLR 214).",
    },
  },
  AZ: {
    years: 2,
    text: {
      en: "Arizona generally applies two years for attorney malpractice (A.R.S. 12-542).",
      es: "Arizona generalmente aplica dos años para la mala praxis de abogados (A.R.S. 12-542).",
    },
  },
};

/** Statutory/informational windows derived from journal facts. */
function statutoryItems(cf: { case: CaseData; entries: EntryData[] }, now: Date, locale: Locale): DeadlineInsight[] {
  const out: DeadlineInsight[] = [];
  const name = caseLabel(cf.case);
  const state = cf.case.state;
  const settlement = hasSettlementNeedingWindow(cf.entries);
  const es = locale === "es";

  if (settlement) {
    const fw = FUND_WINDOWS[state];
    if (fw.mode === "discovery") {
      const end = new Date(settlement.receivedAt.getTime() + fw.years * YEAR);
      const daysLeft = Math.round((end.getTime() - now.getTime()) / DAY);
      out.push({
        id: `win_csf_${state.toLowerCase()}_${cf.case.id}`,
        caseId: cf.case.id,
        caseName: name,
        state,
        kind: "statutory_window",
        tone: daysLeft <= 90 ? "soon" : "info",
        title: es
          ? `Posible ventana del fondo de protección del cliente (fondos de acuerdo registrados como recibidos)`
          : `Possible client protection fund window (settlement funds logged as received)`,
        detail: es
          ? `${fw.fund.es} puede reembolsar el robo de fondos en custodia (${fw.cap.es}); en general se presenta dentro de los ${fw.years} años desde que la pérdida se descubrió o debió descubrirse. Esta fecha se calcula desde su registro de recepción del acuerdo (${fmt(settlement.receivedAt, locale)}); la fecha de descubrimiento puede ser distinta. ${fw.note.es}`
          : `${fw.fund.en} can reimburse theft of entrusted funds (${fw.cap.en}); a claim is generally filed within ${fw.years} year${fw.years === 1 ? "" : "s"} after the loss was or should have been discovered. This date is computed from your settlement-receipt entry (${fmt(settlement.receivedAt, locale)}) — the discovery date may differ. ${fw.note.en}`,
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
        title: es ? `${fw.fund.es} — condiciones aplicables` : `${fw.fund.en} — applicable conditions`,
        detail: es
          ? `Registró fondos de acuerdo recibidos por el abogado sin desembolso posterior. El Fondo de Texas puede reembolsar robo de fondos o honorarios no reembolsados, pero ${fw.note.es}. Aún no existe cuenta regresiva: la ventana comienza cuando concluye la disciplina. Documentar ahora protege esa futura solicitud.`
          : `You logged settlement funds received by the attorney with no later disbursement. Texas's Client Security Fund may reimburse stolen funds or unearned fees, but it ${fw.note.en}. No countdown exists yet — the window starts when discipline concludes. Documenting now protects that future application.`,
      });
    }
  }

  const end = cf.case.engagementEnd ? new Date(cf.case.engagementEnd) : null;
  if (end && !Number.isNaN(end.getTime())) {
    const sol = MALPRACTICE_SOL[state];
    const outside = new Date(end.getTime() + sol.years * YEAR);
    out.push({
      id: `win_sol_${state.toLowerCase()}_${cf.case.id}`,
      caseId: cf.case.id,
      caseName: name,
      state,
      kind: "statutory_window",
      tone: "info",
      title: es ? "Información de prescripción (mala praxis)" : "Limitations information (malpractice)",
      detail: es
        ? `${sol.text.es} Esta fecha se calcula desde el fin de la relación registrada (${fmt(end, locale)}); el reloj puede iniciar más tarde (al descubrir el daño) y los plazos exactos dependen de sus hechos. LexGuard no evalúa reclamos; verifique con un abogado con licencia o asistencia legal.`
        : `${sol.text.en} This date is computed from the logged end of the engagement (${fmt(end, locale)}); the clock may start later (at discovery) and exact deadlines depend on your facts. LexGuard does not evaluate claims — verify with a licensed attorney or legal aid.`,
      when: outside.toISOString(),
      daysLeft: Math.round((outside.getTime() - now.getTime()) / DAY),
    });
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
