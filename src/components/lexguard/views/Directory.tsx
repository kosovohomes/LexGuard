"use client";

// Referral directory (FR-7) — static vetted listings, no paid placement
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, LifeBuoy } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { REFERRALS, KIND_LABELS } from "@/lib/lexguard/directory";
import { PageTitle } from "@/components/lexguard/AppShell";

export function DirectoryView() {
  const app = useApp();
  const tr = t(app.locale);
  const state = app.userState;
  const list = REFERRALS.filter((r) => !state || r.states.includes(state));

  return (
    <div>
      <PageTitle title={tr.directoryTitle} sub={tr.directoryIntro} />
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((r) => (
          <Card key={r.name}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-semibold">{r.name}</h3>
                </div>
                <Badge variant="outline">{KIND_LABELS[r.kind][app.locale]}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{app.locale === "es" ? r.note.es : r.note.en}</p>
              <div className="mt-3 flex items-center gap-3">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-800 hover:underline">
                  {r.url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                </a>
                <div className="flex gap-1">
                  {r.states.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
