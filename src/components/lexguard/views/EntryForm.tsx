"use client";

// Entry forms — structured logging per entry type (PRD FR-2.2, Flow B)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import type { CommunicationData, DeadlineData, PaymentData } from "@/lib/lexguard/types";

function nowLocal(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function EntryForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [type, setType] = useState<"communication" | "payment" | "deadline" | "promise" | "note">("communication");

  const typeOptions: { value: typeof type; label: string }[] = [
    { value: "communication", label: tr.type_communication },
    { value: "payment", label: tr.type_payment },
    { value: "deadline", label: tr.type_deadline },
    { value: "promise", label: tr.type_promise },
    { value: "note", label: tr.type_note },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {typeOptions.map((o) => (
          <Button key={o.value} size="sm" variant={type === o.value ? "default" : "outline"} className="bg-emerald-700 data-[state=off]" onClick={() => setType(o.value)}>
            {o.label}
          </Button>
        ))}
      </div>
      {type === "communication" ? <CommunicationForm caseId={caseId} onDone={onDone} /> : null}
      {type === "payment" ? <PaymentForm caseId={caseId} onDone={onDone} /> : null}
      {type === "deadline" ? <DeadlineForm caseId={caseId} onDone={onDone} /> : null}
      {type === "promise" ? <PromiseForm caseId={caseId} onDone={onDone} /> : null}
      {type === "note" ? <NoteForm caseId={caseId} onDone={onDone} /> : null}
    </div>
  );
}

function CommunicationForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [channel, setChannel] = useState<CommunicationData["channel"]>("call");
  const [direction, setDirection] = useState<CommunicationData["direction"]>("to_attorney");
  const [date, setDate] = useState(nowLocal());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [responseReceived, setResponseReceived] = useState(false);
  const [respondedBy, setRespondedBy] = useState<CommunicationData["respondedBy"]>("attorney");
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  const setF = (k: string, v: boolean) => setFlags((f) => ({ ...f, [k]: v }));

  const flagDefs: { key: string; label: string }[] = [
    { key: "requestedFileReturn", label: tr.flag_fileReturn },
    { key: "fileReturnRefused", label: tr.flag_fileRefused },
    { key: "settlementDiscussed", label: tr.flag_settlement },
    { key: "settledWithoutAuthorization", label: tr.flag_noAuth },
    { key: "requestedDirectAttorneyContact", label: tr.flag_direct },
    { key: "askedToLie", label: tr.flag_lie },
    { key: "guaranteedOutcome", label: tr.flag_guarantee },
    { key: "conflictFlag", label: tr.flag_conflict },
    { key: "unrelatedBillingFlag", label: tr.flag_unrelated },
  ];

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{tr.channel}</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as CommunicationData["channel"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">{tr.ch_call}</SelectItem>
              <SelectItem value="email">{tr.ch_email}</SelectItem>
              <SelectItem value="text">{tr.ch_text}</SelectItem>
              <SelectItem value="letter">{tr.ch_letter}</SelectItem>
              <SelectItem value="in_person">{tr.ch_in_person}</SelectItem>
              <SelectItem value="portal">{tr.ch_portal}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{tr.direction}</Label>
          <Select value={direction} onValueChange={(v) => setDirection(v as CommunicationData["direction"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="to_attorney">{tr.dir_to}</SelectItem>
              <SelectItem value="from_attorney">{tr.dir_from}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cdate">{tr.date}</Label>
          <Input id="cdate" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctitle">{tr.title}</Label>
          <Input id="ctitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={app.locale === "es" ? "p. ej., llamé para preguntar por mi caso" : "e.g., called to ask about my case"} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cbody">{tr.details}</Label>
        <Textarea id="cbody" rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={responseReceived} onCheckedChange={(v) => setResponseReceived(!!v)} />
          {tr.responseReceived}
        </label>
        {responseReceived && direction === "from_attorney" ? (
          <Select value={respondedBy ?? "attorney"} onValueChange={(v) => setRespondedBy(v as CommunicationData["respondedBy"])}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attorney">{tr.resp_attorney}</SelectItem>
              <SelectItem value="staff">{tr.resp_staff}</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <fieldset className="rounded-md border p-3">
        <legend className="px-1 text-xs font-medium text-muted-foreground">{tr.flagsLegend}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {flagDefs.map((f) => (
            <label key={f.key} className="flex items-start gap-2 text-sm">
              <Checkbox className="mt-0.5" checked={!!flags[f.key]} onCheckedChange={(v) => setF(f.key, !!v)} />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Button
        className="bg-emerald-700 hover:bg-emerald-800"
        disabled={!title || !date}
        onClick={() =>
          void app
            .addEntry(caseId, {
              type: "communication",
              title,
              body,
              occurredAt: new Date(date).toISOString(),
              data: {
                channel,
                direction,
                responseReceived: direction === "from_attorney" ? true : responseReceived,
                respondedBy,
                ...flags,
              } as CommunicationData,
            })
            .then(onDone)
        }
      >
        {tr.addCommunication}
      </Button>
    </div>
  );
}

function PaymentForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [kind, setKind] = useState<PaymentData["kind"]>("retainer");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentData["method"]>("card");
  const [payee, setPayee] = useState<PaymentData["payee"]>("firm_trust");
  const [date, setDate] = useState(nowLocal());
  const [title, setTitle] = useState("");
  const [receipt, setReceipt] = useState(false);
  const [notInAgreement, setNotInAgreement] = useState(false);
  const [percentPaid, setPercentPaid] = useState("");

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{tr.paymentKind}</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as PaymentData["kind"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retainer">{tr.pk_retainer}</SelectItem>
              <SelectItem value="fee">{tr.pk_fee}</SelectItem>
              <SelectItem value="expense">{tr.pk_expense}</SelectItem>
              <SelectItem value="settlement_received">{tr.pk_settlement}</SelectItem>
              <SelectItem value="disbursement">{tr.pk_disbursement}</SelectItem>
              <SelectItem value="refund">{tr.pk_refund}</SelectItem>
              <SelectItem value="administrative">{tr.pk_administrative}</SelectItem>
              <SelectItem value="contingency_payout">{tr.pk_contingency}</SelectItem>
              <SelectItem value="other">{tr.pk_other}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pamount">{tr.amount}</Label>
          <Input id="pamount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{tr.method}</Label>
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
        <div className="space-y-1.5">
          <Label>{tr.payee}</Label>
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
        <div className="space-y-1.5">
          <Label htmlFor="pdate">{tr.date}</Label>
          <Input id="pdate" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        {kind === "contingency_payout" ? (
          <div className="space-y-1.5">
            <Label htmlFor="pct">{tr.percentPaid}</Label>
            <Input id="pct" type="number" min="0" max="100" value={percentPaid} onChange={(e) => setPercentPaid(e.target.value)} />
          </div>
        ) : null}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="ptitle">{tr.title}</Label>
          <Input id="ptitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={app.locale === "es" ? "p. ej., factura de abril" : "e.g., April invoice"} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={receipt} onCheckedChange={(v) => setReceipt(!!v)} />
          {tr.receipt}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={notInAgreement} onCheckedChange={(v) => setNotInAgreement(!!v)} />
          {tr.notInAgreement}
        </label>
      </div>
      <Button
        className="bg-emerald-700 hover:bg-emerald-800"
        disabled={!title || !date || !amount}
        onClick={() =>
          void app
            .addEntry(caseId, {
              type: "payment",
              title,
              occurredAt: new Date(date).toISOString(),
              data: {
                kind,
                amount: Number(amount),
                method,
                payee,
                receipt,
                notInAgreement,
                percentPaid: percentPaid ? Number(percentPaid) : null,
              } as PaymentData,
            })
            .then(onDone)
        }
      >
        {tr.addPayment}
      </Button>
    </div>
  );
}

function DeadlineForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [kind, setKind] = useState<DeadlineData["kind"]>("court");
  const [status, setStatus] = useState<DeadlineData["status"]>("upcoming");
  const [date, setDate] = useState(nowLocal());
  const [title, setTitle] = useState("");
  const [missedAppearance, setMissedAppearance] = useState(false);

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>{tr.deadlineKind}</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as DeadlineData["kind"])}>
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
          <Label>{tr.deadlineStatus}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as DeadlineData["status"])}>
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
        <div className="space-y-1.5">
          <Label htmlFor="ddate">{tr.date}</Label>
          <Input id="ddate" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dtitle">{tr.title}</Label>
          <Input id="dtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={app.locale === "es" ? "p. ej., audiencia de custodia" : "e.g., custody hearing"} />
        </div>
      </div>
      {kind === "court" && status === "missed" ? (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={missedAppearance} onCheckedChange={(v) => setMissedAppearance(!!v)} />
          {tr.missedAppearance}
        </label>
      ) : null}
      <Button
        className="bg-emerald-700 hover:bg-emerald-800"
        disabled={!title || !date}
        onClick={() =>
          void app
            .addEntry(caseId, {
              type: "deadline",
              title,
              occurredAt: new Date(date).toISOString(),
              data: { kind, status, missedAppearance } as DeadlineData,
            })
            .then(onDone)
        }
      >
        {tr.addDeadline}
      </Button>
    </div>
  );
}

function PromiseForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [title, setTitle] = useState("");
  const [promisedBy, setPromisedBy] = useState("");
  const [fulfilled, setFulfilled] = useState<"unknown" | "yes" | "no">("unknown");
  const [date, setDate] = useState(nowLocal());

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="prtitle">{tr.promiseText}</Label>
          <Input id="prtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={app.locale === "es" ? "p. ej., \u00able tendr\u00e9 una propuesta en 2 semanas\u00bb" : "e.g., 'you'll have a proposal in 2 weeks'"} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prby">
            {tr.promisedBy} <span className="text-muted-foreground">({tr.optional})</span>
          </Label>
          <Input id="prby" type="date" value={promisedBy} onChange={(e) => setPromisedBy(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prdate">{tr.whenPromised}</Label>
          <Input id="prdate" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>{tr.fulfilled}</Label>
          <Select value={fulfilled} onValueChange={(v) => setFulfilled(v as typeof fulfilled)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unknown">—</SelectItem>
              <SelectItem value="yes">{tr.ds_met}</SelectItem>
              <SelectItem value="no">{tr.fulfilledNo}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="bg-emerald-700 hover:bg-emerald-800"
        disabled={!title || !date}
        onClick={() =>
          void app
            .addEntry(caseId, {
              type: "promise",
              title,
              occurredAt: new Date(date).toISOString(),
              data: { promisedBy: promisedBy || undefined, fulfilled: fulfilled === "unknown" ? null : fulfilled === "yes" },
            })
            .then(onDone)
        }
      >
        {tr.addPromise}
      </Button>
    </div>
  );
}

function NoteForm({ caseId, onDone }: { caseId: string; onDone: () => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(nowLocal());

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ntitle">{tr.title}</Label>
          <Input id="ntitle" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ndate">{tr.date}</Label>
          <Input id="ndate" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nbody">{tr.details}</Label>
        <Textarea id="nbody" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <Button
        className="bg-emerald-700 hover:bg-emerald-800"
        disabled={!title || !date}
        onClick={() =>
          void app
            .addEntry(caseId, { type: "note", title, body, occurredAt: new Date(date).toISOString() })
            .then(onDone)
        }
      >
        {tr.addNote}
      </Button>
    </div>
  );
}
