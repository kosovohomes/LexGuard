"use client";

// Red-flag observations panel — Flow C (PRD 6.3)
// Neutral, conditional output citing rules; links to evidence + channels.
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Radar, Info, Loader2, ArrowRight, ShieldQuestion } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { evaluateCase } from "@/lib/lexguard/engine";
import { RULE_LIBRARY_VERSION, localizedSeverity } from "@/lib/lexguard/rules";
import { PageTitle } from "@/components/lexguard/AppShell";
import type { Severity } from "@/lib/lexguard/types";

const SEV_STYLE: Record<Severity, string> = {
  high: "bg-red-100 text-red-900 border-red-200",
  medium: "bg-amber-100 text-amber-900 border-amber-200",
  standard: "bg-slate-100 text-slate-800 border-slate-200",
};

export function FlagsView({ caseId }: { caseId: string }) {
  const app = useApp();
  const tr = t(app.locale);

  useEffect(() => {
    if (!app.active || app.active.case.id !== caseId) {
      void app.openCase(caseId);
    }
  }, [caseId]);

  const observations = useMemo(() => {
    const a = app.active;
    if (!a) return [];
    return evaluateCase(a.case, a.entries, a.documents.some((d) => d.tags.includes("fee_agreement")));
  }, [app.active]);

  if (app.activeLoading || !app.active) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> {tr.loading}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title={tr.redFlags} back={() => app.back()} />
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>{tr.redFlagsIntro}</AlertDescription>
      </Alert>

      {observations.length === 0 ? (
        <p className="text-muted-foreground">{tr.noFlags}</p>
      ) : (
        <div className="space-y-4">
          {observations.map((o) => (
            <Card key={o.ruleId} className={`border ${SEV_STYLE[o.severity]}`}>
              <CardContent className="p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-background">
                    {o.ruleId}
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    {localizedSeverity(o.severity, app.locale)}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {tr.ruleEngineNote} v{RULE_LIBRARY_VERSION}
                  </span>
                </div>
                <h3 className="flex items-start gap-2 font-semibold">
                  <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0" />
                  {o.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{o.text}</p>
                <div className="mt-3 text-xs">
                  <p className="font-medium">
                    {tr.cites}: {o.citations.join("; ")}
                  </p>
                  <p className="mt-2 font-medium">{tr.evidenceTitle}:</p>
                  <ul className="mt-1 space-y-1">
                    {o.evidence.map((e, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span aria-hidden>•</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-medium">{tr.channelsTitle}:</span>
                  {o.channels.map((ch) => (
                    <Badge key={ch} variant="secondary" className="bg-background">
                      {ch === "discipline" ? tr.navRouter : ch === "csf" ? "CSF" : ch === "fee" ? tr.navRouter : tr.navRouter}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button className="gap-2 bg-emerald-700 hover:bg-emerald-800" onClick={() => app.navigate({ name: "router", caseId })}>
          {tr.runRouter} <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => app.navigate({ name: "dossier", caseId })}>
          <Radar className="h-4 w-4" /> {tr.dossier}
        </Button>
      </div>
    </div>
  );
}
