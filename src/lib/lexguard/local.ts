// LexGuard Mode B — anonymous local storage adapter (PRD §9.4)
// All data stays in this browser. Nothing is ever sent to a server.
// Files are capped at 1 MB (base64 in localStorage) with a clear notice.

import type { CaseData, DocumentMeta, EntryData } from "./types";

const KEY = "lexguard.local.v1";
const LOCAL_FILE_LIMIT = 1024 * 1024;

interface LocalDB {
  cases: CaseData[];
  entries: EntryData[];
  documents: (DocumentMeta & { dataUrl: string })[];
  dossiers: { id: string; caseId: string; createdAt: string; unbranded: boolean }[];
}

function empty(): LocalDB {
  return { cases: [], entries: [], documents: [], dossiers: [] };
}

function load(): LocalDB {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalDB) : empty();
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
