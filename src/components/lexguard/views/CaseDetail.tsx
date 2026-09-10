"use client";

// Case workspace — timeline, logging, money, documents, promises, deadlines,
// case settings (PRD FR-2, Flow B) + links to flags/router/dossier (Flows C–E)
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, MessageSquare, FileText, Landmark, NotebookPen, CalendarClock, Handshake, Upload, Download, Trash2, Radar, Compass, Building2, Loader2, ScanText } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { PageTitle, StateBadge } from "@/components/lexguard/AppShell";
import { EntryForm } from "./EntryForm";
import { extractSupported } from "@/lib/lexguard/extract";
import type { DeadlineData, EntryData, PaymentData, PromiseData } from "@/lib/lexguard/types";

function typeIcon(e: EntryData) {
  switch (e.type) {
    case "communication":
      return (e.data as { channel?: string })?.channel === "email" ? <Mail className="h-4 w-4" /> : (e.data as { channel?: string })?.channel === "text" ? <MessageSquare className="h-4 w-4" /> : <Phone className="h-4 w-4" />;
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

function fmt(d: string | undefined, locale: string) {
  if (!d) return "";
  return new Date(d).toLocaleString(locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function CaseDetailView({ caseId }: { caseId: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const [logOpen, setLogOpen] = useState(false);

  useEffect(() => {
    if (!app.active || app.active.case.id !== caseId) void app.openCase(caseId);
  }, [caseId]);

  const c = app.active?.case;
  const entries = useMemo(() => [...(app.active?.entries ?? [])].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [app.active]);
  const payments = entries.filter((e) => e.type === "payment");
  const totalPaid = payments.reduce((s, e) => s + ((e.data as PaymentData).amount ?? 0), 0);
  const promises = entries.filter((e) => e.type === "promise");
  const deadlines = entries.filter((e) => e.type === "deadline");

  if (app.activeLoading && !c) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> {tr.loading}
      </p>
    );
  }
  if (!c) return <p>{tr.error}</p>;

  return (
    <div>
      <PageTitle
        title={`${tr.caseFor} ${c.attorneyName}`}
        sub={c.firm ?? undefined}
        back={() => app.back()}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StateBadge state={c.state} />
        <Badge variant="outline">{c.status === "active" ? tr.statusActive : tr.statusEnded}</Badge>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 bg-card" onClick={() => app.navigate({ name: "flags", caseId })}>
            <Radar className="h-4 w-4" /> {tr.redFlags}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 bg-card" onClick={() => app.navigate({ name: "router", caseId })}>
            <Compass className="h-4 w-4" /> {tr.router}
          </Button>
          <Button size="sm" className="gap-1.5 shadow-sm" onClick={() => app.navigate({ name: "dossier", caseId })}>
            <FileText className="h-4 w-4" /> {tr.dossier}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="timeline">{tr.timeline}</TabsTrigger>
          <TabsTrigger value="money">{tr.money}</TabsTrigger>
          <TabsTrigger value="documents">{tr.documents}</TabsTrigger>
          <TabsTrigger value="promises">{tr.promises}</TabsTrigger>
          <TabsTrigger value="deadlines">{tr.deadlines}</TabsTrigger>
          <TabsTrigger value="settings">{tr.navSettings}</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-5">
          <div className="mb-5">
            <Dialog open={logOpen} onOpenChange={setLogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-sm">+ {tr.logEntry}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="lg-display text-xl">{tr.logEntry}</DialogTitle>
                </DialogHeader>
                <EntryForm
                  caseId={caseId}
                  onDone={() => {
                    setLogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-10 text-center">
              <NotebookPen className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden />
              <p className="mt-3 text-muted-foreground">{tr.noPromises}</p>
            </div>
          ) : (
            <ol className="relative border-l-2 border-border/70 ml-3 space-y-5">
              {entries.map((e) => (
                <li key={e.id} className="ml-6">
                  <span className="absolute -left-[15px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">{typeIcon(e)}</span>
                  <div className="rounded-xl border border-border/80 bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {tr[`type_${e.type}` as keyof typeof tr]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{fmt(e.occurredAt, app.locale)}</span>
                      {e.edited ? <Badge variant="outline" className="text-[11px] border-copper/40 text-copper">{tr.edited}</Badge> : null}
                      <span className="ml-auto text-[11px] text-muted-foreground" title={tr.immutable}>
                        {tr.immutable}: {fmt(e.createdAt, app.locale)}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" aria-label={tr.delete} onClick={() => void app.removeEntry(e.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="mt-2 font-medium leading-snug">{e.title}</p>
                    {e.body ? <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1 leading-relaxed">{e.body}</p> : null}
                    {e.type === "payment" ? (
                      <p className="mt-1.5 text-sm">
                        <span className="font-semibold">${((e.data as PaymentData).amount ?? 0).toLocaleString()}</span> · {tr.method}: {(e.data as PaymentData).method} · {tr.payee}: {(e.data as PaymentData).payee}
                      </p>
                    ) : null}
                    {e.type === "promise" && (e.data as PromiseData).promisedBy ? (
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {tr.promisedBy}: {fmt((e.data as PromiseData).promisedBy, app.locale)}
                        {(e.data as PromiseData).fulfilled === false ? <span className="ml-2 text-destructive font-medium">{tr.fulfilledNo}</span> : null}
                      </p>
                    ) : null}
                    {e.type === "deadline" ? (
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {tr.deadlineStatus}: {(e.data as DeadlineData).status}
                        {(e.data as DeadlineData).missedAppearance ? <span className="ml-2 text-destructive font-medium">{tr.missedAppearance}</span> : null}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="money" className="mt-5">
          <Card className="lg-hero mb-5 border-0">
            <CardContent className="p-6">
              <p className="lg-eyebrow">{tr.moneySummary}</p>
              <p className="lg-display text-4xl mt-2">
                ${totalPaid.toLocaleString(app.locale === "es" ? "es-MX" : "en-US")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{tr.totalPaid}</p>
            </CardContent>
          </Card>
          {payments.length === 0 ? (
            <p className="text-muted-foreground">{tr.noMoney}</p>
          ) : (
            <div className="space-y-2">
              {payments.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card p-3.5 text-sm">
                  <span className="text-muted-foreground w-28 shrink-0">{fmt(e.occurredAt, app.locale)}</span>
                  <span className="font-medium">{e.title}</span>
                  <span className="font-semibold">${((e.data as PaymentData).amount ?? 0).toLocaleString()}</span>
                  {(e.data as PaymentData).notInAgreement ? <Badge variant="outline" className="border-copper/40 text-copper">{tr.notInAgreement}</Badge> : null}
                  {(e.data as PaymentData).receipt ? <Badge variant="outline">{tr.tag_receipt}</Badge> : null}
                  {(e.data as PaymentData).payee === "attorney_personally" ? <Badge variant="outline" className="border-destructive/40 text-destructive">{tr.pay_personal}</Badge> : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <DocumentsTab caseId={caseId} />
        </TabsContent>

        <TabsContent value="promises" className="mt-5">
          {promises.length === 0 ? (
            <p className="text-muted-foreground">{tr.noPromises}</p>
          ) : (
            <div className="space-y-2">
              {promises.map((e) => (
                <div key={e.id} className="rounded-xl border border-border/80 bg-card p-4">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fmt(e.occurredAt, app.locale)}
                    {(e.data as PromiseData).promisedBy ? ` · ${tr.promisedBy}: ${fmt((e.data as PromiseData).promisedBy, app.locale)}` : ""}
                  </p>
                  {(e.data as PromiseData).fulfilled === false ? <Badge variant="outline" className="mt-2 border-destructive/40 text-destructive">{tr.fulfilledNo}</Badge> : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deadlines" className="mt-5">
          {deadlines.length === 0 ? (
            <p className="text-muted-foreground">{tr.noDeadlines}</p>
          ) : (
            <div className="space-y-2">
              {deadlines.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card p-3.5 text-sm">
                  <span className="text-muted-foreground w-28 shrink-0">{fmt(e.occurredAt, app.locale)}</span>
                  <span className="font-medium">{e.title}</span>
                  <Badge variant="outline">{(e.data as DeadlineData).kind}</Badge>
                  <Badge variant={(e.data as DeadlineData).status === "missed" ? "destructive" : "secondary"}>
                    {(e.data as DeadlineData).status === "missed" ? tr.ds_missed : (e.data as DeadlineData).status === "met" ? tr.ds_met : tr.ds_upcoming}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <CaseSettings caseId={caseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentsTab({ caseId }: { caseId: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const docs = app.active?.documents ?? [];
  const [busy, setBusy] = useState(false);
  const [tag, setTag] = useState("other");
  const [q, setQ] = useState("");
  // Phase 4 — upload integrity scan notices (FR-2.4, neutral wording)
  const [scanNotice, setScanNotice] = useState<string[] | null>(null);
  // Phase 3 — extraction state per document
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [openTextId, setOpenTextId] = useState<string | null>(null);

  const TAGS = ["fee_agreement", "receipt", "invoice", "court", "correspondence", "contract", "other"];

  const runExtract = async (docId: string) => {
    setExtractingId(docId);
    setProgress(0);
    try {
      const res = await app.extractDocText(docId, (p) => setProgress(p));
      setFailedIds((prev) => {
        const next = new Set(prev);
        if (res.ok) next.delete(docId);
        else next.add(docId);
        return next;
      });
    } finally {
      setExtractingId(null);
    }
  };

  const upload = async (file: File) => {
    setBusy(true);
    let newDocId: string | null = null;
    let scanWarn: string[] | null = null;
    try {
      const res = await app.uploadDoc(caseId, file, tag);
      newDocId = res.id;
      if (res.scan.level !== "clean") {
        scanWarn = res.scan.findings.map((f) => app.locale === "es" ? f.text.es : f.text.en);
        if (res.scan.level === "block") newDocId = null;
      }
      if (res.scan.level === "warn" || res.scan.level === "block") setScanNotice(scanWarn);
    } catch (err) {
      const msg = err instanceof Error && err.message === "too_big_local" ? tr.localUploadNote : tr.fileTooBig;
      alert(msg);
    } finally {
      setBusy(false);
    }
    // Phase 3 — auto-extract text for supported uploads (PDF layer / image OCR)
    if (newDocId && extractSupported(file.type, file.name)) void runExtract(newDocId);
  };

  const filtered = docs.filter((d) => d.filename.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      {scanNotice ? (
        <Alert className="border-copper/40 bg-copper/10 text-foreground">
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1">
              {scanNotice.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <button className="mt-1 text-xs underline underline-offset-2" onClick={() => setScanNotice(null)}>
              {tr.cancel}
            </button>
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-card p-4">
        <div className="space-y-1.5">
          <Label>{tr.tags}</Label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAGS.map((x) => (
                <SelectItem key={x} value={x}>
                  {tr[`tag_${x}` as keyof typeof tr]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.currentTarget.value = "";
            }}
          />
          <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {tr.upload}
          </span>
        </label>
        <p className="text-xs text-muted-foreground w-full sm:w-auto sm:flex-1">{app.mode === "local" ? tr.localUploadNote : tr.uploadHint}</p>
        <p className="text-xs text-muted-foreground w-full">{tr.docExtractHint}</p>
      </div>

      <Input placeholder={tr.searchVault} value={q} onChange={(e) => setQ(e.target.value)} aria-label={tr.searchVault} />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">{tr.noDocs}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => {
            const supported = extractSupported(d.mime, d.filename);
            const extracting = extractingId === d.id;
            const searchable = !!d.ocrText;
            return (
              <div key={d.id} className="rounded-xl border border-border/80 bg-card p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">{d.filename}</span>
                  <span className="text-muted-foreground">{Math.max(1, Math.round(d.size / 1024))} KB</span>
                  <div className="flex gap-1">
                    {d.tags.map((x) => (
                      <Badge key={x} variant="outline" className="text-[11px]">
                        {tr[`tag_${x}` as keyof typeof tr] ?? x}
                      </Badge>
                    ))}
                  </div>
                  {searchable ? (
                    <Badge variant="secondary" className="text-[11px] bg-primary/10 text-primary">{tr.docSearchable}</Badge>
                  ) : null}
                  <div className="ml-auto flex items-center gap-1">
                    {supported && !searchable ? (
                      extracting ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> {tr.docExtracting} {progress}%
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => void runExtract(d.id)}>
                          <ScanText className="h-3.5 w-3.5" /> {tr.docExtract}
                        </Button>
                      )
                    ) : null}
                    {searchable ? (
                      <Button variant="ghost" size="sm" className="h-8" aria-expanded={openTextId === d.id} onClick={() => setOpenTextId(openTextId === d.id ? null : d.id)}>
                        {openTextId === d.id ? tr.docHideText : tr.docTextView}
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={tr.download}
                      onClick={() => {
                        if (app.mode === "account") {
                          window.location.href = `/api/documents/${d.id}`;
                        } else {
                          const url = app.docDataUrl(d.id);
                          if (url) {
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = d.filename;
                            a.click();
                          }
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={tr.delete} onClick={() => void app.removeDoc(d.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {failedIds.has(d.id) ? <p className="mt-2 text-xs text-copper">{tr.docExtractFail}</p> : null}
                {searchable && openTextId === d.id ? (
                  <pre className="mt-2.5 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-secondary/70 p-3.5 text-xs font-mono text-foreground/90">{d.ocrText}</pre>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CaseSettings({ caseId }: { caseId: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const c = app.active?.case;
  const [status, setStatus] = useState<"active" | "ended">(c?.status ?? "active");
  const [feeType, setFeeType] = useState(c?.feeType ?? "none");
  const [agreedFeeAmount, setAgreedFeeAmount] = useState(c?.agreedFeeAmount?.toString() ?? "");
  const [contingencyPercent, setContingencyPercent] = useState(c?.contingencyPercent?.toString() ?? "");
  const [engagementEnd, setEngagementEnd] = useState(c?.engagementEnd?.slice(0, 10) ?? "");

  if (!c) return null;
  const iso = (v: string) => (v ? new Date(`${v}T12:00:00`).toISOString() : null);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> {tr.caseStatus} · {tr.feeType}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{tr.caseEndedHelp}</p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{tr.caseStatus}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "active" | "ended")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{tr.statusActive}</SelectItem>
              <SelectItem value="ended">{tr.statusEnded}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="eend">{tr.engagementEnd}</Label>
          <Input id="eend" type="date" value={engagementEnd} onChange={(e) => setEngagementEnd(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{tr.feeType}</Label>
          <Select value={feeType ?? "none"} onValueChange={(v) => setFeeType(v as typeof feeType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="flat">Flat fee</SelectItem>
              <SelectItem value="contingency">Contingency</SelectItem>
              <SelectItem value="none">—</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {feeType === "contingency" ? (
          <div className="space-y-1.5">
            <Label htmlFor="cp">{tr.contingencyPercent}</Label>
            <Input id="cp" type="number" min="0" max="100" value={contingencyPercent} onChange={(e) => setContingencyPercent(e.target.value)} />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="afa">{tr.agreedFeeAmount}</Label>
            <Input id="afa" type="number" min="0" value={agreedFeeAmount} onChange={(e) => setAgreedFeeAmount(e.target.value)} />
          </div>
        )}
        <div className="sm:col-span-2">
          <Button
            onClick={() =>
              void app.updateCase(caseId, {
                status,
                engagementEnd: iso(engagementEnd),
                feeType,
                agreedFeeAmount: agreedFeeAmount ? Number(agreedFeeAmount) : null,
                contingencyPercent: contingencyPercent ? Number(contingencyPercent) : null,
              })
            }
          >
            {tr.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
