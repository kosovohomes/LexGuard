import type { Metadata } from "next";
import { RULES, RULE_LIBRARY_VERSION } from "@/lib/lexguard/rules";

// Public status page (PRD §9.3: "99.5% uptime target; status page").
// Static and data-free: it describes the service's own health endpoints and
// never touches user data. Machine-readable liveness: GET /api/health.

export const metadata: Metadata = {
  title: "LexGuard — Service status",
  robots: { index: false, follow: false },
};

const PHASE4_FEATURES = [
  ["Knowledge-lift quiz (pre/post, anonymous aggregate)", "Cuestionario de conocimiento (antes/después, agregado anónimo)"],
  ["Anonymized aggregate reporting (k-anonymized counts)", "Reportes agregados anonimizados (recuentos k-anonimizados)"],
  ["Complaint-form worksheet (TX grievance / CA complaint fields)", "Hoja de preparación de queja (campos de TX / CA)"],
  ["Zero-knowledge vault for local mode (AES-GCM)", "Bóveda de conocimiento cero para modo local (AES-GCM)"],
  ["Upload integrity scan (FR-2.4)", "Escaneo de integridad de archivos (FR-2.4)"],
  ["Voice-note-to-text quick log (FR-2.6)", "Notas de voz a texto en registro rápido (FR-2.6)"],
  ["CA county fee-arbitration program directory", "Directorio de arbitraje de honorarios por condado (CA)"],
] as const;

export default function StatusPage() {
  const now = new Date();
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="lg-eyebrow">LexGuard</p>
      <h1 className="lg-display mt-2 text-3xl">Service status</h1>
      <p className="mt-2 text-muted-foreground">
        Operational target 99.5% monthly uptime. This page is static and contains no user data.
      </p>

      <section className="lg-panel mt-8 p-5">
        <p className="flex items-center gap-2 font-medium">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
          All systems operational
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Machine-readable liveness</dt>
            <dd>
              <a className="text-primary underline underline-offset-2" href="/api/health">
                GET /api/health
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Rule library version</dt>
            <dd className="font-mono text-[13px]">
              v{RULE_LIBRARY_VERSION} · {RULES.length} rules live
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Jurisdictions</dt>
            <dd>Texas · California (EN/ES)</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Page generated</dt>
            <dd className="font-mono text-[13px]">{now.toISOString().slice(0, 16).replace("T", " ")} UTC</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="lg-display text-xl">Current release — Phase 4</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {PHASE4_FEATURES.map(([en]) => (
            <li key={en}>{en}</li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        LexGuard provides legal information, not legal advice. Incidents affecting service availability are posted here
        with a description and resolution notes.
      </p>
    </main>
  );
}
