// LexGuard complaint-form worksheet (PRD §13 Phase 4: "lawyer-complaint-template
// generation per state bar form fields"). Maps the client's own structured
// journal data onto the actual fields the state bar forms ask for — Texas
// Chief Disciplinary Counsel grievance and the State Bar of California
// attorney-complaint form. Education-first and neutral: this is a preparation
// worksheet the client reviews and transfers into the official form themselves;
// LexGuard never files anything and never contacts anyone (PRD §3.3, §6.4).

import type { CaseData, DocumentMeta, EntryData, Locale, Observation, USState } from "./types";
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

// ---- Per-state form configuration (Phase-5: FL/NY/AZ added) -----------------
// TX/CA wording is unchanged from the Phase-4 build; the new states follow the
// same education-first structure with facts verified on 2026-09-10.

interface StateForm {
  formName: { en: string; es: string };
  where: { en: string; es: string };
  lookup: { en: string; es: string };
  fundRef: { en: string; es: string };
  contactHeading: { en: string; es: string };
  notices: { en: string[]; es: string[] };
}

const STATE_FORMS: Record<USState, StateForm> = {
  TX: {
    formName: {
      en: "Texas attorney grievance — field preparation worksheet",
      es: "Queja contra un abogado en Texas — hoja de preparación de campos",
    },
    where: {
      en: "File online at cdc.texasbar.com or mail to: State Bar of Texas, Chief Disciplinary Counsel's Office, P.O. Box 12487, Austin, TX 78711. Phone (866) 224-5999.",
      es: "Presente en línea en cdc.texasbar.com o envíe por correo a: State Bar of Texas, Chief Disciplinary Counsel's Office, P.O. Box 12487, Austin, TX 78711. Teléfono (866) 224-5999.",
    },
    lookup: {
      en: "Look it up in the public attorney search at texasbar.com",
      es: "Búscalo en la búsqueda pública de abogados de texasbar.com",
    },
    fundRef: {
      en: "for stolen or unearned funds see the Client Security Fund",
      es: "para fondos robados o no devueltos vea el Fondo de Seguridad del Cliente",
    },
    contactHeading: { en: "A. About you (complainant)", es: "A. Sobre usted (querellante)" },
    notices: {
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
    },
  },
  CA: {
    formName: {
      en: "California State Bar attorney complaint — field preparation worksheet",
      es: "Queja ante el Colegio de Abogados de California — hoja de preparación de campos",
    },
    where: {
      en: "File online at calbar.ca.gov (Office of Chief Trial Counsel intake) or call 800-843-9053. The complaint form is available in English, Spanish, Vietnamese, Korean, Russian, Chinese, and Tagalog.",
      es: "Presente en línea en calbar.ca.gov (intake de la Office of Chief Trial Counsel) o llame al 800-843-9053. El formulario está disponible en inglés, español, vietnamita, coreano, ruso, chino y tagalo.",
    },
    lookup: {
      en: "Look it up in the public attorney search at calbar.ca.gov",
      es: "Búscalo en el directorio público de abogados de calbar.ca.gov",
    },
    fundRef: {
      en: "for stolen or unearned funds see the Client Security Fund",
      es: "para fondos robados o no devueltos vea el Fondo de Seguridad del Cliente",
    },
    contactHeading: {
      en: "A. Your contact information (providing it is optional but helps the bar follow up)",
      es: "A. Su información de contacto (es opcional pero ayuda al colegio a darle seguimiento)",
    },
    notices: {
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
  },
  FL: {
    formName: {
      en: "The Florida Bar attorney complaint — field preparation worksheet",
      es: "Queja ante The Florida Bar — hoja de preparación de campos",
    },
    where: {
      en: "Start with the Attorney Consumer Assistance Program (ACAP): toll-free 1-866-352-0707, or submit the Inquiry/Complaint form via floridabar.org. ACAP is the central intake for complaints against all Florida lawyers.",
      es: "Comience con el Programa de Asistencia al Consumidor (ACAP): gratis al 1-866-352-0707, o presente el formulario de consulta/queja en floridabar.org. ACAP es la recepción central de quejas contra todos los abogados de Florida.",
    },
    lookup: {
      en: "Look it up in the public attorney search at floridabar.org",
      es: "Búscalo en el directorio público de abogados de floridabar.org",
    },
    fundRef: {
      en: "for stolen or unearned funds see the Clients' Security Fund (2-year window from discovery)",
      es: "para fondos robados o no devueltos vea el Fondo de Seguridad del Cliente (ventana de 2 años desde el descubrimiento)",
    },
    contactHeading: {
      en: "A. Your contact information (providing it helps ACAP follow up)",
      es: "A. Su información de contacto (darla ayuda a ACAP a darle seguimiento)",
    },
    notices: {
      en: [
        "ACAP reviews every complaint first; matters that may involve a rule violation move to Disciplinary Counsel.",
        "Discipline cannot order the lawyer to return money — for stolen funds, see the Clients' Security Fund (2-year window from discovery).",
        "This worksheet was generated from your own journal. Review every field and edit freely before transferring it to the official form. LexGuard does not file complaints.",
        "The bar cannot give you legal advice. Free/low-cost help: FloridaLawHelp.org, local legal aid, or the Florida Bar's Lawyer Referral Service.",
      ],
      es: [
        "ACAP revisa primero toda queja; los asuntos que puedan implicar violación de reglas pasan a los abogados disciplinarios.",
        "La disciplina no puede ordenar al abogado devolver dinero — para fondos robados, vea el Fondo de Seguridad del Cliente (ventana de 2 años desde el descubrimiento).",
        "Esta hoja se generó a partir de su propio diario. Revise cada campo y edítelo libremente antes de pasarlo al formulario oficial. LexGuard no presenta quejas.",
        "El colegio no puede darle asesoría legal. Ayuda gratuita o de bajo costo: FloridaLawHelp.org, asistencia legal local o el servicio de referidos de The Florida Bar.",
      ],
    },
  },
  NY: {
    formName: {
      en: "New York attorney grievance — field preparation worksheet",
      es: "Queja contra un abogado en Nueva York — hoja de preparación de campos",
    },
    where: {
      en: "File with the Attorney Grievance Committee for the Appellate Division department where the lawyer's office is located — forms and committee addresses at nycourts.gov/attorney-grievance-committees.",
      es: "Presente ante el Comité de Agravios del departamento de la Appellate Division donde está la oficina del abogado — formularios y direcciones en nycourts.gov/attorney-grievance-committees.",
    },
    lookup: {
      en: "Look it up in the unified court system's attorney search",
      es: "Búscalo en la búsqueda de abogados del sistema unificado de tribunales",
    },
    fundRef: {
      en: "for stolen funds see the Lawyers' Fund for Client Protection (2-year window from the loss or discovery)",
      es: "para fondos robados vea el Fondo de Protección del Cliente (ventana de 2 años desde la pérdida o su descubrimiento)",
    },
    contactHeading: {
      en: "A. Your contact information (providing it helps the committee follow up)",
      es: "A. Su información de contacto (darla ayuda al comité a darle seguimiento)",
    },
    notices: {
      en: [
        "File in the judicial department where the lawyer's office is located — the committee directory shows which office covers your county.",
        "Discipline cannot order the lawyer to return money — for stolen funds, see the Lawyers' Fund for Client Protection (2-year window).",
        "This worksheet was generated from your own journal. Review every field and edit freely before transferring it to the official form. LexGuard does not file complaints.",
        "The committee cannot give you legal advice. Free/low-cost help: LawHelpNY.org, local legal aid, or a bar association referral service.",
      ],
      es: [
        "Presente en el departamento judicial donde está la oficina del abogado — el directorio de comités muestra qué oficina cubre su condado.",
        "La disciplina no puede ordenar al abogado devolver dinero — para fondos robados, vea el Fondo de Protección del Cliente (ventana de 2 años).",
        "Esta hoja se generó a partir de su propio diario. Revise cada campo y edítelo libremente antes de pasarlo al formulario oficial. LexGuard no presenta quejas.",
        "El comité no puede darle asesoría legal. Ayuda gratuita o de bajo costo: LawHelpNY.org, asistencia legal local o un servicio de referidos de colegios de abogados.",
      ],
    },
  },
  AZ: {
    formName: {
      en: "State Bar of Arizona charge of misconduct — field preparation worksheet",
      es: "Carga de mala conducta ante el State Bar of Arizona — hoja de preparación de campos",
    },
    where: {
      en: "Call the Attorney/Consumer Assistance Program (ACAP) at 602-340-7280 first, then submit the online charge of misconduct (tools.azbar.org) or a written complaint to the Lawyer Regulation Office.",
      es: "Llame primero al Programa de Asistencia al Consumidor (ACAP) al 602-340-7280, luego presente la carga de mala conducta en línea (tools.azbar.org) o una queja escrita a la Oficina de Regulación de Abogados.",
    },
    lookup: {
      en: "Look it up in the public attorney search at azbar.org",
      es: "Búscalo en la búsqueda pública de abogados de azbar.org",
    },
    fundRef: {
      en: "for stolen or unearned funds see the Client Protection Fund (5-year window from discovery)",
      es: "para fondos robados o no devueltos vea el Fondo de Protección del Cliente (ventana de 5 años desde el descubrimiento)",
    },
    contactHeading: {
      en: "A. Your contact information (providing it helps the bar follow up)",
      es: "A. Su información de contacto (darla ayuda al colegio a darle seguimiento)",
    },
    notices: {
      en: [
        "Calling ACAP before filing is encouraged — staff can explain the process and whether your concern is a discipline matter.",
        "Discipline cannot order the lawyer to return money — for stolen funds, see the Client Protection Fund (5-year window from discovery).",
        "This worksheet was generated from your own journal. Review every field and edit freely before transferring it to the official form. LexGuard does not file complaints.",
        "The bar cannot give you legal advice. Free/low-cost help: AZLawHelp.org, Community Legal Services, or the State Bar's lawyer referral service.",
      ],
      es: [
        "Se recomienda llamar a ACAP antes de presentar — el personal puede explicar el proceso y si su preocupación es un asunto disciplinario.",
        "La disciplina no puede ordenar al abogado devolver dinero — para fondos robados, vea el Fondo de Protección del Cliente (ventana de 5 años desde el descubrimiento).",
        "Esta hoja se generó a partir de su propio diario. Revise cada campo y edítelo libremente antes de pasarlo al formulario oficial. LexGuard no presenta quejas.",
        "El colegio no puede darle asesoría legal. Ayuda gratuita o de bajo costo: AZLawHelp.org, Community Legal Services o el servicio de referidos del colegio.",
      ],
    },
  },
};

export function worksheetForState(state: USState): Worksheet {
  const f = STATE_FORMS[state];
  return {
    formName: f.formName,
    where: f.where,
    sections: [
      {
        heading: f.contactHeading,
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
              en: `What do you want the bar to look into? (Discipline can sanction the lawyer; it cannot order money back — ${f.fundRef.en})`,
              es: `¿Qué quiere que el colegio investigue? (La disciplina puede sancionar al abogado; no puede ordenar la devolución del dinero — ${f.fundRef.es})`,
            },
            value: "",
            multiline: true,
          },
        ],
      },
    ],
    notices: f.notices,
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
  const ws = worksheetForState(caseRow.state);
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
    STATE_FORMS[caseRow.state].lookup[es ? "es" : "en"],
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
