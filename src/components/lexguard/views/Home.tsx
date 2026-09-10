"use client";

// Home view — hero, how-it-works, principles (PRD §1, §3)
// "Signal" redesign: dark marquee hero with grid texture + glow, a stat
// strip surfacing real product facts, ghost-numeral step cards, and a
// bolder bento treatment for the "never do" principles. All copy still
// comes from the existing i18n table — new micro-copy (the stat labels)
// follows the file's own existing pattern of inline EN/ES ternaries
// (see the phase badge below) rather than adding new i18n keys.
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
  const es = app.locale === "es";

  const steps = [
    { icon: <BookOpen className="h-5 w-5" />, title: tr.step1, desc: tr.step1d },
    { icon: <FolderOpen className="h-5 w-5" />, title: tr.step2, desc: tr.step2d },
    { icon: <Radar className="h-5 w-5" />, title: tr.step3, desc: tr.step3d },
    { icon: <Compass className="h-5 w-5" />, title: tr.step4, desc: tr.step4d },
  ];

  // One accent per step for visual variety — kept out of the shared
  // semantic tokens (destructive/copper) so meaning stays unambiguous.
  const stepAccents = [
    { bg: "bg-primary/10", ring: "ring-primary/20", text: "text-primary" },
    { bg: "bg-signal/10", ring: "ring-signal/20", text: "text-signal" },
    { bg: "bg-copper/10", ring: "ring-copper/20", text: "text-copper" },
    { bg: "bg-chart-4/10", ring: "ring-chart-4/20", text: "text-chart-4" },
  ];

  const principles = [tr.p1, tr.p2, tr.p3, tr.p4];

  // Real product facts (README / PRD), not invented marketing numbers.
  const stats = [
    { value: "5", label: es ? "estados con cobertura" : "states covered" },
    { value: "20", label: es ? "reglas de conducta profesional" : "professional-conduct rules" },
    { value: "4", label: es ? "canales de remedio" : "remedy channels" },
    { value: "EN/ES", label: es ? "totalmente bilingüe" : "fully bilingual" },
  ];

  const go = () => app.navigate({ name: app.userState ? "guides" : "onboarding" });

  return (
    <div className="space-y-14">
      {/* Phase 4 — optional knowledge-lift quiz (PRD §14) */}
      <QuizCard />

      {/* Phase 3 — optional 30/90-day outcome check-in (PRD §14) */}
      <SurveyCard />

      {/* Marquee hero — dark ink surface, ledger-grid texture, signal glow */}
      <section className="lg-marquee px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <p className="lg-eyebrow-inverse inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          {es ? "Texas · California · Fase 4" : "Texas · California · Phase 4"}
        </p>

        <h1 className="lg-display mt-6 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.03]">
          {tr.homeHeroTitle}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
          {tr.homeHeroSub}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={go}
            className="h-14 gap-2 rounded-xl bg-signal px-7 text-base font-semibold text-signal-foreground shadow-lg shadow-signal/20 hover:bg-signal/90"
          >
            {tr.startNow} <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => app.navigate({ name: "guides" })}
            className="h-14 rounded-xl border-white/20 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white"
          >
            {tr.readGuides}
          </Button>
        </div>

        <p className="mt-8 flex max-w-2xl items-start gap-2 text-sm text-white/55">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
          {tr.disclaimer}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 border-t border-white/10 pt-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="lg-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs leading-snug text-white/55">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={tr.homeHow}>
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="lg-display text-3xl sm:text-4xl">{tr.homeHow}</h2>
          <span className="lg-eyebrow hidden sm:inline">01 → 04</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const a = stepAccents[i % stepAccents.length];
            return (
              <Card key={i} className="lg-lift relative gap-3 overflow-hidden pt-5">
                <span
                  aria-hidden
                  className="lg-numeral pointer-events-none absolute -right-1 -top-4 select-none text-[5.5rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CardHeader className="relative pb-0">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-1 ring-inset ${a.ring}`}>
                    {s.icon}
                  </div>
                  <CardTitle className="mt-3 text-base">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative text-sm leading-relaxed text-muted-foreground">{s.desc}</CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-label={tr.principlesTitle}>
        <h2 className="lg-display text-3xl sm:text-4xl mb-6">{tr.principlesTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={i} className="lg-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-copper/10 text-copper ring-1 ring-inset ring-copper/20">
                <XCircle className="h-5 w-5" />
              </span>
              <span className="pt-1.5 text-[15px] leading-relaxed">{p}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
