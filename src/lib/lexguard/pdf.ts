// LexGuard Dossier PDF builder — PRD Flow E / FR-5 (client-side, < 30s target)
// Sections: cover → timeline → money trail → communications summary →
// red-flag observations → document index → editable draft narrative.
// "Unbranded export" toggles LexGuard branding off (FR-5.3).

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CaseData, DocumentMeta, EntryData, Locale, Observation } from "./types";
import { RULE_LIBRARY_VERSION } from "./rules";
import { CASE_TYPE_LABEL } from "./narrative";
import { buildWorksheet, worksheetForState } from "./formsheet";

const fmtDate = (d: string | Date, locale: Locale) =>
  new Date(d).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric" });
const money = (n: number, locale: Locale) => `$${n.toLocaleString(locale === "es" ? "es-MX" : "en-US")}`;

export interface DossierOptions {
  includeDocs: boolean;
  unbranded: boolean;
  includeWorksheet: boolean;
}

export function buildDossierPdf(
  caseRow: CaseData,
  entries: EntryData[],
  documents: DocumentMeta[],
  observations: Observation[],
  narrative: string,
  locale: Locale,
  opts: DossierOptions,
): jsPDF {
  const es = locale === "es";
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 54; // margins
  let y = M;

  const footer = () => {
    if (opts.unbranded) return;
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        es
          ? `Generado con LexGuard · Motor de reglas v${RULE_LIBRARY_VERSION} · ${new Date().toLocaleDateString("es-MX")}`
          : `Generated with LexGuard · Rule engine v${RULE_LIBRARY_VERSION} · ${new Date().toLocaleDateString("en-US")}`,
        M,
        H - 24,
      );
      doc.text(`${es ? "Página" : "Page"} ${i}/${pages}`, W - M, H - 24, { align: "right" });
    }
  };

  const ensure = (need: number) => {
    if (y + need > H - 60) {
      doc.addPage();
      y = M;
    }
  };

  const heading = (txt: string) => {
    ensure(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20);
    doc.text(txt, M, y);
    y += 8;
    doc.setDrawColor(60);
    doc.line(M, y, W - M, y);
    y += 14;
  };

  const para = (txt: string, size = 10, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(30);
    const lines = doc.splitTextToSize(txt, W - M * 2 - indent) as string[];
    for (const line of lines) {
      ensure(16);
      doc.text(line, M + indent, y);
      y += size + 3.5;
    }
  };

  // ---- Cover (PRD 6.5: case summary + parties; user name withheld by default) ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text(es ? "EXPEDIENTE DE CASO" : "CASE DOSSIER", M, y);
  y += 14;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90);
  doc.text(
    es
      ? "Registro cronológico compilado por el cliente a partir de su propio diario documentado."
      : "A chronological record compiled by the client from their own documented journal.",
    M,
    y,
  );
  y += 28;

  heading(es ? "Resumen del caso" : "Case summary");
  const type = CASE_TYPE_LABEL[caseRow.caseType]?.[locale] ?? caseRow.caseType;
  para(`${es ? "Estado jurisdiccional" : "Jurisdiction"}: ${caseRow.state}`);
  para(`${es ? "Tipo de asunto" : "Matter type"}: ${type}`);
  if (caseRow.engagementStart) para(`${es ? "Inicio de la relación" : "Engagement start"}: ${fmtDate(caseRow.engagementStart, locale)}`);
  if (caseRow.engagementEnd) para(`${es ? "Fin de la relación" : "Engagement end"}: ${fmtDate(caseRow.engagementEnd, locale)}`);
  para(`${es ? "Entradas registradas" : "Journal entries"}: ${entries.length}`);
  y += 10;

  heading(es ? "Partes" : "Parties");
  para(`${es ? "Abogado (según registro del cliente)" : "Attorney (as recorded by the client)"}: ${caseRow.attorneyName}`);
  if (caseRow.firm) para(`${es ? "Firma" : "Firm"}: ${caseRow.firm}`);
  para(es ? "Cliente: [nombre omitido a elección del cliente]" : "Client: [name withheld at client's option]");
  y += 10;

  para(
    es
      ? "Nota: este documento organiza hechos registrados por el cliente con marcas de tiempo; no constituye evidencia per se ni conclusiones legales."
      : "Note: this document organizes timestamped facts recorded by the client; it is not itself evidence and contains no legal conclusions.",
    9,
  );
  doc.addPage();
  y = M;

  // ---- 1. Timeline ----
  heading(es ? "1. Cronología" : "1. Chronological timeline");
  const chrono = [...entries].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  autoTable(doc, {
    startY: y,
    head: [[es ? "Fecha" : "Date", es ? "Tipo" : "Type", es ? "Entrada" : "Entry", es ? "Detalle" : "Detail"]],
    body: chrono.map((e) => {
      const typeLabel: Record<string, string> = es
        ? { communication: "Comunicación", payment: "Pago", document: "Documento", promise: "Promesa", note: "Nota", deadline: "Fecha" }
        : { communication: "Communication", payment: "Payment", document: "Document", promise: "Promise", note: "Note", deadline: "Deadline" };
      const extra = e.type === "payment" && (e.data as { amount?: number })?.amount != null ? ` — ${money((e.data as { amount: number }).amount, locale)}` : "";
      return [fmtDate(e.occurredAt, locale), typeLabel[e.type] ?? e.type, e.title + extra, (e.body ?? "").slice(0, 120)];
    }),
    margin: { left: M, right: M },
    styles: { fontSize: 8.5, cellPadding: 4 },
    headStyles: { fillColor: [50, 50, 50] },
    columnStyles: { 0: { cellWidth: 62 }, 1: { cellWidth: 72 } },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  // ---- 2. Money trail ----
  const payments = chrono.filter((e) => e.type === "payment");
  heading(es ? "2. Rastro de dinero" : "2. Money trail");
  autoTable(doc, {
    startY: y,
    head: [[es ? "Fecha" : "Date", es ? "Concepto" : "Item", es ? "Monto" : "Amount", es ? "Método" : "Method", es ? "Recibo" : "Receipt"]],
    body: payments.map((e) => {
      const p = (e.data ?? {}) as { amount?: number; method?: string; receipt?: boolean; notInAgreement?: boolean };
      return [
        fmtDate(e.occurredAt, locale),
        e.title + (p.notInAgreement ? (es ? " (no está en el acuerdo)" : " (not in agreement)") : ""),
        p.amount != null ? money(p.amount, locale) : "",
        p.method ?? "",
        p.receipt ? (es ? "Sí" : "Yes") : es ? "No" : "No",
      ];
    }),
    margin: { left: M, right: M },
    styles: { fontSize: 8.5, cellPadding: 4 },
    headStyles: { fillColor: [50, 50, 50] },
  });
  const total = payments.reduce((s, e) => s + (((e.data as { amount?: number }).amount ?? 0) as number), 0);
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  para(es ? `Total registrado: ${money(total, locale)}` : `Total logged: ${money(total, locale)}`, 10);
  y += 12;

  // ---- 3. Communications summary ----
  const comms = chrono.filter((e) => e.type === "communication");
  const attempts = comms.filter((e) => (e.data as { direction?: string })?.direction === "to_attorney");
  heading(es ? "3. Resumen de comunicaciones" : "3. Communications summary");
  para(es ? `Intentos de contacto registrados: ${attempts.length}` : `Contact attempts logged: ${attempts.length}`);
  const lastRes = comms.filter((e) => (e.data as { direction?: string })?.direction === "from_attorney").at(-1);
  para(lastRes ? `${es ? "Última respuesta del lado del abogado" : "Last response from attorney side"}: ${fmtDate(lastRes.occurredAt, locale)} — ${lastRes.title}` : es ? "Última respuesta del lado del abogado: ninguna registrada" : "Last response from attorney side: none logged");
  y += 12;

  // ---- 4. Red-flag observations (neutral) ----
  heading(es ? "4. Observaciones de alerta (neutral)" : "4. Red-flag observations (neutral)");
  if (observations.length === 0) {
    para(es ? "Sin observaciones automáticas registradas." : "No automated observations recorded.");
  } else {
    observations.forEach((o, i) => {
      para(`${i + 1}. [${o.ruleId} · ${o.severity.toUpperCase()}] ${o.title}`, 10);
      para(o.text, 9.5, 14);
      para(`${es ? "Reglas citadas" : "Rules cited"}: ${o.citations.join("; ")}`, 8.5, 14);
      y += 6;
    });
  }

  // ---- 5. Document index ----
  if (opts.includeDocs) {
    heading(es ? "5. Índice de documentos" : "5. Document index");
    if (documents.length === 0) {
      para(es ? "Sin documentos indexados." : "No documents indexed.");
    } else {
      autoTable(doc, {
        startY: y,
        head: [[es ? "Archivo" : "File", es ? "Etiquetas" : "Tags", es ? "Tamaño" : "Size", es ? "Agregado" : "Added"]],
        body: documents.map((d) => [
          d.filename,
          d.tags.join(", "),
          `${Math.max(1, Math.round(d.size / 1024))} KB`,
          fmtDate(d.createdAt, locale),
        ]),
        margin: { left: M, right: M },
        styles: { fontSize: 8.5, cellPadding: 4 },
        headStyles: { fillColor: [50, 50, 50] },
      });
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
    }
    para(
      es
        ? "Nota: los documentos se adjuntan como copias por separado. Envíe siempre copias, nunca originales."
        : "Note: documents are attached as separate copies. Always send copies, never originals.",
      9,
    );
  }

  // ---- 6. Draft narrative ----
  doc.addPage();
  y = M;
  heading(es ? "6. Borrador de narración para la queja" : "6. Draft complaint narrative");
  para(es ? "Borrador generado a partir del diario; el cliente lo edita antes de usarlo." : "Draft generated from the journal; the client edits it before use.", 9);
  y += 8;
  for (const block of narrative.split("\n")) {
    para(block, 10);
  }

  // ---- 7. Complaint-form worksheet (PRD §13 Phase 4) ----
  if (opts.includeWorksheet) {
    doc.addPage();
    y = M;
    const ws = buildWorksheet(caseRow, entries, documents, observations, locale);
    heading(ws.formName[locale]);
    para(`${es ? "Dónde presentar" : "Where to file"}: ${ws.where[locale]}`, 9);
    para(
      es
        ? "Hoja de preparación generada de su diario: traslade cada campo al formulario oficial después de revisarlo. LexGuard no presenta quejas."
        : "Preparation worksheet generated from your journal: review each field, then transfer it into the official form. LexGuard does not file complaints.",
      9,
    );
    y += 6;
    for (const s of ws.sections) {
      ensure(60);
      autoTable(doc, {
        startY: y,
        head: [[s.heading[locale]]],
        body: s.fields.map((f) => [f.label[locale], f.value || (es ? "(completar)" : "(fill in)")]),
        margin: { left: M, right: M },
        styles: { fontSize: 8.5, cellPadding: 4, minCellHeight: 14 },
        headStyles: { fillColor: [50, 50, 50] },
        columnStyles: { 0: { cellWidth: 170, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
      });
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
    }
    ensure(80);
    para(es ? "Notas importantes:" : "Important notes:", 10);
    for (const n of ws.notices[locale]) {
      para(`• ${n}`, 8.5, 10);
    }
    // also surface the standing form-location note one last time
    para(worksheetForState(caseRow.state).where[locale], 8.5);
  }

  footer();
  return doc;
}
