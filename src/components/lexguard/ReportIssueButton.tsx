"use client";

// ReportIssueButton — anonymous "report a content issue" dialog (Phase 5d).
// PRD §14 trust metric ("content-correction requests") and §15 mitigation
// ("content review gate"). The report stores NO user identifier — only the
// category, which page it refers to, the language version, and optional text.
// Available on every guide and legal page; posting never involves account data.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Loader2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";

const CATEGORIES = ["error", "outdated", "unclear", "other"] as const;

export function ReportIssueButton({ slug, label }: { slug?: string; label?: string }) {
  const app = useApp();
  const tr = t(app.locale);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("error");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, slug, locale: app.locale, state: app.userState, message }),
      });
      if (!res.ok) throw new Error("bad_status");
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const reset = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setDone(false);
        setMessage("");
        setCategory("error");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Flag className="h-3.5 w-3.5" /> {label ?? tr.reportCta}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tr.reportTitle}</DialogTitle>
          <DialogDescription>{tr.reportIntro}</DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="space-y-3">
            <p className="text-sm">{tr.reportThanks}</p>
            <Button variant="outline" onClick={() => reset(false)}>
              {tr.reportClose}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">{tr.reportCategory}</p>
              <div className="grid gap-2">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm">
                    <input
                      type="radio"
                      name="report-category"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                      className="accent-emerald-700"
                    />
                    {tr[`reportCat_${c}` as keyof typeof tr]}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="report-message">{tr.reportMessage}</Label>
              <Textarea
                id="report-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder={tr.reportPlaceholder}
              />
            </div>
            {failed ? <p className="text-sm text-red-700">{tr.reportFailed}</p> : null}
            <div className="flex items-center gap-2">
              <Button onClick={() => void submit()} disabled={busy} className="bg-emerald-700 hover:bg-emerald-800 gap-1.5">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {tr.reportSend}
              </Button>
              <Button variant="ghost" onClick={() => reset(false)}>
                {tr.reportClose}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
