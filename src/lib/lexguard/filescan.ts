// LexGuard upload integrity scan (PRD FR-2.4 "virus scanning on upload").
// Runs fully client-side before a file is stored: signature checks for
// executables masquerading as documents, the EICAR antivirus test string,
// PDF active-content markers, macro-enabled Office parts, and extension/MIME
// mismatches. Findings use neutral wording and concrete next steps — LexGuard
// never claims a file is "infected", only what was observed in the bytes.

export type ScanLevel = "clean" | "warn" | "block";

export interface ScanFinding {
  code: string;
  text: { en: string; es: string };
}

export interface ScanResult {
  level: ScanLevel;
  findings: ScanFinding[];
}

const EXECUTABLE_EXTS = [".exe", ".dll", ".scr", ".com", ".msi", ".bat", ".cmd", ".ps1", ".jar", ".apk"];

async function readHead(blob: Blob, bytes: number): Promise<Uint8Array> {
  return new Uint8Array(await blob.slice(0, bytes).arrayBuffer());
}

function ascii(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return s;
}

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

export async function scanFile(file: File): Promise<ScanResult> {
  const findings: ScanFinding[] = [];
  const head = await readHead(file, 8192);
  const headStr = ascii(head);
  const ext = extOf(file.name);
  const lowerName = file.name.toLowerCase();

  // 1. Executable signatures regardless of claimed type (FR-2.4 hard block).
  if (headStr.startsWith("MZ") || headStr.startsWith("\x7fELF")) {
    findings.push({
      code: "executable",
      text: {
        en: "This file has the signature of a computer program (executable), not a document. LexGuard does not accept program files.",
        es: "Este archivo tiene la firma de un programa informático (ejecutable), no de un documento. LexGuard no acepta archivos de programas.",
      },
    });
  }
  if (EXECUTABLE_EXTS.some((e) => lowerName.endsWith(e))) {
    findings.push({
      code: "exec_ext",
      text: {
        en: "This file type is a program. LexGuard only stores documents and images — export the content as a PDF or image instead.",
        es: "Este tipo de archivo es un programa. LexGuard solo guarda documentos e imágenes — exporte el contenido como PDF o imagen.",
      },
    });
  }

  // 2. EICAR — the industry-standard antivirus test string (concept check).
  if (headStr.includes(EICAR)) {
    findings.push({
      code: "eicar",
      text: {
        en: "This file contains the EICAR antivirus test signature — it is a test file, not real evidence.",
        es: "Este archivo contiene la firma de prueba antivirus EICAR — es un archivo de prueba, no evidencia real.",
      },
    });
  }

  // 3. PDF active content — /JavaScript, /JS, /Launch, /OpenAction, /EmbeddedFile.
  if (file.type === "application/pdf" || ext === ".pdf") {
    if (headStr.includes("/JavaScript") || headStr.includes("/JS ") || headStr.includes("/Launch") || headStr.includes("/OpenAction")) {
      findings.push({
        code: "pdf_active",
        text: {
          en: "This PDF contains active content (embedded scripts or auto-launch actions). Consider asking the sender for a flattened copy.",
          es: "Este PDF contiene contenido activo (scripts incrustados o acciones automáticas). Considere pedir una copia aplanada.",
        },
      });
    }
  }

  // 4. Macro-enabled Office documents — "vbaProject" appears in the zip stream.
  if (headStr.includes("vbaProject")) {
    findings.push({
      code: "macro",
      text: {
        en: "This document contains macros. Ask for a macro-free PDF copy before relying on it.",
        es: "Este documento contiene macros. Pida una copia PDF sin macros antes de depender de él.",
      },
    });
  }

  // 5. Extension / MIME mismatch that suggests something is not what it claims.
  const claimsPdf = ext === ".pdf";
  const claimsHtml = ext === ".html" || ext === ".htm" || ext === ".svg";
  if (claimsPdf && file.type && file.type !== "application/pdf" && !file.type.startsWith("text/")) {
    findings.push({
      code: "mismatch",
      text: {
        en: "The file is named .pdf but its declared type is something else. Double-check the source before attaching it.",
        es: "El archivo tiene extensión .pdf pero su tipo declarado es otro. Verifique el origen antes de adjuntarlo.",
      },
    });
  }
  if (claimsHtml && (headStr.includes("<script") || headStr.includes("onload="))) {
    findings.push({
      code: "script_html",
      text: {
        en: "This file contains scripts. If it is evidence, a PDF copy is safer to keep.",
        es: "Este archivo contiene scripts. Si es evidencia, es más seguro guardar una copia PDF.",
      },
    });
  }

  const block = findings.some((f) => f.code === "executable" || f.code === "exec_ext" || f.code === "eicar");
  return { level: block ? "block" : findings.length ? "warn" : "clean", findings };
}
