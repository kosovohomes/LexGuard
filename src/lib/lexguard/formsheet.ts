// LexGuard complaint-form worksheet (PRD §13 Phase 4: "lawyer-complaint-template
// generation per state bar form fields"). Maps the client's own structured
// journal data onto the actual fields the state bar forms ask for — Texas
// Chief Disciplinary Counsel grievance and the State Bar of California
// attorney-complaint form. Education-first and neutral: this is a preparation
// worksheet the client reviews and transfers into the official form themselves;
// LexGuard never files anything and never contacts anyone (PRD §3.3, §6.4).

import type { CaseData, DocumentMeta, EntryData, Locale, Observation } from "./types";
import { CASE_TYPE_LABEL } from "./narrative";

export interface WorksheetField {
  label: { en: string; es: string };
  value: string; // "" = user must fill in
  multiline?: boolean;
}

export interface WorksheetSection {
  heading: { en: string; es: string };
  fields: WorksheetField[];
}

export interface Worksheet {
  formName: { en: string; es: string };
  where: { en: string; es: string };
  sections: WorksheetSection[];
  notices: { en: string[]; es: string[] };
}

const fmtDate = (d: string, locale: Locale) =>
  new Date(d).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric" });

const money = (n: number, locale: Locale) => `$${n.toLocaleString(locale === "es" ? "es-MX" : "en-US")}`;

const TYPE_LABEL_ES: Record<string, string> = {
  communication: "Comunicación",
  payment: "Pago",
  document: "Documento",
  promise: "Promesa",
  note: "Nota",
  deadline: "Fecha límite",
};

function chronology(entries: EntryData[], locale: Locale, max = 25): string {
  const es = locale === "es";
  const chrono = [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).slice(0, max);
  if (chrono.length === 0) return "";
  return chrono
    .map((e) => {
      const tl = TYPE_LABEL_ES[e.type] ?? e.type;
      const amount = e.type === "payment" ? ((e.data as { amount?: number })?.amount ?? null) : null;
      const extra = amount != null ? ` — ${money(amount, locale)}` : "";
      return `${fmtDate(e.occurredAt, locale)} · ${es ? tl : e.type.charAt(0).toUpperCase() + e.type.slice(1)} · ${e.title}${extra}${e.body ? ` — ${e.body}` : ""}`;
    })
    .join("\n");
}

function concernAreas(observations: Observation[], locale: Locale): string {
  if (observations.length === 0) return "";
  const areas = new Set<string>();
  for (const o of observations) {
    const n = Number(o.ruleId.replace("RF-", ""));
    if (n >= 1 && n <= 4) areas.add(locale === "es" ? "Fondos del cliente / cuentas de depósito" : "Client funds / trust accounting");
    else if (n >= 5 && n <= 8) areas.add(locale === "es" ? "Negligencia / abandono" : "Neglect / diligence");
    else if (n >= 9 && n <= 10) areas.add(locale === "es" ? "Falta de comunicación" : "Communication failure");
    else if (n >= 11 && n <= 13) areas.add(locale === "es" ? "Autorización del cliente / conflictos" : "Client authority / conflicts");
    else if (n >= 14 && n <= 17) areas.add(locale === "es" ? "Honorarios" : "Fees");
    else areas.add(locale === "es" ? "Otra conducta" : "Other conduct");
  }
  return [...areas].join("; ");
}

function docIndex(documents: DocumentMeta[], locale: Locale): string {
  if (documents.length === 0) return "";
  return documents.map((d) => `${d.filename} (${d.tags.join(", ")})`).join("\n");
}

export function worksheetForState(state: "TX" | "CA"): Worksheet {
  const tx = state === "TX";
  return {
    formName: {
      en: tx ? "Texas attorney grievance — field preparation worksheet" : "California State Bar attorney complaint — field preparation worksheet",
      es: tx ? "Queja contra un abogado en Texas — hoja de preparación de campos" : "Queja ante el Colegio de Abogados de California — hoja de preparación de campos",
    },
    where: tx
      ? {
          en: "File online at cdc.texasbar.com or mail to: State Bar of Texas, Chief Disciplinary Counsel's Office, P.O. Box 12487, Austin, TX 78711. Phone (866) 224-5999.",
          es: "Presente en línea en cdc.texasbar.com o envíe por correo a: State Bar of Texas, Chief Disciplinary Counsel's Office, P.O. Box 12487, Austin, TX 78711. Teléfono (866) 224-5999.",
        }
      : {
          en: "File online at calbar.ca.gov (Office of Chief Trial Counsel intake) or call 800-843-9053. The complaint form is available in English, Spanish, Vietnamese, Korean, Russian, Chinese, and Tagalog.",
          es: "Presente en línea en calbar.ca.gov (intake de la Office of Chief Trial Counsel) o llame al 800-843-9053. El formulario está disponible en inglés, español, vietnamita, coreano, ruso, chino y tagalo.",
        },
    sections: [
      {
        heading: tx ? { en: "A. About you (complainant)", es: "A. Sobre usted (querellante)" } : { en: "A. Your contact information (providing it is optional but helps the bar follow up)", es: "A. Su información de contacto (es opcional pero ayuda al colegio a darle seguimiento)" },
        fields: [
          { label: { en: "Full name", es: "Nombre completo" }, value: "" },
          { label: { en: "Phone", es: "Teléfono" }, value: "" },
          { label: { en: "Email", es: "Correo electrónico" }, value: "" },
          { label: { en: "Preferred language for communication", es: "Idioma preferido para comunicación" }, value: "" },
        ],
      },
      {
        heading: { en: "B. The attorney", es: "B. El abogado" },
        fields: [
          { label: { en: "Attorney full name", es: "Nombre completo del abogado" }, value: "" },
          { label: { en: "Law firm", es: "Firma de abogados" }, value: "" },
          { label: { en: "City / office address", es: "Ciudad / dirección de la oficina" }, value: "" },
          { label: { en: "State Bar number (if known — optional)", es: "Número de colegiado (si lo conoce — opcional)" }, value: "" },
        ],
      },
      {
        heading: { en: "C. The representation", es: "C. La representación" },
        fields: [
          { label: { en: "What kind of legal matter", es: "Tipo de asunto legal" }, value: "" },
          { label: { en: "Representation began (date)", es: "Inicio de la representación (fecha)" }, value: "" },
          { label: { en: "Representation ended (date, if it ended)", es: "Fin de la representación (fecha, si terminó)" }, value: "" },
          { label: { en: "Was there a written fee agreement?", es: "¿Hubo un acuerdo de honorarios por escrito?" }, value: "" },
          { label: { en: "Total amount you paid this attorney", es: "Total pagado a este abogado" }, value: "" },
        ],
      },
      {
        heading: { en: "D. What happened (chronological, with dates)", es: "D. Qué pasó (cronológico, con fechas)" },
        fields: [
          {
            label: { en: "Describe the facts in order — the bar needs dates and specifics", es: "Describa los hechos en orden — el colegio necesita fechas y detalles" },
            value: "",
            multiline: true,
          },
          { label: { en: "Areas of concern reflected in your journal", es: "Áreas de preocupación reflejadas en su diario" }, value: "", multiline: true },
        ],
      },
      {
        heading: { en: "E. Witnesses and others with knowledge", es: "E. Testigos y otras personas con conocimiento" },
        fields: [{ label: { en: "Names and contact info (one per line, or leave blank)", es: "Nombres y datos de contacto (uno por línea, o deje en blanco)" }, value: "", multiline: true }],
      },
      {
        heading: { en: "F. Supporting documents you will attach (copies only)", es: "F. Documentos de apoyo que adjuntará (solo copias)" },
        fields: [{ label: { en: "Document list", es: "Lista de documentos" }, value: "", multiline: true }],
      },
      {
        heading: { en: "G. What outcome are you asking about", es: "G. Qué resultado solicita" },
        fields: [
          {
            label: {
              en: tx
                ? "What do you want the State Bar to look into? (Discipline can sanction the lawyer; it cannot order money back — for stolen or unearned funds see the Client Security Fund)"
                : "What do you want the State Bar to look into? (Discipline can sanction the lawyer; it cannot order money back — for stolen or unearned funds see the Client Security Fund)",
              es: "¿Qué quiere que el Colegio investigue? (La disciplina puede sancionar al abogado; no puede ordenar la devolución del dinero — para fondos robados o no devueltos vea el Fondo de Seguridad del Cliente)",
            },
            value: "",
            multiline: true,
          },
        ],
      },
    ],
    notices: tx
      ? {
          en: [
            "Signing the grievance form waives attorney-client privilege for the subject matter of the complaint — the bar and the lawyer will both see what you disclose about that subject.",
            "Send copies only — never originals, never staples.",
            "This worksheet was generated from your own journal. Review every field and edit freely before transferring it to the official form. LexGuard does not file complaints.",
            "The bar cannot give you legal advice. Free/low-cost help: TexasLawHelp.org, local legal aid, or the State Bar's Lawyer Referral & Information Service.",
          ],
          es: [
            "Firmar el formulario de queja renuncia a la confidencialidad abogado-cliente sobre el tema de la queja — el colegio y el abogado verán lo que usted divulgue sobre ese tema.",
            "Envíe solo copias — nunca originales, nunca grapas.",
            "Esta hoja se generó a partir de su propio diario. Revise cada campo y edítelo libremente antes de pasarlo al formulario oficial. LexGuard no presenta quejas.",
            "El colegio no puede darle asesoría legal. Ayuda gratuita o de bajo costo: TexasLawHelp.org, asistencia legal local o el Lawyer Referral & Information Service del colegio.",
          ],
        }
      : {
          en: [
            "You may file a complaint without giving your name, but providing contact information lets the bar ask you follow-up questions.",
            "Discipline cannot order the lawyer to return money — for stolen funds or unearned fees, see the Client Security Fund (4-year window from discovery).",
            "This worksheet was generated from your own journal. Review every field and edit freely before transferring it to the official form. LexGuard does not file complaints.",
            "The bar cannot give you legal advice. Free/low-cost help: local legal aid, law school clinics, or the State Bar's Lawyer Referral Service Directory.",
          ],
          es: [
            "Puede presentar una queja sin dar su nombre, pero dar datos de contacto permite al colegio hacerle preguntas de seguimiento.",
            "La disciplina no puede ordenar al abogado devolver dinero — para fondos robados u honorarios no devueltos, vea el Fondo de Seguridad del Cliente (ventana de 4 años desde el descubrimiento).",
            "Esta hoja se generó a partir de su propio diario. Revise cada campo y edítelo libremente antes de pasarlo al formulario oficial. LexGuard no presenta quejas.",
            "El colegio no puede darle asesoría legal. Ayuda gratuita o de bajo costo: asistencia legal local, clínicas legales universitarias o el directorio de referidos del Colegio de Abogados.",
          ],
        },
  };
}

// Autofill the client's own structured data into the worksheet. Fields the bar
// form asks but the journal cannot know stay blank for the user to fill.
export function buildWorksheet(
  caseRow: CaseData,
  entries: EntryData[],
  documents: DocumentMeta[],
  observations: Observation[],
  locale: Locale,
): Worksheet {
  const ws = worksheetForState(caseRow.state === "CA" ? "CA" : "TX");
  const es = locale === "es";
  const typeLabel = CASE_TYPE_LABEL[caseRow.caseType]?.[locale] ?? caseRow.caseType;
  const totalPaid = entries.filter((e) => e.type === "payment").reduce((s, e) => s + (((e.data as { amount?: number }).amount ?? 0) as number), 0);
  const hasAgreement = documents.some((d) => d.tags.includes("fee_agreement"));

  const set = (section: number, field: number, value: string) => {
    if (ws.sections[section]?.fields[field]) ws.sections[section].fields[field].value = value;
  };

  // B. attorney — prefilled from what the client recorded in their own case
  // (private; a bar complaint is not public). Bar numbers can be looked up on
  // the state bar's public attorney search before filing.
  set(1, 0, caseRow.attorneyName);
  set(1, 1, caseRow.firm ?? "");
  set(
    1,
    3,
    caseRow.state === "CA"
      ? es
        ? "Búscalo en el directorio público de abogados de calbar.ca.gov"
        : "Look it up in the public attorney search at calbar.ca.gov"
      : es
        ? "Búscalo en la búsqueda pública de abogados de texasbar.com"
        : "Look it up in the public attorney search at texasbar.com",
  );
  // C. representation facts — derived from the case record
  set(2, 0, typeLabel);
  set(2, 1, caseRow.engagementStart ? fmtDate(caseRow.engagementStart, locale) : "");
  set(2, 2, caseRow.engagementEnd ? fmtDate(caseRow.engagementEnd, locale) : "");
  set(2, 3, hasAgreement ? (es ? "Sí — hay un documento etiquetado como acuerdo de honorarios" : "Yes — a document tagged fee agreement is in the vault") : es ? "No está registrado" : "Not recorded");
  set(2, 4, money(totalPaid, locale));
  // D. chronology from the journal + neutral observation areas
  set(3, 0, chronology(entries, locale));
  set(3, 1, concernAreas(observations, locale));
  // F. document index
  set(5, 0, docIndex(documents, locale));

  return ws;
}

export function worksheetText(ws: Worksheet, locale: Locale): string {
  const es = locale === "es";
  const lines: string[] = [];
  lines.push(ws.formName[locale]);
  lines.push(`${es ? "Dónde presentar" : "Where to file"}: ${ws.where[locale]}`);
  lines.push("");
  for (const s of ws.sections) {
    lines.push(`== ${s.heading[locale]} ==`);
    for (const f of s.fields) {
      lines.push(`${f.label[locale]}:`);
      lines.push(f.value || (es ? "(completar)" : "(fill in)"));
      lines.push("");
    }
  }
  lines.push(es ? "Notas importantes:" : "Important notes:");
  for (const n of ws.notices[locale]) lines.push(`- ${n}`);
  return lines.join("\n");
}
