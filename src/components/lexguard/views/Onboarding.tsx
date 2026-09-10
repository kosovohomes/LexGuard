"use client";

// Onboarding (Flow A) — state → situation → mode (≤3 clicks to content, PRD 6.1)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Lock } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { STATE_CODES, STATES } from "@/lib/lexguard/types";
import type { USState } from "@/lib/lexguard/types";

export function OnboardingView() {
  const app = useApp();
  const tr = t(app.locale);
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState<string | null>(null);

  const states = STATE_CODES.map((code) => ({ code, name: app.locale === "es" ? STATES[code].nameEs : STATES[code].name }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      {step === 0 && (
        <Card className="py-6">
          <CardHeader>
            <p className="lg-eyebrow mb-1">{app.locale === "es" ? "Paso 1 de 3" : "Step 1 of 3"}</p>
            <CardTitle className="lg-display text-2xl">{tr.chooseState}</CardTitle>
            <p className="text-sm text-muted-foreground">{tr.stateNote}</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {states.map((s) => (
              <Button
                key={s.code}
                variant={app.userState === s.code ? "default" : "outline"}
                size="lg"
                className="h-auto min-h-20 flex-col gap-1 justify-center py-4"
                onClick={() => {
                  app.setUserState(s.code as USState);
                  setStep(1);
                }}
              >
                <span className="text-[15px]">{s.name}</span>
                {STATES[s.code].expansion ? <span className="text-xs font-normal opacity-80">{tr.stateNew}</span> : null}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="py-6">
          <CardHeader>
            <p className="lg-eyebrow mb-1">{app.locale === "es" ? "Paso 2 de 3" : "Step 2 of 3"}</p>
            <CardTitle className="lg-display text-2xl">{tr.situation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: "dealing", label: tr.sit_dealing },
              { key: "past", label: tr.sit_past },
              { key: "learn", label: tr.sit_learn },
            ].map((o) => (
              <Button
                key={o.key}
                variant={situation === o.key ? "default" : "outline"}
                size="lg"
                className="w-full justify-start h-auto py-3.5 text-left text-[15px]"
                onClick={() => {
                  setSituation(o.key);
                  setStep(2);
                }}
              >
                {o.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="py-6">
          <CardHeader>
            <p className="lg-eyebrow mb-1">{app.locale === "es" ? "Paso 3 de 3" : "Step 3 of 3"}</p>
            <CardTitle className="lg-display text-2xl">{tr.chooseMode}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              className="w-full text-left rounded-xl border border-border/80 bg-card p-5 transition hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                app.setMode("account");
                app.navigate({ name: "auth" });
              }}
            >
              <div className="font-semibold">{tr.modeAccount}</div>
              <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{tr.modeAccountDesc}</div>
            </button>
            <button
              className="w-full text-left rounded-xl border border-border/80 bg-card p-5 transition hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                app.setMode("local");
                app.home();
              }}
            >
              <div className="font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> {tr.modeLocal}
              </div>
              <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{tr.modeLocalDesc}</div>
            </button>
            <Alert>
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>{tr.localWarning}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => (step === 0 ? app.home() : setStep(step - 1))}>
        ← {tr.back}
      </Button>
    </div>
  );
}
