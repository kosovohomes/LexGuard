"use client";

// PIN lock screen (FR-6.3) — shown when a PIN is set, including auto-lock on idle
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";

export function LockScreen() {
  const app = useApp();
  const tr = t(app.locale);
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = async () => {
    const ok = await app.unlock(pin);
    if (!ok) {
      setWrong(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-xs space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="lg-display text-2xl">{tr.enterPin}</h1>
        <Input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          autoFocus
          className="text-center text-2xl tracking-[0.5em]"
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          aria-label={tr.enterPin}
        />
        {wrong ? <p className="text-sm text-destructive">{tr.wrongPin}</p> : null}
        <Button className="w-full" onClick={() => void submit()}>
          →
        </Button>
        <button className="lg-link text-sm text-destructive" onClick={() => window.location.replace("https://weather.com")}>
          {tr.quickExit}
        </button>
      </div>
    </div>
  );
}

// Auto-lock after 10 minutes of inactivity when a PIN is set (FR-6.3)
export function useAutoLock() {
  const app = useApp();
  useState(() => {
    if (typeof window === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const reset = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (useApp.getState().pinHash) useApp.setState({ locked: true });
      }, 10 * 60 * 1000);
    };
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
  });
}
