// LexGuard deterministic narrative generator — PRD Flow E §6.5 item 6
// First-person, factual, chronological draft complaint narrative generated
// purely from structured journal data (no LLM — PRD Open Question 6 resolved
// conservatively for Phase 1: fully deterministic). Fully editable by the user.

import type { CaseData, EntryData, Locale } from "./types";
import type { Observation } from "./types";
import type { CaseFacts } from "./types";
import { computeFacts } from "./engine";

const money = (n: number, locale: Locale) => `$${n.toLocaleString(locale === "es" ? "es-MX" : "en-US")}`;
const fmtDate = (d: string | Date, locale: Locale) =>
  new Date(d).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" });

export const CASE_TYPE_LABEL: Record<string, { en: string; es: string }> = {
  family: { en: "family law", es: "derecho familiar" },
  personal_injury: { en: "personal injury", es: "lesiones personales" },
  criminal: { en: "criminal defense", es: "defensa criminal" },
  immigration: { en: "immigration", es: "inmigración" },
  probate: { en: "probate", es: "sucesiones" },
  business: { en: "business", es: "negocios" },
  other: { en: "other", es: "otro" },
};

export function generateNarrative(
  caseRow: CaseData,
  entries: EntryData[],
  observations: Observation[],
  locale: Locale,
): string {
  const es = locale === "es";
  const facts: CaseFacts = computeFacts(caseRow, entries, false);
  const type = CASE_TYPE_LABEL[caseRow.caseType]?.[locale] ?? caseRow.caseType;
  const L: string[] = [];

  // Opening
  if (es) {
    L.push(
      `Yo soy (o fui) cliente de ${caseRow.attorneyName}${caseRow.firm ? `, de la firma ${caseRow.firm}` : ""}. Contraté a este abogado aproximadamente el ${caseRow.engagementStart ? fmtDate(caseRow.engagementStart, locale) : "[fecha de inicio]"} para un asunto de ${type} en el estado de ${caseRow.state}. Presento este relato para apoyar una revisión de mi situación.`,
    );
  } else {
    L.push(
      `I am (or was) a client of ${caseRow.attorneyName}${caseRow.firm ? `, of the firm ${caseRow.firm}` : ""}. I hired this attorney on or about ${caseRow.engagementStart ? fmtDate(caseRow.engagementStart, locale) : "[start date]"} for a ${type} matter in the state of ${caseRow.state}. I am submitting this account to support a review of my situation.`,
    );
  }

  // Chronology — group entries by month
  const chrono = [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  let lastMonth = "";
  for (const e of chrono) {
    const m = fmtDate(e.occurredAt, locale);
    if (m !== lastMonth) {
      L.push("");
      L.push(es ? `— ${m} —` : `— ${m} —`);
      lastMonth = m;
    }
    const d = fmtDate(e.occurredAt, locale);
    const bits: string[] = [];
    if (e.type === "communication") {
      const c = (e.data ?? {}) as Record<string, unknown>;
      const dir = c.direction === "to_attorney" ? (es ? "Contacté al abogado" : "I contacted the attorney") : es ? "Recibí comunicación del lado del abogado" : "The attorney's side contacted me";
      const via = es ? " por " : " via ";
      bits.push(`${d}: ${dir}${via}${e.title}.`);
      if (c.responseReceived === false && c.direction === "to_attorney") bits.push(es ? " No recibí respuesta registrada." : " No logged response was received.");
      if (c.respondedBy === "staff") bits.push(es ? " Respondió el personal, no el abogado." : " Staff responded, not the attorney.");
    } else if (e.type === "payment") {
      const p = (e.data ?? {}) as Record<string, unknown>;
      const kind = String(e.title);
      const amt = typeof p.amount === "number" ? money(p.amount, locale) : "";
      bits.push(`${d}: ${es ? "pago registrado" : "payment logged"} — ${kind}${amt ? ` (${amt})` : ""}.`);
      if (p.notInAgreement) bits.push(es ? " Este cargo no está en mi acuerdo de honorarios." : " This charge is not in my fee agreement.");
    } else if (e.type === "deadline") {
      const dl = (e.data ?? {}) as Record<string, unknown>;
      bits.push(`${d}: ${es ? "fecha registrada" : "deadline logged"} — ${e.title} (${dl.status === "missed" ? (es ? "vencida" : "missed") : es ? "atendida" : "handled"}).`);
      if (dl.missedAppearance) bits.push(es ? " El abogado no compareció." : " The attorney failed to appear.");
    } else if (e.type === "promise") {
      const pr = (e.data ?? {}) as Record<string, unknown>;
      bits.push(`${d}: ${es ? "promesa registrada" : "promise logged"} — ${e.title}.`);
      if (pr.fulfilled === false) bits.push(es ? " No se cumplió." : " It was not fulfilled.");
      if (pr.promisedBy) bits.push(es ? ` Prometido para ${fmtDate(String(pr.promisedBy), locale)}.` : ` Promised by ${fmtDate(String(pr.promisedBy), locale)}.`);
    } else {
      bits.push(`${d}: ${e.title}.`);
    }
    L.push(bits.join(""));
  }

  // Money trail summary
  if (facts.totalPaid > 0) {
    L.push("");
    L.push(es ? `Resumen económico: pagos registrados por un total de ${money(facts.totalPaid, locale)}.` : `Money summary: payments logged total ${money(facts.totalPaid, locale)}.`);
    if (facts.settlementReceivedAt && !facts.disbursedAt) {
      L.push(es ? `Un acuerdo fue recibido por el abogado el ${fmtDate(facts.settlementReceivedAt, locale)} y hasta la fecha de este relato no se ha registrado ningún desembolso a mi favor.` : `A settlement was received by the attorney on ${fmtDate(facts.settlementReceivedAt, locale)}, and as of this account no disbursement to me has been logged.`);
    }
    if (facts.caseEnded && (facts.retainerPaid ?? 0) > 0 && !facts.refundReceived) {
      L.push(es ? `La representación terminó y no se ha registrado reembolso de mi anticipo.` : `The representation has ended and no refund of my retainer has been logged.`);
    }
  }

  // Communication pattern
  if (facts.attemptCount >= 3) {
    L.push(es ? `Registro ${facts.attemptCount} intentos de contacto documentados con fechas.` : `I have documented ${facts.attemptCount} dated contact attempts.`);
    if (facts.unansweredDays >= 14) {
      L.push(es ? `El período sin respuesta sustantiva que consta en mi diario es de ${facts.unansweredDays} días.` : `The period without substantive response documented in my journal spans ${facts.unansweredDays} days.`);
    }
  }

  // Neutral observations section (conditional language only)
  if (observations.length > 0) {
    L.push("");
    L.push(es ? "Observaciones (hechos comparados con las reglas de conducta profesional; no son conclusiones):" : "Observations (facts compared against professional-conduct rules; these are not conclusions):");
    observations.forEach((o, i) => {
      L.push(`${i + 1}. [${o.ruleId}] ${o.citations.join("; ")}`);
    });
  }

  // Closing
  L.push("");
  L.push(
    es
      ? "Declaro que este relato refleja entradas fechadas de mi propio registro, creado mientras ocurrían los hechos. Solicito que mi situación sea revisada. Los documentos de respaldo se adjuntan o están disponibles a solicitud."
      : "I declare that this account reflects dated entries from my own journal, created as events occurred. I respectfully request that my situation be reviewed. Supporting documents are attached or available on request.",
  );

  return L.join("\n");
}
