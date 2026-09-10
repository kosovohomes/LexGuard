"use client";

// Search view (Phase 3, PRD §13 "OCR search quality") — one search box over all of
// the user's cases, journal entries, and documents (including text extracted from
// PDFs/images), plus the static rights guides. Account mode queries /api/search
// (same isomorphic engine, server-side); every other mode searches in the browser.
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search as SearchIcon, Landmark, FileText, Shield, FolderOpen, BookOpen, MessageSquare, CalendarClock, Handshake, NotebookPen } from "lucide-react";
import { useApp, type View } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { searchDocs, type SearchHit, type SearchDoc, type SnippetPart } from "@/lib/lexguard/search";
import { GUIDES } from "@/lib/lexguard/guides";
import { localStore } from "@/lib/lexguard/local";
import { api } from "@/lib/lexguard/api";
import { PageTitle } from "@/components/lexguard/AppShell";

function Parts({ parts }: { parts: SnippetPart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded bg-copper/20 px-0.5 font-semibold text-foreground">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

function entryIcon(kind: SearchHit["kind"], type?: string) {
  if (kind === "case") return <Shield className="h-4 w-4" />;
  if (kind === "document") return <FileText className="h-4 w-4" />;
  if (kind === "guide") return <BookOpen className="h-4 w-4" />;
  switch (type) {
    case "communication":
      return <MessageSquare className="h-4 w-4" />;
    case "payment":
      return <Landmark className="h-4 w-4" />;
    case "document":
      return <FileText className="h-4 w-4" />;
    case "promise":
      return <Handshake className="h-4 w-4" />;
    case "deadline":
      return <CalendarClock className="h-4 w-4" />;
    default:
      return <NotebookPen className="h-4 w-4" />;
  }
}

// Guide corpus for the active locale (searched client-side in every mode)
function guideDocs(locale: "en" | "es"): SearchDoc[] {
  const L = locale;
  return GUIDES.map((g) => {
    const chunks: string[] = [g.summary[L]];
    for (const s of g.sections) {
      chunks.push(s.h[L]);
      for (const p of s.p) chunks.push(p[L]);
      for (const item of s.list ?? []) chunks.push(item[L]);
    }
    for (const notes of Object.values(g.stateNotes ?? {})) {
      for (const n of notes ?? []) {
        chunks.push(n.h[L]);
        for (const p of n.p) chunks.push(p[L]);
        for (const item of n.list ?? []) chunks.push(item[L]);
      }
    }
    return {
      id: `guide:${g.slug}`,
      kind: "guide" as const,
      type: "guide",
      title: g.title[L],
      text: chunks.join("\n"),
    };
  });
}

const GROUP_ORDER: SearchHit["kind"][] = ["case", "entry", "document", "guide"];

export function SearchView() {
  const app = useApp();
  const tr = t(app.locale);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runSearch = useMemo(
    () =>
      async (query: string) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
          setHits([]);
          setSearched(false);
          return;
        }
        setBusy(true);
        try {
          // data hits
          let dataHits: SearchHit[] = [];
          if (app.mode === "account") {
            const res = await api.search(trimmed);
            dataHits = res.hits;
          } else {
            dataHits = searchDocs(localStore.searchDocs(), trimmed, 30);
          }
          // guide hits (static content, always client-side)
          const gHits = searchDocs(guideDocs(app.locale), trimmed, 10);
          const merged = [...dataHits, ...gHits];
          setHits(merged);
          setSearched(true);
        } catch {
          setHits([]);
          setSearched(true);
        } finally {
          setBusy(false);
        }
      },
    [app.mode, app.locale],
  );

  // debounced as-you-type search
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSearch(q), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, runSearch]);

  const openHit = async (hit: SearchHit) => {
    if (hit.kind === "guide") {
      app.navigate({ name: "guide", slug: hit.id.replace("guide:", "") } as View);
      return;
    }
    if (hit.kind === "case") {
      await app.openCase(hit.caseId ?? "");
      app.navigate({ name: "case", caseId: hit.caseId } as View);
      return;
    }
    // entry / document — open the parent case workspace
    if (hit.caseId) {
      await app.openCase(hit.caseId);
      app.navigate({ name: "case", caseId: hit.caseId } as View);
    }
  };

  const grouped = GROUP_ORDER.map((kind) => ({
    kind,
    label:
      kind === "case" ? tr.searchGroupCases : kind === "entry" ? tr.searchGroupEntries : kind === "document" ? tr.searchGroupDocs : tr.searchGroupGuides,
    items: hits.filter((h) => h.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <PageTitle title={tr.searchTitle} sub={tr.searchIntro} />
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr.searchPlaceholder}
          aria-label={tr.searchAction}
          className="pl-9 h-11 text-base"
        />
        {busy ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden /> : null}
      </div>
      <p className="mb-6 text-xs text-muted-foreground">{tr.searchPrivate}</p>

      {!searched ? (
        <p className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">{tr.searchEmpty}</p>
      ) : grouped.length === 0 && !busy ? (
        <p className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">{tr.searchNoResults}</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((g) => (
            <section key={g.kind} aria-label={g.label}>
              <h2 className="lg-eyebrow mb-3">
                {g.label} <span className="font-normal">({g.items.length})</span>
              </h2>
              <div className="space-y-2">
                {g.items.map((h) => (
                  <Card key={h.id} className="border-border/80 transition-all hover:border-primary/40 hover:shadow-sm">
                    <CardContent className="p-4">
                      <button className="w-full text-left" onClick={() => void openHit(h)}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-primary">{entryIcon(h.kind, h.type)}</span>
                          <span className="font-medium">
                            <Parts parts={h.title} />
                          </span>
                          {h.caseLabel ? (
                            <Badge variant="outline" className="text-[11px] font-normal">
                              {tr.searchInCase} {h.caseLabel}
                            </Badge>
                          ) : null}
                          {h.kind === "document" && h.type ? (
                            <Badge variant="secondary" className="text-[11px] font-normal">
                              {h.type}
                            </Badge>
                          ) : null}
                          {h.occurredAt ? (
                            <span className="ml-auto text-[11px] text-muted-foreground">
                              {new Date(h.occurredAt).toLocaleDateString(app.locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          ) : null}
                        </div>
                        {h.snippet.length > 0 ? (
                          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                            <Parts parts={h.snippet} />
                          </p>
                        ) : null}
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
