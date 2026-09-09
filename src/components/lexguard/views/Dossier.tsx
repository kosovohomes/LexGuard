"use client";

// Dossier view — Flow E (PRD 6.5, FR-5)
// Live PDF preview options, editable deterministic narrative, JSON export.
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, FileJson, Info, Loader2, ClipboardCopy } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { evaluateCase } from "@/lib/lexguard/engine";
import { generateNarrative } from "@/lib/lexguard/narrative";
import { buildDossierPdf } from "@/lib/lexguard/pdf";
import { buildWorksheet, worksheetText } from "@/lib/lexguard/formsheet";
import { localStore } from "@/lib/lexguard/local";
import { PageTitle } from "@/components/lexguard/AppShell";
import type { EntryData } from "@/lib/lexguard/types";

export function DossierView({ caseId }: { caseId: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [unbranded, setUnbranded] = useState(false);
  const [includeWorksheet, setIncludeWorksheet] = useState(true);
  const [copiedWs, setCopiedWs] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!app.active || app.active.case.id !== caseId) {
      void app.openCase(caseId).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [caseId]);

  const observations = useMemo(() => {
    const a = app.active;
    if (!a) return [];
    return evaluateCase(a.case, a.entries, a.documents.some((d) => d.tags.includes("fee_agreement")), app.locale);
  }, [app.active, app.locale]);

  // Deterministic narrative draft — regenerate unless user edited
  useEffect(() => {
    const a = app.active;
    if (!a || touched) return;
    setNarrative(generateNarrative(a.case, a.entries, observations, app.locale));
  }, [app.active, app.locale, touched]);

  const downloadPdf = async () => {
    const a = app.active;
    if (!a) return;
    setBusy(true);
    try {
      const doc = buildDossierPdf(a.case, a.entries, a.documents, observations, narrative, app.locale, { includeDocs, unbranded, includeWorksheet });
      doc.save(`dossier-${a.case.attorneyName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`);
      await app.recordDossier(caseId, unbranded);
    } finally {
      setBusy(false);
    }
  };

  const downloadJson = () => {
    const a = app.active;
    if (!a) return;
    let payload: unknown;
    if (app.mode === "account") {
      payload = { format: "lexguard-case-v1", generatedAt: new Date().toISOString(), ruleLibraryVersion: "1.0.0", ...a };
    } else {
      const local = localStore.getCase(caseId);
      payload = { format: "lexguard-case-v1", generatedAt: new Date().toISOString(), ruleLibraryVersion: "1.0.0", ...(local ?? a) };
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lexguard-case-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyWorksheet = async () => {
    const a2 = app.active;
    if (!a2) return;
    const ws = buildWorksheet(a2.case, a2.entries, a2.documents, observations, app.locale);
    try {
      await navigator.clipboard.writeText(worksheetText(ws, app.locale));
      setCopiedWs(true);
      setTimeout(() => setCopiedWs(false), 2500);
    } catch {
      /* clipboard unavailable — the PDF appendix carries the same content */
    }
  };

  const a = app.active;

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title={tr.dossier} sub={tr.dossierIntro} back={() => app.back()} />

      {!a ? (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {tr.loading}
        </p>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{a.case.attorneyName}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                {tr.entriesCount}: <span className="font-semibold">{a.entries.length}</span>
              </p>
              <p>
                {tr.documents}: <span className="font-semibold">{a.documents.length}</span>
              </p>
              <p>
                {tr.secFlags}: <span className="font-semibold">{observations.length}</span>
              </p>
              <p>
                {tr.totalPaid}: <span className="font-semibold">${a.entries.filter((e: EntryData) => e.type === "payment").reduce((s, e) => s + ((e.data as { amount?: number }).amount ?? 0), 0).toLocaleString()}</span>
              </p>
            </CardContent>
          </Card>

          <div className="mb-6 space-y-3 rounded-lg border p-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={includeDocs} onCheckedChange={(v) => setIncludeDocs(!!v)} />
              {tr.includeDocs}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={unbranded} onCheckedChange={(v) => setUnbranded(!!v)} />
              {tr.unbranded}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={includeWorksheet} onCheckedChange={(v) => setIncludeWorksheet(!!v)} />
              {tr.worksheetToggle}
            </label>
            <p className="text-xs text-muted-foreground">{tr.worksheetHint}</p>
            <p className="text-xs text-muted-foreground">{tr.printNote}</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{tr.narrative}</CardTitle>
              <p className="text-sm text-muted-foreground">{tr.narrativeHint}</p>
            </CardHeader>
            <CardContent>
              <Textarea rows={14} value={narrative} onChange={(e) => { setNarrative(e.target.value); setTouched(true); }} className="font-mono text-xs" aria-label={tr.narrative} />
              <p className="mt-2 text-xs text-muted-foreground">{tr.complaintCaption}</p>
            </CardContent>
          </Card>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{tr.redFlagsIntro}</AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2 bg-emerald-700 hover:bg-emerald-800" disabled={busy} onClick={() => void downloadPdf()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} {tr.downloadPdf}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={downloadJson}>
              <FileJson className="h-4 w-4" /> {tr.downloadJson}
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => void copyWorksheet()}>
              <ClipboardCopy className="h-4 w-4" /> {copiedWs ? tr.worksheetCopied : tr.worksheetCopy}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
