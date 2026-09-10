"use client";

// Legal & trust pages (Phase 2) — privacy / terms / accessibility (PRD §9.2, §11).
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { LEGAL_DOCS, type LegalSlug } from "@/lib/lexguard/legal";
import { PageTitle } from "@/components/lexguard/AppShell";
import { ReportIssueButton } from "@/components/lexguard/ReportIssueButton";

const SLUGS: LegalSlug[] = ["privacy", "terms", "accessibility"];

export function LegalView({ slug }: { slug?: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const active = (SLUGS.includes(slug as LegalSlug) ? slug : "privacy") as LegalSlug;
  const doc = LEGAL_DOCS[active];
  const bi = (b: { en: string; es: string }) => (app.locale === "es" ? b.es : b.en);

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title={bi(doc.title)} sub={`${tr.legalUpdated}: ${doc.updated}`} />

      <p className="mb-4 rounded-lg border bg-amber-50 text-amber-900 px-4 py-3 text-sm" role="note">
        {tr.legalDraft}
      </p>

      <nav aria-label={tr.legalChoose} className="mb-6 flex flex-wrap gap-2">
        {SLUGS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === active ? "secondary" : "ghost"}
            aria-current={s === active ? "page" : undefined}
            onClick={() => app.navigate({ name: "legal", slug: s })}
          >
            <ScrollText className="h-4 w-4" /> {bi(LEGAL_DOCS[s].title)}
          </Button>
        ))}
      </nav>

      <div className="space-y-6">
        {doc.sections.map((sec, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold">{bi(sec.h)}</h2>
              {sec.p.map((para, j) => (
                <p key={j} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {bi(para)}
                </p>
              ))}
              {sec.list ? (
                <ul className="mt-3 space-y-2">
                  {sec.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                      <span>{bi(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
      <ReportIssueButton slug={slug} />
    </div>
  );
}
