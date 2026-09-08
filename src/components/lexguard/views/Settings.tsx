"use client";

// Settings & safety — discreet mode (FR-6.2), PIN lock (FR-6.3),
// data ownership: export + deletion (PRD §3.4, §9.2, FR-5.2)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, Lock, ShieldAlert, FileJson, Trash2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { api } from "@/lib/lexguard/api";
import { localStore } from "@/lib/lexguard/local";
import { PageTitle } from "@/components/lexguard/AppShell";

export function SettingsView() {
  const app = useApp();
  const tr = t(app.locale);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const exportAll = () => {
    const data = app.mode === "account" ? null : localStore.exportAll();
    const blob = new Blob([JSON.stringify(data ?? { note: "account-mode export via /api/account" }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lexguard-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const accountExport = async () => {
    const data = await api.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lexguard-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAll = async () => {
    if (!window.confirm(tr.deleteConfirm)) return;
    if (app.mode === "account") {
      await api.deleteAccount();
      app.setUser(null);
      app.setMode(null);
      app.home();
    } else {
      localStore.wipe();
      app.setMode(null);
      app.home();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageTitle title={tr.settings} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-emerald-700" /> {tr.safetyTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tr.safetyDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="flex items-center gap-2 font-medium">
                <Eye className="h-4 w-4" /> {tr.discreetMode}
              </p>
              <p className="text-sm text-muted-foreground">{tr.discreetDesc}</p>
            </div>
            <Switch checked={app.discreet} onCheckedChange={() => app.toggleDiscreet()} aria-label={tr.discreetMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-emerald-700" /> {tr.pinLock}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tr.pinDesc}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {app.pinHash ? (
            <Button variant="outline" onClick={() => app.clearPin()}>
              {tr.removePin}
            </Button>
          ) : (
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="pin">{tr.setPin} (4–6)</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800"
                disabled={pin.length < 4}
                onClick={() => {
                  void app.setPin(pin);
                  setPin("");
                }}
              >
                {tr.setPin}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{tr.dataTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{tr.dataDesc}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {app.mode === "account" ? (
            <Button variant="outline" className="gap-2" onClick={() => void accountExport()}>
              <FileJson className="h-4 w-4" /> {tr.exportData}
            </Button>
          ) : (
            <Button variant="outline" className="gap-2" onClick={exportAll}>
              <FileJson className="h-4 w-4" /> {tr.exportData}
            </Button>
          )}
          <Button variant="destructive" className="gap-2" onClick={() => void deleteAll()}>
            <Trash2 className="h-4 w-4" /> {tr.deleteAccount}
          </Button>
        </CardContent>
      </Card>

      {msg ? <Alert><AlertDescription>{msg}</AlertDescription></Alert> : null}
      <p className="text-sm text-muted-foreground">{app.mode === "local" ? tr.localWarning : ""}</p>
    </div>
  );
}
