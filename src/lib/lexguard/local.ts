// LexGuard Mode B — anonymous local storage adapter (PRD §9.4)
// All data stays in this browser. Nothing is ever sent to a server.
// Files are capped at 1 MB (base64 in localStorage) with a clear notice.
//
// Zero-knowledge vault (PRD §9.1, Phase 4): the whole DB can be encrypted at
// rest with a passphrase (AES-GCM, key derived once per unlock and kept in
// memory only). While the vault is locked, `load()` yields an empty DB and the
// app shell gates the UI behind the unlock screen — nothing readable is
// written. Persistence is debounced: mutations apply to the in-memory copy
// synchronously; the encrypted blob is written shortly after.

import type { CaseData, DocumentMeta, EntryData } from "./types";
import type { SearchDoc } from "./search";
import type { SurveyResponse, SurveyStatus } from "./surveys";
import { createCipher, decryptJson, isZkPayload, type VaultCipher } from "./zk";

const KEY = "lexguard.local.v1";
const VAULT_KEY = "lexguard.local.v1.vault";
const LOCAL_FILE_LIMIT = 1024 * 1024;
const PERSIST_DEBOUNCE_MS = 150;

// ---- vault state (module memory only — never persisted) ----
let memDb: LocalDB | null = null; // decrypted working copy
let vaultEnabled = false; // this session runs in encrypted mode
let cipher: VaultCipher | null = null; // key derived once per unlock
let persistTimer: ReturnType<typeof setTimeout> | null = null;

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

function vaultExists(): boolean {
  try {
    return !!window.localStorage.getItem(VAULT_KEY);
  } catch {
    return false;
  }
}

function load(): LocalDB {
  if (typeof window === "undefined") return empty();
  // The in-memory working copy is authoritative once it exists: persistence is
  // debounced/async, so localStorage can be behind memDb — reading it back
  // would lose the just-mutated state (read-modify-write must stay consistent).
  if (memDb) return memDb;
  if (vaultExists() || vaultEnabled) {
    // vault mode — readable working copy only while unlocked
    return empty();
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    // merge over empty() so DBs written before Phase 3 (no `surveys` key) still work
    const parsed = raw ? { ...empty(), ...(JSON.parse(raw) as LocalDB) } : empty();
    memDb = parsed; // adopt as working copy so subsequent reads see one source of truth
    return parsed;
  } catch {
    return empty();
  }
}

function save(db: LocalDB): void {
  memDb = db;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => void persistNow(), PERSIST_DEBOUNCE_MS);
}

async function persistNow(): Promise<void> {
  if (!memDb || typeof window === "undefined") return;
  if (vaultEnabled && cipher) {
    try {
      window.localStorage.setItem(VAULT_KEY, await cipher.encrypt(memDb));
    } catch {
      /* encryption unavailable — keep working copy in memory, retry next save */
    }
  } else if (!vaultEnabled) {
    window.localStorage.setItem(KEY, JSON.stringify(memDb));
  }
}

export type VaultStatus = "none" | "locked" | "unlocked";

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
    memDb = empty();
    vaultEnabled = false;
    cipher = null;
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = null;
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem(VAULT_KEY);
    } catch {
      /* storage unavailable */
    }
  },

  // ---- zero-knowledge vault (PRD §9.1) ----
  vaultStatus(): VaultStatus {
    if (vaultEnabled || vaultExists()) return cipher ? "unlocked" : "locked";
    return "none";
  },
  // Turn on encryption for the existing local data. The plaintext key is
  // removed only after the encrypted blob is durably written.
  async enableVault(passphrase: string): Promise<boolean> {
    if (vaultEnabled || vaultExists()) return false;
    const current = load();
    try {
      const c = await createCipher(passphrase);
      const payload = await c.encrypt(current);
      window.localStorage.setItem(VAULT_KEY, payload);
      window.localStorage.removeItem(KEY);
      vaultEnabled = true;
      cipher = c;
      memDb = current;
      return true;
    } catch {
      return false;
    }
  },
  // Unlock an existing vault. Wrong passphrase → false, memory stays clean.
  async unlockVault(passphrase: string): Promise<boolean> {
    let payload: string | null = null;
    try {
      payload = window.localStorage.getItem(VAULT_KEY);
    } catch {
      return false;
    }
    if (!payload || !isZkPayload(payload)) return false;
    try {
      const parsed = await decryptJson<LocalDB>(payload, passphrase);
      const c = await createCipher(passphrase, payload);
      memDb = { ...empty(), ...parsed };
      cipher = c;
      vaultEnabled = true;
      return true;
    } catch {
      memDb = null;
      cipher = null;
      vaultEnabled = false;
      return false;
    }
  },
  // Turn encryption off — decrypts to the plaintext key and removes the vault.
  async disableVault(passphrase: string): Promise<boolean> {
    let payload: string | null = null;
    try {
      payload = window.localStorage.getItem(VAULT_KEY);
    } catch {
      return false;
    }
    if (!payload) return false;
    try {
      const parsed = await decryptJson<LocalDB>(payload, passphrase);
      window.localStorage.setItem(KEY, JSON.stringify({ ...empty(), ...parsed }));
      window.localStorage.removeItem(VAULT_KEY);
      memDb = { ...empty(), ...parsed };
      cipher = null;
      vaultEnabled = false;
      return true;
    } catch {
      return false;
    }
  },
  // Zero-knowledge backup: download the encrypted blob exactly as stored.
  exportEncrypted(): string | null {
    try {
      return window.localStorage.getItem(VAULT_KEY);
    } catch {
      return null;
    }
  },
  // Restore a zero-knowledge backup. Replaces the current vault after the
  // passphrase is verified against the backup blob.
  async importEncrypted(payload: string, passphrase: string): Promise<boolean> {
    if (!isZkPayload(payload)) return false;
    try {
      const parsed = await decryptJson<LocalDB>(payload, passphrase);
      const c = await createCipher(passphrase, payload);
      window.localStorage.setItem(VAULT_KEY, payload);
      window.localStorage.removeItem(KEY);
      memDb = { ...empty(), ...parsed };
      cipher = c;
      vaultEnabled = true;
      return true;
    } catch {
      return false;
    }
  },
  fileLimitBytes: LOCAL_FILE_LIMIT,
};
