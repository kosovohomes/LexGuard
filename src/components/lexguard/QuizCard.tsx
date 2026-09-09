"use client";

// Knowledge-lift quiz card (PRD §14). An optional 5-question rights quiz:
// taken once before using the tool ("pre") and again 7 days later ("post") so
// the team can measure aggregate knowledge lift. Answers live on the device;
// account mode additionally submits the anonymous score (0–5, no identifier,
// no user link) to the aggregate endpoint. Neutral, educational, skippable.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Loader2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { api } from "@/lib/lexguard/api";
import { localStore } from "@/lib/lexguard/local";
import { QUIZ_QUESTIONS, QUIZ_MAX_SCORE, getQuizRecord, saveQuizResult, postQuizDue, type QuizPhase, type QuizRecord } from "@/lib/lexguard/quiz";

export function QuizCard() {
  const app = useApp();
  const tr = t(app.locale);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>("pre");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState<QuizRecord | null>(null);
  const [busy, setBusy] = useState(false);

  // resolve the invite state after mount (SSR-safe; async boundary keeps the
  // effect free of direct synchronous setState)
  const [invite, setInvite] = useState<"none" | "pre" | "post" | "awaiting">("none");
  useEffect(() => {
    let alive = true;
    void Promise.resolve().then(() => {
      if (!alive) return;
      if (!getQuizRecord("pre")) setInvite("pre");
      else if (!getQuizRecord("post") && postQuizDue()) setInvite("post");
      else if (!getQuizRecord("post")) setInvite("awaiting");
    });
    return () => {
      alive = false;
    };
  }, []);

  const start = (p: QuizPhase) => {
    setPhase(p);
    setStep(0);
    setAnswers([]);
    setDone(null);
    setOpen(true);
  };

  const choose = (idx: number) => {
    const next = [...answers];
    next[step] = idx;
    setAnswers(next);
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      const rec = saveQuizResult(phase, next);
      setDone(rec);
      setInvite((prev) => (phase === "pre" ? "awaiting" : "none"));
      // anonymous aggregate submission (account mode / best effort)
      if (app.mode === "account") {
        setBusy(true);
        void api
          .submitQuiz(rec.phase, rec.score)
          .catch(() => undefined)
          .finally(() => setBusy(false));
      }
    }
  };

  // ---- collapsed / completed states ----
  if (!open) {
    if (done) {
      return (
        <Card>
          <CardContent className="p-5 space-y-2">
            <p className="flex items-center gap-2 font-medium">
              <GraduationCap className="h-4 w-4 text-emerald-700" /> {tr.quizDoneTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {tr.quizScoreLine.replace("{score}", String(done.score)).replace("{max}", String(QUIZ_MAX_SCORE))}
            </p>
            <p className="text-xs text-muted-foreground">{tr.quizAnonNote}</p>
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          </CardContent>
        </Card>
      );
    }
    if (invite === "none") return null;
    // awaiting the 7-day post window — show a quiet summary, no CTA
    if (invite === "awaiting") {
      const preRec = getQuizRecord("pre");
      return (
        <Card>
          <CardContent className="p-5 space-y-2">
            <p className="flex items-center gap-2 font-medium">
              <GraduationCap className="h-4 w-4 text-emerald-700" /> {tr.quizDoneTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {preRec ? tr.quizScoreLine.replace("{score}", String(preRec.score)).replace("{max}", String(QUIZ_MAX_SCORE)) : ""}
            </p>
            <p className="text-xs text-muted-foreground">{tr.quizAwaiting}</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4 text-emerald-700" /> {invite === "post" ? tr.quizPostTitle : tr.quizPreTitle}
            <Badge variant="outline" className="ml-auto text-xs">
              {tr.quizBadge}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tr.quizIntro}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => start(invite === "post" ? "post" : "pre")}>
            {tr.quizStart}
          </Button>
          <p className="text-xs text-muted-foreground">{tr.quizOptional}</p>
        </CardContent>
      </Card>
    );
  }

  // ---- active quiz ----
  const q = QUIZ_QUESTIONS[step];
  const rec = done;

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{tr.quizTitle}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {phase === "pre" ? tr.quizPre : tr.quizPost} · {tr.quizStep.replace("{n}", String(step + 1)).replace("{max}", String(QUIZ_QUESTIONS.length))}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {rec ? (
          <>
            <p className="text-sm font-medium">
              {tr.quizScoreLine.replace("{score}", String(rec.score)).replace("{max}", String(QUIZ_MAX_SCORE))}
            </p>
            <ol className="space-y-2 text-sm">
              {QUIZ_QUESTIONS.map((qq, i) => {
                const ok = rec.answers[i] === qq.correct;
                return (
                  <li key={qq.id} className="rounded-lg border p-3">
                    <p className="font-medium">
                      {ok ? "✓" : "✗"} {qq.prompt[app.locale]}
                    </p>
                    <p className="mt-1 text-muted-foreground">{qq.explanation[app.locale]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{qq.citation}</p>
                  </li>
                );
              })}
            </ol>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {tr.cancel}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium">{q.prompt[app.locale]}</p>
            <div className="space-y-2">
              {q.options.map((o, i) => (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className="w-full rounded-lg border p-3 text-left text-sm hover:border-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {o.text[app.locale]}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{tr.quizAnonNote}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
