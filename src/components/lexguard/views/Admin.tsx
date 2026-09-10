"use client";

// Admin — rule governance & aggregate stats (PRD FR-8, FR-3.4, §14)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/lexguard/store";
import { api } from "@/lib/lexguard/api";
import { t } from "@/lib/lexguard/i18n";
import { PageTitle } from "@/components/lexguard/AppShell";

interface AdminData {
  stats: {
    users: number;
    cases: number;
    entries: number;
    documents: number;
    dossiers: number;
    rulesLive: number;
    ruleLibraryVersion: string;
    surveys: { total: number; filed: number; actionRate: number | null };
    quiz: { preCount: number; postCount: number; preAvg: number | null; postAvg: number | null; lift: number | null };
    patterns: {
      totalCasesConsidered: number;
      casesWithObservations: number;
      minCell: number;
      cells: Record<string, Record<string, number | null>>;
    };
    reports: {
      total: number;
      last30d: number;
      recent: { id: string; category: string; slug: string | null; locale: string; state: string | null; message: string | null; createdAt: string }[];
    };
  };
  rules: { id: string; trigger: string; states: string[]; severity: string; title: string; reviewer: string | null; reviewedAt: string | null; effectiveFrom: string }[];
}

export function AdminView() {
  const app = useApp();
  const tr = t(app.locale);
  const [code, setCode] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState(false);

  const load = async () => {
    setError(false);
    try {
      setData(await api.adminStats(code));
    } catch {
      setError(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title={tr.adminTitle} />
      {!data ? (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-base">{tr.adminGate}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input type="password" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void load()} aria-label={tr.adminGate} />
            <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => void load()}>
              →
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold">{tr.aggregate}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: tr.totalUsers, v: data.stats.users },
                { label: tr.totalCases, v: data.stats.cases },
                { label: tr.totalEntries, v: data.stats.entries },
                { label: tr.totalDocs, v: data.stats.documents },
                { label: tr.totalDossiers, v: data.stats.dossiers },
                { label: tr.rulesCount, v: data.stats.rulesLive },
                { label: tr.adminActionRate, v: data.stats.surveys?.actionRate != null ? `${Math.round(data.stats.surveys.actionRate * 100)}%` : "—" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{s.v}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {tr.ruleVersion}: v{data.stats.ruleLibraryVersion}
              {data.stats.surveys ? ` · ${tr.adminSurveyDetail.replace("{filed}", String(data.stats.surveys.filed)).replace("{exports}", String(data.stats.dossiers))}` : ""}
            </p>
          </section>

          {/* PRD §14 knowledge lift — anonymous pre/post averages */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">{tr.adminQuizTitle}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: tr.adminQuizPre, v: data.stats.quiz?.preAvg != null ? `${data.stats.quiz.preAvg.toFixed(1)}/5` : "—", sub: `${data.stats.quiz?.preCount ?? 0}` },
                { label: tr.adminQuizPost, v: data.stats.quiz?.postAvg != null ? `${data.stats.quiz.postAvg.toFixed(1)}/5` : "—", sub: `${data.stats.quiz?.postCount ?? 0}` },
                {
                  label: tr.adminQuizLift,
                  v: data.stats.quiz?.lift != null ? `${data.stats.quiz.lift >= 0 ? "+" : ""}${data.stats.quiz.lift.toFixed(1)}` : "—",
                  sub: "",
                },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{s.v}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    {s.sub ? <p className="text-[10px] text-muted-foreground">n={s.sub}</p> : null}
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{tr.adminQuizNote}</p>
          </section>

          {/* PRD §13 Phase 4 — anonymized aggregate reporting (k-anonymized counts) */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">{tr.adminPatternsTitle}</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              {tr.adminPatternsIntro.replace("{considered}", String(data.stats.patterns?.totalCasesConsidered ?? 0)).replace("{min}", String(data.stats.patterns?.minCell ?? 5))}
            </p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="p-3">{tr.adminPatternCat}</th>
                    <th className="p-3">TX</th>
                    <th className="p-3">CA</th>
                    <th className="p-3">FL</th>
                    <th className="p-3">NY</th>
                    <th className="p-3">AZ</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.stats.patterns?.cells?.TX ?? {}).map(([cat]) => (
                    <tr key={cat} className="border-t">
                      <td className="p-3">{tr[`pattern_${cat}` as keyof typeof tr]}</td>
                      {(["TX", "CA", "FL", "NY", "AZ"] as const).map((st) => (
                        <td key={st} className="p-3">{data.stats.patterns.cells[st]?.[cat] ?? "\u2014"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{tr.adminPatternsNote}</p>
          </section>

          {/* PRD §14 trust metric — anonymous content-correction requests */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">{tr.adminReportsTitle}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{tr.adminReportsIntro}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{data.stats.reports?.last30d ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{tr.adminReports30d}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{data.stats.reports?.total ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{tr.adminReportsTotal}</p>
                </CardContent>
              </Card>
            </div>
            {(data.stats.reports?.recent?.length ?? 0) > 0 ? (
              <ul className="mt-3 space-y-2">
                {data.stats.reports.recent.map((r) => (
                  <li key={r.id} className="rounded-lg border p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="capitalize">{r.category}</Badge>
                      {r.slug ? <code className="text-xs">{r.slug}</code> : null}
                      <span className="text-xs text-muted-foreground">
                        {r.locale.toUpperCase()}{r.state ? ` · ${r.state}` : ""} · {r.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    {r.message ? <p className="mt-1 text-sm text-muted-foreground">{r.message}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{tr.adminReportsEmpty}</p>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">{tr.ruleLibrary}</h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Trigger</th>
                    <th className="p-3">States</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">{tr.reviewStatus}</th>
                    <th className="p-3">Effective</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rules.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3">{r.title}</td>
                      <td className="p-3">{r.states.join(", ")}</td>
                      <td className="p-3 capitalize">{r.severity}</td>
                      <td className="p-3">
                        {r.reviewer ? (
                          <Badge className="bg-emerald-700">
                            {r.reviewer} · {r.reviewedAt}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-700">
                            {tr.pending}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{r.effectiveFrom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{tr.demoNote}</p>
          </section>
        </div>
      )}
      {error ? <p className="mt-2 text-sm text-red-700">{tr.wrongPin}</p> : null}
      <p className="mt-4 text-xs text-muted-foreground">{app.locale === "es" ? "Código de demostración: lexguard-admin" : "Demo passcode: lexguard-admin"}</p>
    </div>
  );
}
