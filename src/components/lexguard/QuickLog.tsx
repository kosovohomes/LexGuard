"use client";

// Quick log (Phase 3, PRD §13 "quick-log mobile") — a mobile-first floating action
// button with a bottom-sheet style dialog. A common event takes ≤3 taps:
// template -> (optional one-line detail) -> save. Uses the same structured entry
// payloads as the full journal form, so the red-flag engine sees quick logs too.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, PhoneIncoming, Mail, MailOpen, Landmark, Banknote, CalendarClock, NotebookPen, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { QUICK_TEMPLATES, buildQuickPayload, nowLocalInput, templateById, type QuickTemplate } from "@/lib/lexguard/quicklog";
import type { DeadlineData, PaymentData } from "@/lib/lexguard/types";

function TemplateIcon({ icon }: { icon: QuickTemplate["icon"] }) {
  const cls = "h-5 w-5";
  switch (icon) {
    case "call_in":
      return <PhoneIncoming className={cls} />;
    case "call_out":
      return <Phone className={cls} />;
    case "email_out":
      return <Mail className={cls} />;
    case "email_in":
      return <MailOpen className={cls} />;
    case "money_out":
      return <Landmark className={cls} />;
    case "money_in":
      return <Banknote className={cls} />;
    case "deadline":
      return <CalendarClock className={cls} />;
    default:
      return <NotebookPen className={cls} />;
  }
}

export function QuickLog() {
  const app = useApp();
  const tr = t(app.locale);
  const [open, setOpen] = useState(false);
  const [tplId, setTplId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentData["method"]>("card");
  const [payee, setPayee] = useState<PaymentData["payee"]>("firm_trust");
  const [kindOut, setKindOut] = useState<"retainer" | "fee" | "expense">("fee");
  const [kindIn, setKindIn] = useState<"refund" | "disbursement" | "other">("refund");
  const [deadlineKind, setDeadlineKind] = useState<DeadlineData["kind"]>("follow_up");
  const [deadlineStatus, setDeadlineStatus] = useState<DeadlineData["status"]>("upcoming");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tpl = tplId ? templateById(tplId) : undefined;

  // load cases when the sheet opens (both storage modes)
  useEffect(() => {
    if (open && app.cases.length === 0) void app.loadCases();
  }, [open]);

  // sensible defaults each time the sheet opens
  useEffect(() => {
    if (open) {
      setDate(nowLocalInput());
      setCaseId(app.active?.case.id ?? "");
      setTplId(null);
      setTitle("");
      setBody("");
      setAmount("");
      setSaved(false);
      setSaving(false);
    }
  }, [open]);

  // default the case select once cases arrive (Journal-created implicit local cases included)
  useEffect(() => {
    if (open && !caseId && app.cases.length > 0) {
      setCaseId(app.active?.case.id ?? app.cases[0].id);
    }
  }, [open, app.cases, caseId, app.active]);

  const pick = (id: string) => {
    setTplId(id);
    setSaved(false);
  };

  const resetToTemplates = () => setTplId(null);

  const save = async () => {
    if (!tpl || !caseId) return;
    setSaving(true);
    try {
      const occurredAt = date ? new Date(date).toISOString() : new Date().toISOString();
      const fallbackTitle = tr[tpl.defaultTitleKey as keyof typeof tr] ?? tpl.defaultTitleKey;
      const data = buildQuickPayload(tpl, {
        amount: amount ? Number(amount) : 0,
        method,
        payee,
        paymentKindOut: kindOut,
        paymentKindIn: kindIn,
        deadlineKind,
        deadlineStatus,
      });
      await app.addEntry(caseId, {
        type: tpl.entryType,
        title: title.trim() || fallbackTitle,
        occurredAt,
        body: body.trim() || null,
        data,
      });
      setSaved(true);
      setTimeout(() => setOpen(false), 900);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Mobile FAB — bottom-left; quick-exit keeps bottom-right */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label={tr.qlFab}
      >
        <Plus className="h-4 w-4" aria-hidden /> {tr.qlFab}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tr.qlTitle}</DialogTitle>
            <p className="text-sm text-muted-foreground">{tr.qlSub}</p>
          </DialogHeader>

          {saved ? (
            <div className="flex items-center gap-2 py-6 text-emerald-700" role="status">
              <CheckCircle2 className="h-5 w-5" /> <span className="font-medium">{tr.qlSaved}</span>
            </div>
          ) : app.cases.length === 0 ? (
            <div className="space-y-3 py-2">
              <p className="text-sm text-muted-foreground">{tr.qlNoCases}</p>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => {
                  setOpen(false);
                  app.navigate({ name: "journal" });
                }}
              >
                {tr.qlGoJournal}
              </Button>
            </div>
          ) : !tpl ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">{tr.qlPickTemplate}</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => pick(x.id)}
                    className="flex items-center gap-2.5 rounded-lg border p-3.5 text-left text-sm font-medium hover:border-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 min-h-14"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                      <TemplateIcon icon={x.icon} />
                    </span>
                    {tr[x.defaultTitleKey as keyof typeof tr]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ql-case">{tr.qlCase}</Label>
                  <Select value={caseId} onValueChange={setCaseId}>
                    <SelectTrigger id="ql-case">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {app.cases.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.attorneyName}
                          {c.firm ? ` — ${c.firm}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ql-date">{tr.qlDate}</Label>
                  <Input id="ql-date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ql-title">{tr.qlWhat}</Label>
                <Input id="ql-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tr[tpl.defaultTitleKey as keyof typeof tr]} />
              </div>

              {tpl.entryType === "payment" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="ql-amount">{tr.qlAmount}</Label>
                    <Input id="ql-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{tpl.id === "money_out" ? tr.qlKindOut : tr.qlKindIn}</Label>
                    {tpl.id === "money_out" ? (
                      <Select value={kindOut} onValueChange={(v) => setKindOut(v as typeof kindOut)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fee">{tr.pk_fee}</SelectItem>
                          <SelectItem value="expense">{tr.pk_expense}</SelectItem>
                          <SelectItem value="retainer">{tr.pk_retainer}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select value={kindIn} onValueChange={(v) => setKindIn(v as typeof kindIn)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">{tr.pk_refund}</SelectItem>
                          <SelectItem value="disbursement">{tr.pk_disbursement}</SelectItem>
                          <SelectItem value="other">{tr.pk_other}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{tr.qlMethod}</Label>
                    <Select value={method} onValueChange={(v) => setMethod(v as PaymentData["method"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{tr.m_cash}</SelectItem>
                        <SelectItem value="check">{tr.m_check}</SelectItem>
                        <SelectItem value="card">{tr.m_card}</SelectItem>
                        <SelectItem value="transfer">{tr.m_transfer}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {tpl.id === "money_out" ? (
                    <div className="space-y-1.5">
                      <Label>{tr.qlPayee}</Label>
                      <Select value={payee} onValueChange={(v) => setPayee(v as PaymentData["payee"])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="firm_trust">{tr.pay_firm}</SelectItem>
                          <SelectItem value="attorney_personally">{tr.pay_personal}</SelectItem>
                          <SelectItem value="other">{tr.pay_other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {tpl.entryType === "deadline" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{tr.qlDeadlineKind}</Label>
                    <Select value={deadlineKind} onValueChange={(v) => setDeadlineKind(v as DeadlineData["kind"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="court">{tr.dk_court}</SelectItem>
                        <SelectItem value="filing">{tr.dk_filing}</SelectItem>
                        <SelectItem value="follow_up">{tr.dk_follow}</SelectItem>
                        <SelectItem value="other">{tr.dk_other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{tr.qlDeadlineStatus}</Label>
                    <Select value={deadlineStatus} onValueChange={(v) => setDeadlineStatus(v as DeadlineData["status"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">{tr.ds_upcoming}</SelectItem>
                        <SelectItem value="met">{tr.ds_met}</SelectItem>
                        <SelectItem value="missed">{tr.ds_missed}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="ql-body">{tr.qlDetails}</Label>
                <Textarea id="ql-body" rows={2} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>

              <div className="flex items-center gap-2">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => void save()} disabled={saving || !caseId}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {tr.qlSave}
                </Button>
                <Button variant="ghost" onClick={resetToTemplates}>
                  ← {tr.qlPickTemplate}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
