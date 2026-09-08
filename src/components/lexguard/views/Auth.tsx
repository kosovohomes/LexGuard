"use client";

// Auth view (Mode A) — register / sign in
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/lexguard/store";
import { api } from "@/lib/lexguard/api";
import { t } from "@/lib/lexguard/i18n";

export function AuthView() {
  const app = useApp();
  const tr = t(app.locale);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const u =
        mode === "register"
          ? await api.register(email, password, app.userState ?? "TX", app.locale, ageConfirmed)
          : await api.login(email, password);
      app.setUser(u);
      app.setMode("account");
      app.home();
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      setError(code.includes("409") ? (app.locale === "es" ? "Ese correo ya tiene cuenta." : "That email already has an account.") : code.includes("401") ? (app.locale === "es" ? "Correo o contraseña incorrectos." : "Wrong email or password.") : tr.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "register" ? tr.register : tr.login}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{tr.email}</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{tr.password}</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void submit()}
            />
            {mode === "register" ? <p className="text-xs text-muted-foreground">≥ 8 {app.locale === "es" ? "caracteres" : "characters"}</p> : null}
          </div>
          {mode === "register" ? (
            <div className="flex items-start gap-2">
              <input
                id="age-gate"
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-700"
                required
              />
              <label htmlFor="age-gate" className="text-sm text-muted-foreground">
                {tr.ageGate}
              </label>
            </div>
          ) : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            disabled={busy || !email || password.length < 8 || (mode === "register" && !ageConfirmed)}
            onClick={() => void submit()}
          >
            {busy ? tr.loading : mode === "register" ? tr.register : tr.login}
          </Button>
          <Button variant="link" className="w-full" onClick={() => setMode(mode === "register" ? "login" : "register")}>
            {mode === "register" ? tr.haveAccount : tr.needAccount}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
