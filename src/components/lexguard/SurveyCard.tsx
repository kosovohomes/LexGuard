"use client";

// Outcome tracking card (Phase 3, PRD §14 action-rate metric). After a dossier
// export, the user is offered an optional 30-day and 90-day check-in. Neutral,
// user-controlled, privacy-first: answers live in the user's own storage; the
// team only ever sees anonymous counts. "Remind me later" snoozes for 7 days.
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { localStore } from "@/lib/lexguard/local";
import { api } from "@/lib/lexguard/api";
import {
  SURVEY_CHANNELS,
  pendingSurveys,
  type PendingSurvey,
  type SurveyResponse,
  type SurveyStatus,
} from "@/lib/lexguard/surveys";

const SNOOZE_KEY = "lexguard.svSnooze.v1";
const SNOOZE_DAYS = 7;

function snoozed(): boolean {
  try {
    const until = Number(window.localStorage.getItem(SNOOZE_KEY) ?? "0");
    return Date.now() < until;
  } catch {
    return false;
  }
}

function snooze(): void {
  try {
    window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
  } catch {
    /* storage unavailable — card simply stays */
  }
}

function statusLabel(status: SurveyStatus, tr: ReturnType<typeof t>): string {
  return status === "filed" ? tr.svFiled : status === "not_yet" ? tr.svNotYet : tr.svDeclined;
}

export function SurveyCard() {
  const app = useApp();
  const tr = t(app.locale);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingSurvey[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [current, setCurrent] = useState<PendingSurvey | null>(null);
  const [status, setStatus] = useState<SurveyStatus>("not_yet");
  const [channels, setChannels] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (app.mode === "account") {
        const res = await api.listSurveys();
        setPending(res.pending);
        setResponses(res.responses);
        setCurrent(res.pending[0] ?? null);
      } else {
        const p = pendingSurveys(localStore.listDossiers(), localStore.listSurveys());
        setPending(p);
        setResponses(localStore.listSurveys());
        setCurrent(p[0] ?? null);
      }
    } catch {
      setPending([]);
      setResponses([]);
      setCurrent(null);
    } finally {
      setLoading(false);
    }
  }, [app.mode]);

  useEffect(() => {
    if (!app.ready) return;
    void load();
  }, [app.ready, load]);

  if (loading || !app.ready) return null;

  const showPending = current !== null && !snoozed() && !justSaved;
  const showHistory = responses.length > 0 && !showPending;
  if (!showPending && !showHistory && !justSaved) return null;

  const daysAgo = current ? Math.max(1, Math.round((Date.now() - new Date(current.exportedAt).getTime()) / 86400000)) : 0;
  const introTpl = app.mode === "account" ? tr.svIntro : tr.svLocalIntro;

  const submit = async () => {
    if (!current) return;
    setSaving(true);
    try {
      if (app.mode === "account") {
        await api.saveSurvey({ dossierId: current.dossierId, milestone: current.milestone, status, channels, notes: notes.trim() });
      } else {
        localStore.saveSurvey({ dossierId: current.dossierId, milestone: current.milestone, status, channels, notes: notes.trim() });
      }
      setJustSaved(true);
      setCurrent(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-primary/25 bg-primary/[0.04]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="h-5 w-5 text-primary" /> {tr.svTitle}
          {current ? <Badge variant="outline" className="font-normal text-xs">{daysAgo}d</Badge> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {justSaved ? (
          <p className="text-sm font-medium text-primary" role="status">{tr.svThanks}</p>
        ) : null}
        {!justSaved && showPending && current ? (
          <>
            <p className="text-sm text-muted-foreground">{introTpl.replace("{days}", String(daysAgo))}</p>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">{tr.svStatusQ}</legend>
              {([
                { v: "filed" as SurveyStatus, label: tr.svFiled },
                { v: "not_yet" as SurveyStatus, label: tr.svNotYet },
                { v: "declined" as SurveyStatus, label: tr.svDeclined },
              ]).map((o) => (
                <label key={o.v} className="flex min-h-11 items-center gap-2.5 rounded-lg border border-border/80 bg-card p-3 text-sm transition hover:border-primary/40 has-[[data-state=checked]]:border-primary/60 has-[[data-state=checked]]:bg-primary/[0.05]">
                  <input
                    type="radio"
                    name="lexguard-sv-status"
                    value={o.v}
                    checked={status === o.v}
                    onChange={() => setStatus(o.v)}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  {o.label}
                </label>
              ))}
            </fieldset>

            {status === "filed" ? (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">{tr.svChannelsQ}</legend>
                {SURVEY_CHANNELS.map((ch) => (
                  <label key={ch} className="flex min-h-11 items-center gap-2.5 rounded-lg border border-border/80 bg-card p-3 text-sm transition hover:border-primary/40">
                    <Checkbox
                      checked={channels.includes(ch)}
                      onCheckedChange={(v) => setChannels(v ? [...channels, ch] : channels.filter((x) => x !== ch))}
                    />
                    {ch === "discipline" ? tr.svChDiscipline : ch === "csf" ? tr.svChCsf : ch === "fee" ? tr.svChFee : tr.svChMalpractice}
                  </label>
                ))}
              </fieldset>
            ) : null}

            {status === "filed" || status === "not_yet" ? (
              <div className="space-y-1.5">
                <Label htmlFor="sv-notes">{tr.svNotes}</Label>
                <Textarea id="sv-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={tr.svNotesPlaceholder} maxLength={2000} />
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => void submit()} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {tr.svSubmit}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  snooze();
                  setCurrent(null);
                }}
              >
                {tr.svSkipForNow}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{tr.svVerifiedNote}</p>
          </>
        ) : showHistory ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">{tr.svHistory}</p>
            <ul className="space-y-1.5">
              {responses.slice(0, 6).map((r) => (
                <li key={`${r.dossierId}:${r.milestone}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/80 p-2.5 text-sm">
                  <Badge variant="secondary" className="text-[11px]">{tr.svMilestone.replace("{days}", String(r.milestone))}</Badge>
                  <span>{statusLabel(r.status, tr)}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {new Date(r.updatedAt).toLocaleDateString(app.locale === "es" ? "es-MX" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
