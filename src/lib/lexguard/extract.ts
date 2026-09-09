// LexGuard document text extraction — client-side only (Phase 3, PRD §13 "OCR search
// quality"). Privacy posture: extraction runs in the user's browser; only the resulting
// text is saved (account mode: to their own record; local mode: to localStorage).
// PDFs use the bundled pdf.js worker (/pdf.worker.min.mjs — offline-safe). Images use
// tesseract.js (eng+spa, language data fetched from CDN once, then cached by the browser).

export type ExtractKind = "pdf" | "image" | "none";

export interface ExtractResult {
  text: string;
  kind: ExtractKind;
  pages?: number;
}

export type ProgressFn = (percent: number) => void;

const MAX_TEXT = 100_000; // keep search text bounded (matches SEARCH_MAX_TEXT)
const MAX_PDF_PAGES = 60;

function isPdf(mime: string, filename: string): boolean {
  return mime === "application/pdf" || /\.pdf$/i.test(filename);
}

function isImage(mime: string, filename: string): boolean {
  return mime.startsWith("image/") || /\.(png|jpe?g|webp|bmp|gif)$/i.test(filename);
}

export function extractSupported(mime: string, filename: string): boolean {
  return isPdf(mime, filename) || isImage(mime, filename);
}

export async function extractDocumentText(
  file: Blob,
  mime: string,
  filename: string,
  onProgress?: ProgressFn,
): Promise<ExtractResult> {
  if (isPdf(mime, filename)) return extractPdf(file, onProgress);
  if (isImage(mime, filename)) return extractImage(file, onProgress);
  return { text: "", kind: "none" };
}

// ---- PDF: extract the embedded text layer (no OCR needed for digital PDFs) ----
async function extractPdf(file: Blob, onProgress?: ProgressFn): Promise<ExtractResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const maxPages = Math.min(doc.numPages, MAX_PDF_PAGES);
  let text = "";
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastX: number | null = null;
    for (const item of content.items) {
      const it = item as { str?: string; hasEOL?: boolean; transform?: number[] };
      if (typeof it.str !== "string") continue;
      // Heuristic: new column (large x jump) -> space; explicit EOL -> newline
      const x = it.transform ? it.transform[4] : null;
      if (lastX !== null && x !== null && x - lastX > 12 && !line.endsWith(" ")) line += " ";
      line += it.str;
      if (it.hasEOL) {
        text += line.trimEnd() + "\n";
        line = "";
      }
      if (x !== null) lastX = x + it.str.length * 4;
    }
    if (line.trim()) text += line.trimEnd() + "\n";
    text += "\n";
    onProgress?.(Math.round((i / maxPages) * 100));
    if (text.length > MAX_TEXT) break;
  }
  const clean = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text: clean.slice(0, MAX_TEXT), kind: "pdf", pages: doc.numPages };
}

// ---- Images: OCR with tesseract.js (English + Spanish models) ----
async function extractImage(file: Blob, onProgress?: ProgressFn): Promise<ExtractResult> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["eng", "spa"], 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text" && onProgress) onProgress(Math.round(m.progress * 100));
    },
  });
  try {
    const { data } = await worker.recognize(file);
    return { text: (data.text ?? "").trim().slice(0, MAX_TEXT), kind: "image" };
  } finally {
    await worker.terminate();
  }
}
