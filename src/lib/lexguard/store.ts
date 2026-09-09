// LexGuard app store — Zustand (PRD client state)
// Dual storage mode: 'account' (API + Prisma) and 'local' (browser-only, Mode B).
// The red-flag engine, router, and dossier builder run on the same shapes in both.
import { create } from "zustand";
import type { CaseData, DocumentMeta, EntryData, EntryType, Locale, StorageMode, USState } from "./types";
import { api, normalizeEntry } from "./api";
import { localStore, type VaultStatus } from "./local";
import { scanFile, type ScanResult } from "./filescan";

export type ViewName =
  | "home"
  | "onboarding"
  | "auth"
  | "guides"
  | "guide"
  | "journal"
  | "case"
  | "flags"
  | "router"
  | "dossier"
  | "directory"
  | "deadlines"
  | "legal"
  | "search"
  | "settings"
  | "admin";

export interface View {
  name: ViewName;
  caseId?: string;
  slug?: string;
}

interface Prefs {
  locale: Locale;
  userState: USState | null;
  mode: StorageMode | null;
  discreet: boolean;
  pinHash: string | null;
}

function loadPrefs(): Prefs {
  const fallback: Prefs = { locale: "en", userState: null, mode: null, discreet: false, pinHash: null };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem("lexguard.prefs.v1");
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Prefs>) } : fallback;
  } catch {
    return fallback;
  }
}

function savePrefs(p: Prefs): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("lexguard.prefs.v1", JSON.stringify(p));
}

async function sha(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface CaseFull {
  case: CaseData;
  entries: EntryData[];
  documents: DocumentMeta[];
}

interface AppState extends Prefs {
  ready: boolean;
  user: { id: string; email: string; state: string | null; locale: string } | null;
  stack: View[];
  cases: (CaseData & { _count?: { entries: number; documents: number; dossiers: number } })[];
  active: CaseFull | null;
  activeLoading: boolean;
  // zero-knowledge vault status for local mode (PRD §9.1) — reactive mirror
  vault: VaultStatus;

  init: () => Promise<void>;
  setLocale: (l: Locale) => void;
  setUserState: (s: USState | null) => void;
  setMode: (m: StorageMode | null) => void;
  toggleDiscreet: () => void;
  setPin: (pin: string) => Promise<void>;
  clearPin: () => void;
  locked: boolean;
  unlock: (pin: string) => Promise<boolean>;
  refreshVault: () => void;

  view: () => View;
  navigate: (v: View) => void;
  back: () => void;
  home: () => void;

  setUser: (u: AppState["user"]) => void;
  signOut: () => Promise<void>;

  loadCases: () => Promise<void>;
  openCase: (id: string) => Promise<void>;
  refreshActive: () => Promise<void>;
  closeCase: () => void;
  createCase: (data: Partial<CaseData>) => Promise<CaseData>;
  updateCase: (id: string, patch: Partial<CaseData>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  addEntry: (caseId: string, e: Partial<EntryData> & { type: EntryType; title: string; occurredAt: string }) => Promise<void>;
  editEntry: (id: string, patch: Partial<EntryData>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  uploadDoc: (caseId: string, file: File, tags: string) => Promise<{ id: string | null; scan: ScanResult }>;
  removeDoc: (id: string) => Promise<void>;
  docDataUrl: (id: string) => string | null;
  extractDocText: (docId: string, onProgress?: (pct: number) => void) => Promise<{ ok: boolean; chars: number }>;
  recordDossier: (caseId: string, unbranded: boolean) => Promise<void>;
}

const prefs = loadPrefs();

function currentVault(): VaultStatus {
  if (typeof window === "undefined") return "none";
  return localStore.vaultStatus();
}

export const useApp = create<AppState>((set, get) => ({
  ...prefs,
  ready: false,
  user: null,
  locked: !!prefs.pinHash,
  vault: currentVault(),
  stack: [{ name: "home" }],
  cases: [],
  active: null,
  activeLoading: false,

  init: async () => {
    try {
      const res = await api.me();
      const u = res.user;
      if (u) {
        set({ user: u, mode: "account" });
        if (u.state === "TX" || u.state === "CA") set({ userState: u.state });
        if (u.locale === "es" || u.locale === "en") set({ locale: u.locale });
      }
    } catch {
      /* local mode users simply have no session */
    }
    set({ ready: true, locked: !!get().pinHash, vault: currentVault() });
  },

  refreshVault: () => set({ vault: currentVault() }),

  setLocale: (l) => {
    set({ locale: l });
    savePrefs(get());
  },
  setUserState: (s) => {
    set({ userState: s });
    savePrefs(get());
  },
  setMode: (m) => {
    set({ mode: m });
    savePrefs(get());
  },
  toggleDiscreet: () => {
    set({ discreet: !get().discreet });
    savePrefs(get());
  },
  setPin: async (pin) => {
    const h = await sha(`lexguard:${pin}`);
    set({ pinHash: h, locked: true });
    savePrefs(get());
  },
  clearPin: () => {
    set({ pinHash: null, locked: false });
    savePrefs(get());
  },
  unlock: async (pin) => {
    const h = await sha(`lexguard:${pin}`);
    if (h === get().pinHash) {
      set({ locked: false });
      return true;
    }
    return false;
  },

  view: () => get().stack[get().stack.length - 1],
  navigate: (v) => set({ stack: [...get().stack, v] }),
  back: () => set({ stack: get().stack.length > 1 ? get().stack.slice(0, -1) : [{ name: "home" }] }),
  home: () => set({ stack: [{ name: "home" }] }),

  setUser: (u) => set({ user: u }),
  signOut: async () => {
    await api.logout().catch(() => undefined);
    set({ user: null, mode: null, cases: [], active: null, stack: [{ name: "home" }] });
    savePrefs(get());
  },

  loadCases: async () => {
    if (get().mode === "account") {
      const res = await api.listCases();
      set({
        cases: res.cases.map((c) => ({
          ...c,
          engagementStart: c.engagementStart ?? null,
          engagementEnd: c.engagementEnd ?? null,
          createdAt: c.createdAt ?? undefined,
        })),
      });
    } else {
      set({ cases: localStore.listCases() });
    }
  },

  openCase: async (id) => {
    set({ activeLoading: true });
    try {
      if (get().mode === "account") {
        const res = await api.getCase(id);
        set({
          active: {
            case: res.case,
            entries: res.entries.map(normalizeEntry),
            documents: res.documents.map((d) => ({
              ...d,
              tags: Array.isArray(d.tags) ? d.tags : String(d.tags).split(",").map((x) => x.trim()).filter(Boolean),
            })),
          },
        });
      } else {
        const full = localStore.getCase(id);
        set({ active: full ? { case: full.case, entries: full.entries, documents: full.documents } : null });
      }
    } finally {
      set({ activeLoading: false });
    }
  },
  refreshActive: async () => {
    const cur = get().active;
    if (cur) await get().openCase(cur.case.id);
    await get().loadCases();
  },
  closeCase: () => set({ active: null }),

  createCase: async (data) => {
    const state = data.state ?? get().userState ?? "TX";
    if (get().mode === "account") {
      const res = await api.createCase({ ...data, state });
      await get().loadCases();
      return res.case;
    }
    const c = localStore.createCase({
      attorneyName: data.attorneyName ?? "",
      firm: data.firm ?? null,
      caseType: (data.caseType ?? "other") as CaseData["caseType"],
      state: state as USState,
      engagementStart: data.engagementStart ?? null,
      engagementEnd: data.engagementEnd ?? null,
      status: data.status ?? "active",
      feeType: data.feeType ?? null,
      agreedFeeAmount: data.agreedFeeAmount ?? null,
      contingencyPercent: data.contingencyPercent ?? null,
    });
    await get().loadCases();
    return c;
  },

  updateCase: async (id, patch) => {
    if (get().mode === "account") {
      await api.updateCase(id, patch);
    } else {
      localStore.updateCase(id, patch);
    }
    await get().refreshActive();
  },

  deleteCase: async (id) => {
    if (get().mode === "account") {
      await api.deleteCase(id);
    } else {
      localStore.deleteCase(id);
    }
    set({ active: null });
    await get().loadCases();
  },

  addEntry: async (caseId, e) => {
    if (get().mode === "account") {
      await api.createEntry(caseId, e);
    } else {
      localStore.createEntry({
        caseId,
        type: e.type,
        occurredAt: e.occurredAt,
        title: e.title,
        body: e.body ?? null,
        data: (e.data ?? {}) as EntryData["data"],
        documentId: null,
      });
    }
    await get().refreshActive();
  },

  editEntry: async (id, patch) => {
    if (get().mode === "account") {
      await api.updateEntry(id, patch);
    } else {
      localStore.updateEntry(id, patch);
    }
    await get().refreshActive();
  },

  removeEntry: async (id) => {
    if (get().mode === "account") {
      await api.deleteEntry(id);
    } else {
      localStore.deleteEntry(id);
    }
    await get().refreshActive();
  },

  uploadDoc: async (caseId, file, tags) => {
    // Phase 4 — client-side integrity scan before anything is stored (FR-2.4)
    const scan = await scanFile(file);
    if (scan.level === "block") return { id: null, scan };
    let id: string | null = null;
    if (get().mode === "account") {
      const res = await api.uploadDocument(caseId, file, tags);
      id = res.document?.id ?? null;
      // index the upload on the timeline as a document entry
      await api.createEntry(caseId, {
        type: "document",
        title: file.name,
        occurredAt: new Date().toISOString(),
        body: null,
      });
    } else {
      if (file.size > localStore.fileLimitBytes) throw new Error("too_big_local");
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("read"));
        r.readAsDataURL(file);
      });
      const meta = localStore.createDocument({ caseId, filename: file.name, mime: file.type, size: file.size, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), dataUrl });
      localStore.createEntry({ caseId, type: "document", occurredAt: new Date().toISOString(), title: file.name, body: null, data: {}, documentId: null });
      id = meta.id;
    }
    await get().refreshActive();
    return { id, scan };
  },

  removeDoc: async (id) => {
    if (get().mode === "account") {
      await api.deleteDocument(id);
    } else {
      localStore.deleteDocument(id);
    }
    await get().refreshActive();
  },

  docDataUrl: (id) => localStore.getDocumentDataUrl(id),

  // Phase 3 — client-side text extraction (PDF text layer / image OCR).
  // Runs in the browser; only the resulting text is saved to the user's own storage.
  extractDocText: async (docId, onProgress) => {
    const doc = get().active?.documents.find((d) => d.id === docId);
    if (!doc) return { ok: false, chars: 0 };
    try {
      let blob: Blob;
      if (get().mode === "account") {
        const res = await fetch(api.documentUrl(docId));
        if (!res.ok) throw new Error("fetch_failed");
        blob = await res.blob();
      } else {
        const url = localStore.getDocumentDataUrl(docId);
        if (!url) throw new Error("no_data");
        blob = await (await fetch(url)).blob();
      }
      const { extractDocumentText } = await import("./extract");
      const result = await extractDocumentText(blob, doc.mime, doc.filename, onProgress);
      if (!result.text) return { ok: false, chars: 0 };
      if (get().mode === "account") await api.updateDocumentText(docId, result.text);
      else localStore.setDocumentText(docId, result.text);
      await get().refreshActive();
      return { ok: true, chars: result.text.length };
    } catch {
      return { ok: false, chars: 0 };
    }
  },

  recordDossier: async (caseId, unbranded) => {
    if (get().mode === "account") {
      await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, unbranded }),
      }).catch(() => undefined);
    } else {
      localStore.recordDossier(caseId, unbranded);
    }
  },
}));
