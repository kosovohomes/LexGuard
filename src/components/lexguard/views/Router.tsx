"use client";

// Remedy Router — Flow D (PRD 6.4, FR-4)
// Guided questionnaire → channel recommendations with honest limits,
// deadlines, prerequisites, evidence and warnings (incl. TX privilege waiver).
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Compass, ExternalLink, CheckCircle2, XCircle, TriangleAlert, Loader2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { CHANNELS, route, type RouterAnswers } from "@/lib/lexguard/channels";
import { PageTitle } from "@/components/lexguard/AppShell";
import type { ChannelKind } from "@/lib/lexguard/types";

const EMPTY: RouterAnswers = {
  harm: [],
  moneyInvolved: "none",
  lawyerStatus: "unknown",
  discoveredWhen: "n/a",
  grievanceFiled: "n/a",
  goal: "money_back",
};

const HARM_KEYS: { key: string; labelKey: keyof ReturnType<typeof t> }[] = [
  { key: "money_stolen", labelKey: "harm_money_stolen" },
  { key: "unearned_fee", labelKey: "harm_unearned_fee" },
  { key: "fee_dispute", labelKey: "harm_fee_dispute" },
  { key: "abandonment", labelKey: "harm_abandonment" },
  { key: "missed_deadline", labelKey: "harm_missed_deadline" },
  { key: "settled_without_permission", labelKey: "harm_settled" },
  { key: "file_not_returned", labelKey: "harm_file_not_returned" },
  { key: "dishonesty", labelKey: "harm_dishonesty" },
];

export function RouterView({ caseId }: { caseId?: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const state = app.userState ?? "TX";
  const [a, setA] = useState<RouterAnswers>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [openChannel, setOpenChannel] = useState<ChannelKind | null>(null);

  useEffect(() => {
    if (!caseId) return;
    let cancelled = false;
    // Prefill from case facts when linked (FR-4.4 personalized checklist)
    const prefill = () => {
      if (cancelled) return;
      const active = useApp.getState().active;
      if (!active) return;
      const e = active.entries;
      const has = (pred: (x: (typeof e)[number]) => boolean) => e.some(pred);
      const harm = new Set<string>();
      if (has((x) => x.type === "payment" && ["settlement_received", "retainer"].includes((x.data as { kind?: string }).kind ?? ""))) harm.add("money_stolen");
      if (has((x) => x.type === "payment" && (x.data as { notInAgreement?: boolean }).notInAgreement === true)) harm.add("fee_dispute");
      if (has((x) => x.type === "communication" && (x.data as { settledWithoutAuthorization?: boolean }).settledWithoutAuthorization === true)) harm.add("settled_without_permission");
      if (has((x) => x.type === "communication" && (x.data as { requestedFileReturn?: boolean }).requestedFileReturn === true)) harm.add("file_not_returned");
      if (has((x) => x.type === "communication" && ((x.data as { askedToLie?: boolean }).askedToLie === true || (x.data as { guaranteedOutcome?: boolean }).guaranteedOutcome === true || (x.data as { conflictFlag?: boolean }).conflictFlag === true))) harm.add("dishonesty");
      if (has((x) => x.type === "deadline" && (x.data as { status?: string }).status === "missed")) harm.add("missed_deadline");
      if (harm.size) setA((prev) => ({ ...prev, harm: [...harm] }));
    };
    const cur = useApp.getState().active;
    if (!cur || cur.case.id !== caseId) {
      void app.openCase(caseId).then(prefill);
    } else {
      queueMicrotask(prefill);
    }
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  const recs = useMemo(() => (submitted ? route(state, a) : []), [submitted, state, a]);
  const channels = CHANNELS[state];

  const setHarm = (key: string, on: boolean) =>
    setA((prev) => ({ ...prev, harm: on ? [...prev.harm, key] : prev.harm.filter((h) => h !== key) }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title={tr.router} sub={tr.routerIntro} back={caseId ? () => app.back() : undefined} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{tr.q_harm}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {HARM_KEYS.map((h) => (
            <label key={h.key} className="flex items-start gap-2 text-sm rounded-md border p-3 cursor-pointer hover:border-emerald-700">
              <Checkbox className="mt-0.5" checked={a.harm.includes(h.key)} onCheckedChange={(v) => setHarm(h.key, !!v)} />
              <span>{tr[h.labelKey] as string}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{tr.q_money}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {(["none", "fees", "settlement"] as const).map((k) => (
              <Button key={k} size="sm" variant={a.moneyInvolved === k ? "default" : "outline"} className={a.moneyInvolved === k ? "bg-emerald-700" : "justify-start"} onClick={() => setA({ ...a, moneyInvolved: k, discoveredWhen: k === "none" ? "n/a" : a.discoveredWhen === "n/a" ? "within_4y" : a.discoveredWhen, grievanceFiled: k === "none" ? "n/a" : a.grievanceFiled === "n/a" ? "no" : a.grievanceFiled })}>
                {tr[`money_${k === "none" ? "none" : k === "fees" ? "fees" : "settlement"}` as keyof typeof tr] as string}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{tr.q_status}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {(["unknown", "disciplined", "no"] as const).map((k) => (
              <Button key={k} size="sm" variant={a.lawyerStatus === k ? "default" : "outline"} className={a.lawyerStatus === k ? "bg-emerald-700" : "justify-start"} onClick={() => setA({ ...a, lawyerStatus: k })}>
                {tr[`status_${k === "unknown" ? "unknown" : k === "disciplined" ? "disciplined" : "no"}` as keyof typeof tr] as string}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{tr.q_discovered}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {(["within_4y", "over_4y", "n/a"] as const).map((k) => (
              <Button key={k} size="sm" variant={a.discoveredWhen === k ? "default" : "outline"} className={a.discoveredWhen === k ? "bg-emerald-700" : "justify-start"} onClick={() => setA({ ...a, discoveredWhen: k })}>
                {tr[`disc_${k === "within_4y" ? "within" : k === "over_4y" ? "over" : "na"}` as keyof typeof tr] as string}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{tr.q_grievance}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {(["no", "yes", "n/a"] as const).map((k) => (
              <Button key={k} size="sm" variant={a.grievanceFiled === k ? "default" : "outline"} className={a.grievanceFiled === k ? "bg-emerald-700" : "justify-start"} onClick={() => setA({ ...a, grievanceFiled: k })}>
                {tr[`g_${k === "no" ? "no" : k === "yes" ? "yes" : "na"}` as keyof typeof tr] as string}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{tr.q_goal}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(["money_back", "discipline", "resolve_fees", "protect_case"] as const).map((k) => (
            <Button key={k} size="sm" variant={a.goal === k ? "default" : "outline"} className={a.goal === k ? "bg-emerald-700" : ""} onClick={() => setA({ ...a, goal: k })}>
              {tr[`goal_${k === "money_back" ? "money" : k === "discipline" ? "discipline" : k === "resolve_fees" ? "fees" : "protect"}` as keyof typeof tr] as string}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="mb-8">
        <Button size="lg" className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={() => setSubmitted(true)}>
          <Compass className="mr-2 h-4 w-4" /> {tr.seeResults}
        </Button>
      </div>

      {submitted ? (
        <div className="space-y-4">
          {recs.map((r) => {
            const ch = channels[r.kind];
            const expanded = openChannel === r.kind;
            const fitBadge =
              r.fit === "recommended" ? (
                <Badge className="bg-emerald-700">{tr.recommended}</Badge>
              ) : r.fit === "possible" ? (
                <Badge variant="outline" className="text-amber-800 border-amber-300">
                  {tr.possible}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  {tr.notNow}
                </Badge>
              );
            return (
              <Card key={r.kind} className={r.fit === "recommended" ? "border-emerald-700" : ""}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    {fitBadge}
                    <Badge variant="outline">{state}</Badge>
                  </div>
                  <CardTitle className="text-lg">{app.locale === "es" ? ch.name.es : ch.name.en}</CardTitle>
                  <p className="text-sm text-muted-foreground">{app.locale === "es" ? ch.tagline.es : ch.tagline.en}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1.5 text-sm">
                    {(app.locale === "es" && r.reasons.es.length ? r.reasons.es : r.reasons.en).map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>

                  {expanded ? (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <p className="mb-1 text-sm font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700" /> {tr.canDo}
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                          {(app.locale === "es" ? ch.canDo.es : ch.canDo.en).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold flex items-center gap-1.5">
                          <XCircle className="h-4 w-4 text-red-700" /> {tr.cannotDo}
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                          {(app.locale === "es" ? ch.cannotDo.es : ch.cannotDo.en).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold">{tr.prerequisites}</p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                          {(app.locale === "es" ? ch.prerequisites.es : ch.prerequisites.en).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold">{tr.windows}</p>
                        <p className="text-sm">{app.locale === "es" ? ch.windows.es : ch.windows.en}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold">{tr.process}</p>
                        <p className="text-sm">{app.locale === "es" ? ch.process.es : ch.process.en}</p>
                      </div>
                      {ch.regions?.[app.locale]?.length ? (
                        <div>
                          <p className="mb-1 text-sm font-semibold">{tr.routerRegions}</p>
                          <ul className="list-disc space-y-1 pl-5 text-sm">
                            {ch.regions[app.locale].map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                          <p className="mt-1 text-xs text-muted-foreground">{tr.routerRegionsNote}</p>
                        </div>
                      ) : null}
                      {ch.warnings[app.locale].length ? (
                        <Alert variant="destructive">
                          <TriangleAlert className="h-4 w-4" />
                          <AlertDescription>
                            <ul className="list-disc space-y-1 pl-4">
                              {ch.warnings[app.locale].map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      ) : null}
                      <div>
                        <p className="mb-1 text-sm font-semibold">{tr.evidence}</p>
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                          {(app.locale === "es" ? ch.evidence.es : ch.evidence.en).map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ch.links.map((l) => (
                          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1.5">
                              {l.label} <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setOpenChannel(r.kind)}>
                      {tr.process} — {tr.canDo.toLowerCase()} / {tr.cannotDo.toLowerCase()}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {app.activeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        </div>
      ) : null}
    </div>
  );
}
