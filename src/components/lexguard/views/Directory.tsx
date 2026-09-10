"use client";

// Referral directory (FR-7) — static vetted listings, no paid placement.
// Phase 2: search, kind filters, phones, verified dates.
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, LifeBuoy, Phone, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { REFERRALS, KIND_LABELS, DIRECTORY_VERIFIED } from "@/lib/lexguard/directory";
import { PageTitle } from "@/components/lexguard/AppShell";

type Kind = keyof typeof KIND_LABELS;

export function DirectoryView() {
  const app = useApp();
  const tr = t(app.locale);
  const state = app.userState;
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind | "all">("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERRALS.filter((r) => (!state || r.states.includes(state)) && (kind === "all" || r.kind === kind))
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.note.en.toLowerCase().includes(q) || r.note.es.toLowerCase().includes(q));
  }, [state, kind, query]);

  const kinds = Object.keys(KIND_LABELS) as Kind[];

  return (
    <div>
      <PageTitle title={tr.directoryTitle} sub={tr.directoryIntro} />

      <p className="mb-5 flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-sm" role="note">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="text-foreground/90">{tr.dirNoPlacement}</span>
      </p>

      <div className="mb-4 space-y-2.5">
        <label htmlFor="dir-search" className="sr-only">
          {tr.dirSearch}
        </label>
        <Input
          id="dir-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr.dirSearch}
          className="max-w-md h-10 bg-card"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={tr.dirAll}>
          <Button
            size="sm"
            variant="outline"
            aria-pressed={kind === "all"}
            className={`h-8 rounded-full ${kind === "all" ? "border-primary/30 bg-primary/10 text-primary font-semibold" : "bg-card text-muted-foreground"}`}
            onClick={() => setKind("all")}
          >
            {tr.dirAll}
          </Button>
          {kinds.map((k) => (
            <Button
              key={k}
              size="sm"
              variant="outline"
              aria-pressed={kind === k}
              className={`h-8 rounded-full ${kind === k ? "border-primary/30 bg-primary/10 text-primary font-semibold" : "bg-card text-muted-foreground"}`}
              onClick={() => setKind(kind === k ? "all" : k)}
            >
              {KIND_LABELS[k][app.locale]}
            </Button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {tr.dirCount.replace("{n}", String(list.length))}
      </p>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">{tr.dirNoResults}</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((r) => (
            <Card key={r.name} className="border-border/80 transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold leading-snug">{r.name}</h3>
                  </div>
                  <Badge variant="outline" className="shrink-0">{KIND_LABELS[r.kind][app.locale]}</Badge>
                </div>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{app.locale === "es" ? r.note.es : r.note.en}</p>
                <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2"
                  >
                    {r.url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                  </a>
                  {r.phone ? (
                    <a href={`tel:${r.phone.replace(/-/g, "")}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      <Phone className="h-3 w-3" /> {r.phone}
                    </a>
                  ) : null}
                  <div className="flex gap-1">
                    {r.states.map((s) => (
                      <Badge key={s} variant="secondary" className="font-mono text-[11px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground/80">
                  {tr.dirVerified}: {r.verified}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        {tr.dirVerified}: {DIRECTORY_VERIFIED}
      </p>
    </div>
  );
}
