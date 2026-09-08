// LexGuard Mode A — account API client (calls same-origin /api endpoints)
import type { CaseData, DocumentMeta, EntryData } from "./types";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`api_${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  register: (email: string, password: string, state: string, locale: string) =>
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, state, locale }),
    }).then(j<{ id: string; email: string; state: string | null; locale: string }>),
  login: (email: string, password: string) =>
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(j<{ id: string; email: string; state: string | null; locale: string }>),
  logout: () => fetch("/api/auth/logout", { method: "POST" }).then(j<{ ok: boolean }>),
  me: () => fetch("/api/auth/me").then(j<{ user: { id: string; email: string; state: string | null; locale: string } | null }>),

  listCases: () =>
    fetch("/api/cases").then(
      j<{
        cases: (CaseData & { _count: { entries: number; documents: number; dossiers: number } })[];
      }>,
    ),
  getCase: (id: string) =>
    fetch(`/api/cases/${id}`).then(j<{ case: CaseData; entries: EntryData[]; documents: DocumentMeta[] }>),
  createCase: (data: Partial<CaseData>) =>
    fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(j<{ case: CaseData }>),
  updateCase: (id: string, patch: Partial<CaseData>) =>
    fetch(`/api/cases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then(j<{ case: CaseData }>),
  deleteCase: (id: string) => fetch(`/api/cases/${id}`, { method: "DELETE" }).then(j<{ ok: boolean }>),

  createEntry: (caseId: string, data: Partial<EntryData>) =>
    fetch(`/api/cases/${caseId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(j<{ entry: EntryData }>),
  updateEntry: (id: string, patch: Partial<EntryData>) =>
    fetch(`/api/entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then(j<{ entry: EntryData }>),
  deleteEntry: (id: string) => fetch(`/api/entries/${id}`, { method: "DELETE" }).then(j<{ ok: boolean }>),

  uploadDocument: (caseId: string, file: File, tags: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("caseId", caseId);
    fd.append("tags", tags);
    return fetch("/api/documents", { method: "POST", body: fd }).then(j<{ document: DocumentMeta }>);
  },
  deleteDocument: (id: string) => fetch(`/api/documents/${id}`, { method: "DELETE" }).then(j<{ ok: boolean }>),
  documentUrl: (id: string) => `/api/documents/${id}`,

  exportAll: () => fetch("/api/account").then(j<unknown>),
  deleteAccount: () => fetch("/api/account", { method: "DELETE" }).then(j<{ ok: boolean }>),

  adminStats: (code: string) =>
    fetch(`/api/admin/stats?code=${encodeURIComponent(code)}`).then(
      j<{
        stats: { users: number; cases: number; entries: number; documents: number; dossiers: number; rulesLive: number; ruleLibraryVersion: string };
        rules: { id: string; trigger: string; states: string[]; severity: string; title: string; reviewer: string | null; reviewedAt: string | null; effectiveFrom: string }[];
      }>,
    ),
};

// Normalize DB rows (Date strings) into EntryData shape
export function normalizeEntry(e: EntryData): EntryData {
  return {
    ...e,
    data: typeof e.data === "string" ? (JSON.parse(e.data as unknown as string) as EntryData["data"]) : e.data,
    edited: !!e.editedAt,
  };
}
