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

      <section className="lg-hero p-6 sm:p-10 lg:p-12">
        <p className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {app.locale === "es" ? "Texas · California · Fase 4" : "Texas · California · Phase 4"}
        </p>
        <h1 className="lg-display mt-5 max-w-3xl text-4xl sm:text-[2.75rem] leading-[1.12]">{tr.homeHeroTitle}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">{tr.homeHeroSub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={go} className="gap-2 h-12 px-6 text-[15px]">
            {tr.startNow} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-6 text-[15px] bg-card" onClick={() => app.navigate({ name: "guides" })}>
            {tr.readGuides}
          </Button>
        </div>
        <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground max-w-2xl">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-copper" />
          {tr.disclaimer}
        </p>
      </section>

      <section aria-label={tr.homeHow}>
        <div className="mb-5 flex items-baseline gap-3">
          <h2 className="lg-display text-2xl">{tr.homeHow}</h2>
          <span className="lg-eyebrow hidden sm:inline">01 → 04</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Card key={i} className="relative gap-3 pt-5 transition-all hover:border-primary/25 hover:shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/[0.07] text-primary ring-1 ring-inset ring-primary/10 flex items-center justify-center">{s.icon}</div>
                  <span className="lg-step-num text-2xl text-foreground/20">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <CardTitle className="text-base mt-2">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label={tr.principlesTitle}>
        <h2 className="lg-display text-2xl mb-5">{tr.principlesTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <XCircle className="h-5 w-5 text-copper shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{p}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
