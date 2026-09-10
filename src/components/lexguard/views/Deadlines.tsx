"use client";

// Deadlines & key windows (Phase 2) — cross-case digest of user-set deadlines
// (FR-2.5) plus informational statutory windows computed from journal facts.
// Read-only: it never mutates the store's `active` case.
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, AlertTriangle, Clock, Info, ExternalLink, FolderOpen, CalendarPlus } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { computeDeadlines, type DeadlineInsight } from "@/lib/lexguard/deadlines";
import { downloadIcs } from "@/lib/lexguard/ics";
import type { CaseData, EntryData } from "@/lib/lexguard/types";
import { api, normalizeEntry } from "@/lib/lexguard/api";
import { localStore } from "@/lib/lexguard/local";
import { PageTitle } from "@/components/lexguard/AppShell";

function loadCaseReadonly(id: string, mode: string) {
  if (mode === "account") {
    return api.getCase(id).then((res) => ({
      case: res.case,
      entries: res.entries.map(normalizeEntry),
    }));
  }
  const full = localStore.getCase(id);
  return Promise.resolve(full ? { case: full.case, entries: full.entries } : null);
}

export function DeadlinesView() {
  const app = useApp();
  const tr = t(app.locale);
  const [items, setItems] = useState<DeadlineInsight[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await app.loadCases();
      const cases = useApp.getState().cases;
      if (cases.length === 0) {
        if (!cancelled) setItems([]);
        return;
      }
      type LoadedCase = { case: CaseData; entries: EntryData[] };
      const loaded = (await Promise.all(cases.map((c) => loadCaseReadonly(c.id, useApp.getState().mode ?? "local")))).filter(
        (x): x is LoadedCase => Boolean(x),
      );
      if (!cancelled) setItems(computeDeadlines(loaded, new Date(), app.locale));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [app.mode, app.locale, app.cases.length]);

  const toneBadge = (it: DeadlineInsight) => {
    if (it.tone === "overdue")
      return (
        <Badge className="gap-1 bg-red-700 text-white">
          <AlertTriangle className="h-3 w-3" /> {tr.dlOverdue}
        </Badge>
      );
    if (it.tone === "soon")
      return (
        <Badge className="gap-1 bg-amber-100 text-amber-900 border border-amber-300">
          <Clock className="h-3 w-3" /> {tr.dlSoon}
        </Badge>
      );
    return (
      <Badge variant="outline" className="gap-1">
        {it.kind === "statutory_window" ? <Info className="h-3 w-3" /> : <CalendarClock className="h-3 w-3" />}
        {it.kind === "statutory_window" ? tr.dlInfo : tr.dlUpcoming}
      </Badge>
    );
  };

  const fmtWhen = (iso: string) =>
    new Date(iso).toLocaleDateString(app.locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  if (items === null) {
    return <p className="flex items-center gap-2 text-muted-foreground">{tr.loading}</p>;
  }

  if (!app.mode && app.cases.length === 0) {
    return (
      <div>
        <PageTitle title={tr.deadlinesTitle} sub={tr.deadlinesIntro} />
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground flex flex-wrap items-center gap-3">
            {tr.deadlinesNeedStart}
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800" onClick={() => app.navigate({ name: "onboarding" })}>
              {tr.getStarted}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = items.filter((i) => i.kind === "user_deadline");
  const windows = items.filter((i) => i.kind === "statutory_window");

  const exportItem = (it: DeadlineInsight) => (
    <Button size="sm" variant="outline" className="gap-1" onClick={() => downloadIcs([it], app.locale)}>
      <CalendarPlus className="h-3.5 w-3.5" /> {tr.icsExport}
    </Button>
  );

  const renderItem = (it: DeadlineInsight) => (
    <li key={it.id}>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug">{it.title}</h3>
            {toneBadge(it)}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{it.detail}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FolderOpen className="h-3.5 w-3.5" /> {it.caseName}
            </span>
            {it.when ? (
              <span>
                {tr.dlWhen}: {fmtWhen(it.when)}
              </span>
            ) : null}
            <Badge variant="secondary">{it.state}</Badge>
            {it.when ? exportItem(it) : null}
          </div>
        </CardContent>
      </Card>
    </li>
  );

  return (
    <div>
      <PageTitle title={tr.deadlinesTitle} sub={tr.deadlinesIntro} />

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">{tr.deadlinesEmpty}</CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <section aria-label={tr.deadlinesUser}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-xl font-bold">{tr.deadlinesUser}</h2>
              {user.length > 0 ? (
                <Button size="sm" variant="outline" className="gap-1" onClick={() => downloadIcs(user, app.locale)}>
                  <CalendarPlus className="h-3.5 w-3.5" /> {tr.icsExportAll}
                </Button>
              ) : null}
            </div>
            {user.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tr.deadlinesEmpty}</p>
            ) : (
              <ul className="space-y-3">{user.map(renderItem)}</ul>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{tr.icsNote}</p>
          </section>

          <section aria-label={tr.deadlinesWindows}>
            <h2 className="text-xl font-bold mb-3">{tr.deadlinesWindows}</h2>
            {windows.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tr.deadlinesEmpty}</p>
            ) : (
              <ul className="space-y-3">{windows.map(renderItem)}</ul>
            )}
          </section>

          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
            {tr.dlVerify}
          </p>
        </div>
      )}
    </div>
  );
}

