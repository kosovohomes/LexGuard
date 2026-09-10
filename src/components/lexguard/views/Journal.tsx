"use client";

// Journal — case list + creation (PRD FR-2.1, Flow B)
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FolderOpen, FileText, ArrowRight, CalendarClock, Trash2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { PageTitle, StateBadge } from "@/components/lexguard/AppShell";
import type { CaseType } from "@/lib/lexguard/types";

const CASE_TYPES: { value: CaseType; en: string; es: string }[] = [
  { value: "family", en: "Family law", es: "Derecho familiar" },
  { value: "personal_injury", en: "Personal injury", es: "Lesiones personales" },
  { value: "criminal", en: "Criminal defense", es: "Defensa criminal" },
  { value: "immigration", en: "Immigration", es: "Inmigración" },
  { value: "probate", en: "Probate", es: "Sucesiones" },
  { value: "business", en: "Business", es: "Negocios" },
  { value: "other", en: "Other", es: "Otro" },
];

export function JournalView() {
  const app = useApp();
  const tr = t(app.locale);
  const [open, setOpen] = useState(false);
  const [attorney, setAttorney] = useState("");
  const [firm, setFirm] = useState("");
  const [type, setType] = useState<CaseType>("family");
  const [start, setStart] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void app.loadCases();
  }, []);

  const create = async () => {
    setBusy(true);
    try {
      const c = await app.createCase({ attorneyName: attorney, firm: firm || null, caseType: type, state: app.userState ?? "TX", engagementStart: start || null });
      setOpen(false);
      setAttorney("");
      setFirm("");
      setStart("");
      await app.openCase(c.id);
      app.navigate({ name: "case", caseId: c.id });
    } finally {
      setBusy(false);
    }
  };

  // Upcoming deadlines across cases (FR-2.5 in-app reminders)
  const upcoming = app.cases.flatMap((c) => []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle title={tr.navJournal} sub={tr.tagline} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5 mb-8">
              <Plus className="h-4 w-4" /> {tr.createCase}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="lg-display text-xl">{tr.createCase}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="att">{tr.attorneyName}</Label>
                <Input id="att" value={attorney} onChange={(e) => setAttorney(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="firm">{tr.firm}</Label>
                <Input id="firm" value={firm} onChange={(e) => setFirm(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{tr.caseType}</Label>
                <Select value={type} onValueChange={(v) => setType(v as CaseType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CASE_TYPES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {app.locale === "es" ? c.es : c.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="start">
                  {tr.engagementStart} <span className="text-muted-foreground">({tr.optional})</span>
                </Label>
                <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <Button className="w-full" disabled={!attorney || busy} onClick={() => void create()}>
                {tr.save}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {app.cases.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden />
          <p className="mt-3 text-muted-foreground">{tr.noCases}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {app.cases.map((c) => (
            <Card
              key={c.id}
              className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm"
              onClick={() => {
                void app.openCase(c.id);
                app.navigate({ name: "case", caseId: c.id });
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="lg-eyebrow">{tr.caseFor}</p>
                    <h3 className="lg-display text-xl mt-1 leading-snug">{c.attorneyName}</h3>
                    {c.firm ? <p className="text-sm text-muted-foreground mt-0.5">{c.firm}</p> : null}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StateBadge state={c.state} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      aria-label={tr.trashMove}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(tr.trashConfirm)) void app.trashCase(c.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {c._count?.entries ?? 0} {tr.entriesCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" /> {c._count?.documents ?? 0} {tr.documents.toLowerCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 capitalize">
                    <CalendarClock className="h-3 w-3" /> {c.status === "active" ? tr.statusActive : tr.statusEnded}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {upcoming.length > 0 ? <div /> : null}
    </div>
  );
}
