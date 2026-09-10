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

      <p className="mb-5 flex items-start gap-2.5 rounded-xl border border-copper/30 bg-copper/10 px-4 py-3 text-sm" role="note">
        <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
        <span className="text-foreground/85">{tr.legalDraft}</span>
      </p>

      <nav aria-label={tr.legalChoose} className="mb-7 flex flex-wrap gap-2">
        {SLUGS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === active ? "secondary" : "ghost"}
            className={s === active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}
            aria-current={s === active ? "page" : undefined}
            onClick={() => app.navigate({ name: "legal", slug: s })}
          >
            <ScrollText className="h-4 w-4" /> {bi(LEGAL_DOCS[s].title)}
          </Button>
        ))}
      </nav>

      <div className="space-y-5">
        {doc.sections.map((sec, i) => (
          <Card key={i} className="border-border/80">
            <CardContent className="p-5 sm:p-6">
              <h2 className="lg-display text-xl">{bi(sec.h)}</h2>
              {sec.p.map((para, j) => (
                <p key={j} className="mt-3 text-[15px] leading-[1.75] text-foreground/85">
                  {bi(para)}
                </p>
              ))}
              {sec.list ? (
                <ul className="mt-3 space-y-2">
                  {sec.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                      <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
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
