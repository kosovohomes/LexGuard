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
  stats: { users: number; cases: number; entries: number; documents: number; dossiers: number; rulesLive: number; ruleLibraryVersion: string };
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
            </p>
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
