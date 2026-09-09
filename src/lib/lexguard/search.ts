// LexGuard global search — isomorphic, deterministic, dependency-free (PRD §13 Phase 3:
// "OCR search quality"). Runs identically on the server (account mode /api/search) and
// in the browser (local mode + static guides). Accent-insensitive; every query term must
// match (AND); titles score higher; snippets keep highlight positions via a char map.

export interface SearchDoc {
  id: string;
  kind: "case" | "entry" | "document" | "guide";
  caseId?: string;
  caseLabel?: string; // attorney/firm for context chips
  type?: string; // entry type, document tag, or "case"/"guide"
  occurredAt?: string; // ISO — used for secondary sort
  title: string;
  text: string; // searchable body (entry body + data JSON, doc ocrText, guide paragraphs)
  amount?: number; // payment amounts are searchable as numbers
}

export interface SnippetPart {
  text: string;
  hit: boolean;
}

export interface SearchHit {
  id: string;
  kind: SearchDoc["kind"];
  caseId?: string;
  caseLabel?: string;
  type?: string;
  occurredAt?: string;
  title: SnippetPart[];
  snippet: SnippetPart[];
  score: number;
}

interface NormIndex {
  norm: string;
  from: number[]; // norm index -> source index
}

// Normalize char-by-char so indices survive: strip combining marks, lowercase.
function normalizeWithMap(s: string): NormIndex {
  const chars: string[] = [];
  const from: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const base = s[i].normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    for (const b of base) {
      chars.push(b);
      from.push(i);
    }
  }
  return { norm: chars.join(""), from };
}

function termPositions(normHaystack: string, term: string): number[] {
  const out: number[] = [];
  let i = normHaystack.indexOf(term);
  while (i >= 0) {
    out.push(i);
    i = normHaystack.indexOf(term, i + term.length);
  }
  return out;
}

function isWordChar(s: string, idx: number): boolean {
  if (idx < 0 || idx >= s.length) return false;
  return /\p{L}|\p{N}/u.test(s[idx]);
}

function hasWordBoundary(norm: string, start: number, len: number): boolean {
  return !isWordChar(norm, start - 1) && !isWordChar(norm, start + len);
}

interface FieldMatch {
  hit: boolean;
  word: boolean;
  firstSrc: number; // source index of first occurrence (for snippets)
  lastSrc: number;
}

function matchField(
  field: { norm: string; from: number[] },
  term: string,
): FieldMatch {
  const miss: FieldMatch = { hit: false, word: false, firstSrc: -1, lastSrc: -1 };
  const pos = termPositions(field.norm, term);
  if (pos.length === 0) return miss;
  const word = pos.some((p) => hasWordBoundary(field.norm, p, term.length));
  const firstNorm = pos[0];
  const lastNorm = pos[pos.length - 1] + term.length - 1;
  return {
    hit: true,
    word,
    firstSrc: field.from[firstNorm],
    lastSrc: field.from[lastNorm],
  };
}

export function parseQuery(q: string): string[] {
  return q
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 8); // cap terms to keep scoring predictable
}

function scoreDoc(doc: SearchDoc, terms: string[]): { score: number; titleFirst: number; bodyFirst: number } | null {
  const title = normalizeWithMap(doc.title);
  const body = normalizeWithMap(doc.text || "");
  let score = 0;
  let titleFirst = -1;
  let bodyFirst = -1;
  for (const term of terms) {
    const numeric = /^\d+(\.\d+)?$/.test(term);
    const t = matchField(title, term);
    const b = matchField(body, term);
    // numeric terms may also hit the amount field (e.g. "1500" finds $1,500.00)
    const amountHit = numeric && doc.amount !== undefined && Math.abs(doc.amount - Number(term)) < 0.01;
    if (!t.hit && !b.hit && !amountHit) return null; // AND semantics
    score += t.hit ? (t.word ? 4 : 2) : 0;
    score += b.hit ? (b.word ? 1.5 : 1) : 0;
    if (amountHit) score += 1;
    if (titleFirst < 0 && t.firstSrc >= 0) titleFirst = t.firstSrc;
    if (bodyFirst < 0 && b.firstSrc >= 0) bodyFirst = b.firstSrc;
  }
  // kind weighting: cases and entries are primary records
  const kindWeight = doc.kind === "case" ? 1.2 : doc.kind === "entry" ? 1 : doc.kind === "document" ? 0.9 : 0.8;
  return { score: score * kindWeight, titleFirst, bodyFirst };
}

function buildParts(
  source: string,
  range: { start: number; end: number } | null,
  terms: string[],
): { parts: SnippetPart[]; matched: boolean } {
  // Full-value highlight (used for titles): mark every term occurrence.
  const { norm, from } = normalizeWithMap(source);
  if (!range) {
    const parts: SnippetPart[] = [];
    let cursor = 0;
    const marks: [number, number][] = [];
    for (const term of terms) {
      for (const p of termPositions(norm, term)) {
        marks.push([from[p], from[p + term.length - 1] + 1]);
      }
    }
    marks.sort((a, b) => a[0] - b[0]);
    for (const [s, e] of marks) {
      if (s < cursor) continue;
      if (s > cursor) parts.push({ text: source.slice(cursor, s), hit: false });
      parts.push({ text: source.slice(s, e), hit: true });
      cursor = e;
    }
    if (parts.length === 0) parts.push({ text: source, hit: false });
    else if (cursor < source.length) parts.push({ text: source.slice(cursor), hit: false });
    return { parts, matched: marks.length > 0 };
  }
  // Snippet window around the matched range with word-boundary padding.
  const PAD = 48;
  let start = Math.max(0, range.start - PAD);
  let end = Math.min(source.length, range.end + PAD);
  while (start > 0 && /\S/.test(source[start - 1])) start--;
  while (end < source.length && /\S/.test(source[end])) end++;
  const prefix = start > 0 ? "…" : "";
  const suffix = end < source.length ? "…" : "";
  const windowText = source.slice(start, end);
  const win = normalizeWithMap(windowText);
  const offsetMap = (idx: number) => idx - start;
  const winStart = offsetMap(range.start);
  const winEnd = offsetMap(range.end + 1);
  const parts: SnippetPart[] = [];
  if (prefix) parts.push({ text: prefix, hit: false });
  // highlight every term inside the window, not just the first hit
  const marks: [number, number][] = [];
  for (const term of terms) {
    for (const p of termPositions(win.norm, term)) {
      const s = win.from[p];
      const e = win.from[p + term.length - 1] + 1;
      if (e < winStart || s > winEnd) continue; // outside primary window margin
      marks.push([s, e]);
    }
  }
  marks.sort((a, b) => a[0] - b[0]);
  let cursor = 0;
  for (const [s, e] of marks) {
    if (s < cursor) continue;
    if (s > cursor) parts.push({ text: windowText.slice(cursor, s), hit: false });
    parts.push({ text: windowText.slice(s, e), hit: true });
    cursor = e;
  }
  if (cursor < windowText.length) parts.push({ text: windowText.slice(cursor), hit: false });
  if (suffix) parts.push({ text: suffix, hit: false });
  return { parts, matched: true };
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 30): SearchHit[] {
  const terms = parseQuery(query);
  if (terms.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const doc of docs) {
    const capped: SearchDoc = doc.text.length > 200_000 ? { ...doc, text: doc.text.slice(0, 200_000) } : doc;
    const r = scoreDoc(capped, terms);
    if (!r) continue;
    const titleParts = buildParts(doc.title, null, terms);
    const bodyRange =
      r.bodyFirst >= 0
        ? { start: r.bodyFirst, end: Math.max(r.bodyFirst + 1, r.bodyFirst + terms.join(" ").length) }
        : null;
    const snippet =
      r.bodyFirst >= 0
        ? buildParts(doc.text, bodyRange, terms).parts
        : [{ text: (doc.text || "").slice(0, 120) + ((doc.text || "").length > 120 ? "…" : ""), hit: false }];
    hits.push({
      id: doc.id,
      kind: doc.kind,
      caseId: doc.caseId,
      caseLabel: doc.caseLabel,
      type: doc.type,
      occurredAt: doc.occurredAt,
      title: titleParts.parts,
      snippet,
      score: r.score,
    });
  }
  return hits
    .sort((a, b) => b.score - a.score || (b.occurredAt ?? "").localeCompare(a.occurredAt ?? ""))
    .slice(0, limit);
}

export const SEARCH_MAX_TEXT = 100_000; // chars of extracted text stored per document
