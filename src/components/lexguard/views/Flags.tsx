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
  high: "border-destructive/30 bg-destructive/[0.06]",
  medium: "border-copper/40 bg-copper/[0.08]",
  standard: "border-border/80 bg-card",
};

const SEV_BADGE: Record<Severity, string> = {
  high: "border-destructive/40 text-destructive",
  medium: "border-copper/50 text-copper",
  standard: "border-border text-muted-foreground",
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
    return evaluateCase(a.case, a.entries, a.documents.some((d) => d.tags.includes("fee_agreement")), app.locale);
  }, [app.active, app.locale]);

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
        <div className="rounded-xl border border-dashed border-border bg-card/60 p-10 text-center">
          <ShieldQuestion className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden />
          <p className="mt-3 text-muted-foreground">{tr.noFlags}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {observations.map((o) => (
            <Card key={o.ruleId} className={`shadow-sm ${SEV_STYLE[o.severity]}`}>
              <CardContent className="p-5">
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px] bg-background/80">
                    {o.ruleId}
                  </Badge>
                  <Badge variant="outline" className={`bg-background/80 ${SEV_BADGE[o.severity]}`}>
                    {localizedSeverity(o.severity, app.locale)}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {tr.ruleEngineNote} v{RULE_LIBRARY_VERSION}
                  </span>
                </div>
                <h3 className="flex items-start gap-2 font-semibold leading-snug">
                  <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                  {o.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-foreground/90">{o.text}</p>
                <div className="mt-4 text-xs space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{tr.cites}:</span> <span className="font-mono">{o.citations.join("; ")}</span>
                  </p>
                  <p className="font-medium text-foreground/80">{tr.evidenceTitle}:</p>
                  <ul className="space-y-1">
                    {o.evidence.map((e, i) => (
                      <li key={i} className="flex gap-1.5 text-muted-foreground">
                        <span aria-hidden className="text-primary">—</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-medium">{tr.channelsTitle}:</span>
                  {o.channels.map((ch) => (
                    <Badge key={ch} variant="secondary" className="bg-background/80">
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
        <Button className="gap-2 shadow-sm" onClick={() => app.navigate({ name: "router", caseId })}>
          {tr.runRouter} <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => app.navigate({ name: "dossier", caseId })}>
          <Radar className="h-4 w-4" /> {tr.dossier}
        </Button>
      </div>
    </div>
  );
}
