// LexGuard Mode B — anonymous local storage adapter (PRD §9.4)
// All data stays in this browser. Nothing is ever sent to a server.
// Files are capped at 1 MB (base64 in localStorage) with a clear notice.

import type { CaseData, DocumentMeta, EntryData } from "./types";
import type { SearchDoc } from "./search";
import type { SurveyResponse, SurveyStatus } from "./surveys";

const KEY = "lexguard.local.v1";
const LOCAL_FILE_LIMIT = 1024 * 1024;

interface LocalDB {
  cases: CaseData[];
  entries: EntryData[];
  documents: (DocumentMeta & { dataUrl: string })[];
  dossiers: { id: string; caseId: string; createdAt: string; unbranded: boolean }[];
  surveys: SurveyResponse[];
}

function empty(): LocalDB {
  return { cases: [], entries: [], documents: [], dossiers: [], surveys: [] };
}

function load(): LocalDB {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    // merge over empty() so DBs written before Phase 3 (no `surveys` key) still work
    return raw ? { ...empty(), ...(JSON.parse(raw) as LocalDB) } : empty();
  } catch {
    return empty();
  }
}

function save(db: LocalDB): void {
  window.localStorage.setItem(KEY, JSON.stringify(db));
}

function uid(): string {
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const localStore = {
  listCases(): CaseData[] {
    return [...load().cases].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  },
  // Global search index across every case in this browser (Phase 3)
  searchDocs(): SearchDoc[] {
    const db = load();
    const caseLabel = (id: string) => {
      const c = db.cases.find((x) => x.id === id);
      return c ? c.firm ? `${c.attorneyName} — ${c.firm}` : c.attorneyName : "";
    };
    const docs: SearchDoc[] = [];
    for (const c of db.cases) {
      docs.push({
        id: `case:${c.id}`,
        kind: "case",
        caseId: c.id,
        caseLabel: caseLabel(c.id),
        type: "case",
        title: c.firm ? `${c.attorneyName} — ${c.firm}` : c.attorneyName,
        text: [c.caseType, c.state, c.status].join(" "),
      });
    }
    for (const e of db.entries) {
      const payload = (e.data && Object.keys(e.data).length > 0 ? JSON.stringify(e.data) : "") ?? "";
      docs.push({
        id: `entry:${e.id}`,
        kind: "entry",
        caseId: e.caseId,
        caseLabel: caseLabel(e.caseId),
        type: e.type,
        occurredAt: e.occurredAt,
        title: e.title,
        text: [e.body ?? "", payload].join("\n"),
        amount: e.type === "payment" ? (e.data as { amount?: number })?.amount : undefined,
      });
    }
    for (const d of db.documents) {
      docs.push({
        id: `doc:${d.id}`,
        kind: "document",
        caseId: d.caseId,
        caseLabel: caseLabel(d.caseId),
        type: d.tags.join(","),
        occurredAt: d.createdAt,
        title: d.filename,
        text: [d.tags.join(" "), d.ocrText ?? ""].join("\n"),
      });
    }
    return docs;
  },
  getCase(id: string): { case: CaseData; entries: EntryData[]; documents: DocumentMeta[] } | null {
    const db = load();
    const c = db.cases.find((x) => x.id === id);
    if (!c) return null;
    const entries = db.entries.filter((e) => e.caseId === id);
    const documents = db.documents.filter((d) => d.caseId === id).map(({ dataUrl: _d, ...meta }) => meta);
    return { case: c, entries, documents };
  },
  createCase(data: Omit<CaseData, "id" | "createdAt">): CaseData {
    const db = load();
    const c: CaseData = { ...data, id: uid(), createdAt: new Date().toISOString() };
    db.cases.push(c);
    save(db);
    return c;
  },
  updateCase(id: string, patch: Partial<CaseData>): CaseData | null {
    const db = load();
    const i = db.cases.findIndex((x) => x.id === id);
    if (i < 0) return null;
    db.cases[i] = { ...db.cases[i], ...patch };
    save(db);
    return db.cases[i];
  },
  deleteCase(id: string): void {
    const db = load();
    db.cases = db.cases.filter((x) => x.id !== id);
    db.entries = db.entries.filter((e) => e.caseId !== id);
    db.documents = db.documents.filter((d) => d.caseId !== id);
    save(db);
  },
  createEntry(data: Omit<EntryData, "id" | "createdAt" | "edited" | "editedAt">): EntryData {
    const db = load();
    const e: EntryData = { ...data, id: uid(), createdAt: new Date().toISOString(), edited: false };
    db.entries.push(e);
    save(db);
    return e;
  },
  updateEntry(id: string, patch: Partial<EntryData>): EntryData | null {
    const db = load();
    const i = db.entries.findIndex((x) => x.id === id);
    if (i < 0) return null;
    db.entries[i] = { ...db.entries[i], ...patch, edited: true, editedAt: new Date().toISOString() };
    save(db);
    return db.entries[i];
  },
  deleteEntry(id: string): void {
    const db = load();
    db.entries = db.entries.filter((x) => x.id !== id);
    save(db);
  },
  createDocument(meta: { caseId: string; filename: string; mime: string; size: number; tags: string[]; dataUrl: string }): DocumentMeta {
    const db = load();
    const doc = { ...meta, id: uid(), createdAt: new Date().toISOString() };
    db.documents.push(doc);
    save(db);
    const { dataUrl: _d, ...rest } = doc;
    return rest;
  },
  deleteDocument(id: string): void {
    const db = load();
    db.documents = db.documents.filter((x) => x.id !== id);
    save(db);
  },
  getDocumentDataUrl(id: string): string | null {
    return load().documents.find((d) => d.id === id)?.dataUrl ?? null;
  },
  // store extracted text (PDF layer / OCR) on a local document (Phase 3)
  setDocumentText(id: string, text: string): void {
    const db = load();
    const i = db.documents.findIndex((x) => x.id === id);
    if (i < 0) return;
    db.documents[i] = { ...db.documents[i], ocrText: text };
    save(db);
  },
  listDossiers(): { id: string; caseId: string; createdAt: string; unbranded: boolean }[] {
    return [...load().dossiers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  listSurveys(): SurveyResponse[] {
    return [...load().surveys].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  saveSurvey(r: Omit<SurveyResponse, "updatedAt"> & { updatedAt?: string }): void {
    const db = load();
    const rec: SurveyResponse = { ...r, updatedAt: r.updatedAt ?? new Date().toISOString() };
    const i = db.surveys.findIndex((x) => x.dossierId === r.dossierId && x.milestone === r.milestone);
    if (i >= 0) db.surveys[i] = { ...db.surveys[i], ...rec };
    else db.surveys.push(rec);
    save(db);
  },
  surveyStatus(dossierId: string, milestone: number): SurveyStatus | null {
    return load().surveys.find((s) => s.dossierId === dossierId && s.milestone === milestone)?.status ?? null;
  },
  recordDossier(caseId: string, unbranded: boolean): void {
    const db = load();
    db.dossiers.push({ id: uid(), caseId, createdAt: new Date().toISOString(), unbranded });
    save(db);
  },
  countDossiers(): number {
    return load().dossiers.length;
  },
  exportAll(): unknown {
    return load();
  },
  importAll(json: LocalDB): void {
    save(json);
  },
  wipe(): void {
    save(empty());
  },
  fileLimitBytes: LOCAL_FILE_LIMIT,
};
