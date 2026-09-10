"use client";

// Guides — guide library + reader (PRD FR-1, Flow A)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CalendarCheck } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { GUIDES, guideBySlug } from "@/lib/lexguard/guides";
import { ReportIssueButton } from "@/components/lexguard/ReportIssueButton";
import { PageTitle } from "@/components/lexguard/AppShell";

export function GuidesView() {
  const app = useApp();
  const tr = t(app.locale);
  const state = app.userState;

  return (
    <div>
      <PageTitle title={tr.navGuides} sub={tr.stateNote} />
      {!state ? <p className="mb-4 text-sm text-copper font-medium">{tr.selectStateFirst}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Card
            key={g.slug}
            className="group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
            onClick={() => app.navigate({ name: "guide", slug: g.slug })}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">{state ?? "TX/CA"}</Badge>
              </div>
              <CardTitle className="text-base leading-snug font-semibold">{app.locale === "es" ? g.title.es : g.title.en}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{app.locale === "es" ? g.summary.es : g.summary.en}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {g.minutes} {tr.minutes}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GuideView({ slug }: { slug: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const g = guideBySlug(slug);
  if (!g) return <p>{tr.error}</p>;
  const state = app.userState ?? "TX";
  const notes = g.stateNotes[state] ?? [];

  return (
    <article className="mx-auto max-w-3xl">
      <PageTitle
        title={app.locale === "es" ? g.title.es : g.title.en}
        sub={app.locale === "es" ? g.summary.es : g.summary.en}
        back={() => app.back()}
      />
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono text-[11px]">{state}</Badge>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {g.minutes} {tr.minutes}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarCheck className="h-3 w-3" /> {tr.lastReviewed}: {g.lastReviewed}
        </span>
      </div>
      <p className="lg-eyebrow mb-8">{tr.reviewer}: {app.locale === "es" ? g.reviewer.es : g.reviewer.en}</p>

      <div className="space-y-9">
        {g.sections.map((s, i) => (
          <section key={i}>
            <h2 className="lg-display text-xl mb-3">{app.locale === "es" ? s.h.es : s.h.en}</h2>
            {s.p.map((para, j) => (
              <p key={j} className="text-[15px] leading-[1.75] mb-3 text-foreground/90">
                {app.locale === "es" ? para.es : para.en}
              </p>
            ))}
            {s.list ? (
              <ul className="mt-3 space-y-2">
                {s.list.map((li, j) => (
                  <li key={j} className="flex gap-2.5 text-[15px] leading-[1.7]">
                    <span className="text-primary mt-0.5" aria-hidden>
                      —
                    </span>
                    <span>{app.locale === "es" ? li.es : li.en}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {notes.length > 0 ? (
          <aside className="rounded-xl border border-primary/25 bg-primary/[0.06] p-5" aria-label={`${state} notes`}>
            {notes.map((n, i) => (
              <div key={i} className={i > 0 ? "mt-4" : ""}>
                <h3 className="font-semibold text-primary mb-1.5">
                  {state} — {app.locale === "es" ? n.h.es : n.h.en}
                </h3>
                {n.p.map((para, j) => (
                  <p key={j} className="text-sm leading-relaxed mb-1.5 text-foreground/90">
                    {app.locale === "es" ? para.es : para.en}
                  </p>
                ))}
              </div>
            ))}
          </aside>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button onClick={() => app.navigate({ name: "journal" })}>{tr.openJournal}</Button>
        <Button variant="outline" onClick={() => app.navigate({ name: "router" })}>
          {tr.navRouter}
        </Button>
        <ReportIssueButton slug={g.slug} />
      </div>
    </article>
  );
}
