"use client";

// Home view — hero, how-it-works, principles (PRD §1, §3)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, XCircle, BookOpen, FolderOpen, Radar, Compass, ArrowRight, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { SurveyCard } from "@/components/lexguard/SurveyCard";
import { QuizCard } from "@/components/lexguard/QuizCard";

export function HomeView() {
  const app = useApp();
  const tr = t(app.locale);

  const steps = [
    { icon: <BookOpen className="h-5 w-5" />, title: tr.step1, desc: tr.step1d },
    { icon: <FolderOpen className="h-5 w-5" />, title: tr.step2, desc: tr.step2d },
    { icon: <Radar className="h-5 w-5" />, title: tr.step3, desc: tr.step3d },
    { icon: <Compass className="h-5 w-5" />, title: tr.step4, desc: tr.step4d },
  ];

  const principles = [tr.p1, tr.p2, tr.p3, tr.p4];

  const go = () => app.navigate({ name: app.userState ? "guides" : "onboarding" });

  return (
    <div className="space-y-10">
      {/* Phase 4 — optional knowledge-lift quiz (PRD §14) */}
      <QuizCard />

      {/* Phase 3 — optional 30/90-day outcome check-in (PRD §14) */}
      <SurveyCard />

      <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-background p-6 sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          {app.locale === "es" ? "Texas · California · Fase 4" : "Texas · California · Phase 4"}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{tr.homeHeroTitle}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{tr.homeHeroSub}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={go} className="gap-2 bg-emerald-700 hover:bg-emerald-800">
            {tr.startNow} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => app.navigate({ name: "guides" })}>
            {tr.readGuides}
          </Button>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground max-w-2xl">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
          {tr.disclaimer}
        </p>
      </section>

      <section aria-label={tr.homeHow}>
        <h2 className="text-xl font-bold mb-4">{tr.homeHow}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">{s.icon}</div>
                <CardTitle className="text-base">
                  {i + 1}. {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label={tr.principlesTitle}>
        <h2 className="text-xl font-bold mb-4">{tr.principlesTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <XCircle className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
              <span className="text-sm">{p}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
