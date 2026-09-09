"use client";

// Zero-knowledge vault unlock (PRD §9.1) — shown when local mode has an
// encrypted vault at rest but no key is in memory (e.g. after reload).
// The passphrase never leaves the device; a wrong one simply fails to decrypt.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Loader2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { localStore } from "@/lib/lexguard/local";

export function VaultUnlock() {
  const app = useApp();
  const tr = t(app.locale);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);

  const submit = async () => {
    if (!pass) return;
    setBusy(true);
    setWrong(false);
    const ok = await localStore.unlockVault(pass);
    setBusy(false);
    if (ok) {
      setPass("");
      // lift the reactive gate first, then reload whatever the shell shows
      app.refreshVault();
      await app.loadCases().catch(() => undefined);
      app.home();
    } else {
      setWrong(true);
      setPass("");
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold">{tr.vaultUnlockTitle}</h1>
        <p className="text-sm text-muted-foreground">{tr.vaultUnlockSub}</p>
        <Input
          type="password"
          value={pass}
          autoFocus
          className="text-center"
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          aria-label={tr.vaultPassphrase}
          disabled={busy}
        />
        {wrong ? <p className="text-sm text-red-700">{tr.vaultWrong}</p> : null}
        <Button className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={() => void submit()} disabled={busy || !pass}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {tr.vaultUnlockBtn}
        </Button>
        <p className="text-xs text-muted-foreground">{tr.vaultLostPass}</p>
        <button className="text-sm text-red-700 hover:underline" onClick={() => window.location.replace("https://weather.com")}>
          {tr.quickExit}
        </button>
      </div>
    </div>
  );
}
