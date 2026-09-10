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
import { Eye, Lock, ShieldAlert, FileJson, Trash2, KeyRound, Download, Upload, Undo2 } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { api } from "@/lib/lexguard/api";
import { localStore } from "@/lib/lexguard/local";
import { passphraseProblem } from "@/lib/lexguard/zk";
import { PageTitle } from "@/components/lexguard/AppShell";

export function SettingsView() {
  const app = useApp();
  const tr = t(app.locale);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  // zero-knowledge vault (PRD §9.1) — local mode only
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [disablePass, setDisablePass] = useState("");
  const [importPass, setImportPass] = useState("");
  const [importPayload, setImportPayload] = useState<string | null>(null);
  const [vaultBusy, setVaultBusy] = useState(false);

  const vaultStatus = app.vault;

  const say = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4000);
  };

  const enableVault = async () => {
    if (pass1 !== pass2) return say(tr.vaultMismatch);
    if (passphraseProblem(pass1)) return say(tr.vaultShort);
    setVaultBusy(true);
    const ok = await localStore.enableVault(pass1);
    setVaultBusy(false);
    setPass1("");
    setPass2("");
    if (ok) {
      app.refreshVault();
      say(tr.vaultEnabledNote);
    } else say(tr.vaultError);
  };

  const disableVault = async () => {
    setVaultBusy(true);
    const ok = await localStore.disableVault(disablePass);
    setVaultBusy(false);
    setDisablePass("");
    if (ok) {
      app.refreshVault();
      say(tr.vaultDisabledNote);
    } else say(tr.vaultWrong);
  };

  const exportVault = () => {
    const payload = localStore.exportEncrypted();
    if (!payload) return say(tr.vaultError);
    const blob = new Blob([payload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexguard-vault-${new Date().toISOString().slice(0, 10)}.lgvault`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importVault = async () => {
    if (!importPayload) return;
    setVaultBusy(true);
    const ok = await localStore.importEncrypted(importPayload, importPass);
    setVaultBusy(false);
    setImportPass("");
    setImportPayload(null);
    if (ok) {
      app.refreshVault();
      say(tr.vaultImported);
    } else say(tr.vaultWrong);
  };

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
            <ShieldAlert className="h-4 w-4 text-primary" /> {tr.safetyTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tr.safetyDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-secondary/40 p-4">
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
            <Lock className="h-4 w-4 text-primary" /> {tr.pinLock}
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

      {/* Zero-knowledge vault (PRD §9.1) — anonymous local mode only */}
      {app.mode === "local" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" /> {tr.vaultTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{tr.vaultDesc}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {vaultStatus === "none" ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="zk-pass">{tr.vaultPassphrase}</Label>
                    <Input id="zk-pass" type="password" value={pass1} onChange={(e) => setPass1(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zk-pass2">{tr.vaultConfirm}</Label>
                    <Input id="zk-pass2" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
                  </div>
                </div>
                <Button disabled={vaultBusy || !pass1} onClick={() => void enableVault()}>
                  {tr.vaultEnable}
                </Button>
              </div>
            ) : null}
            {vaultStatus === "unlocked" ? (
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Lock className="h-4 w-4" /> {tr.vaultOn}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2" onClick={exportVault}>
                    <Download className="h-4 w-4" /> {tr.vaultBackup}
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zk-disable">{tr.vaultDisableLabel}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Input id="zk-disable" type="password" value={disablePass} onChange={(e) => setDisablePass(e.target.value)} className="max-w-xs" />
                    <Button variant="outline" disabled={vaultBusy || !disablePass} onClick={() => void disableVault()}>
                      {tr.vaultDisable}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="space-y-1.5 rounded-xl border border-border/80 bg-secondary/40 p-3.5">
              <Label htmlFor="zk-import">{tr.vaultRestore}</Label>
              <input
                id="zk-import"
                type="file"
                accept=".lgvault,.txt"
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setImportPayload(await f.text());
                  e.currentTarget.value = "";
                }}
              />
              {importPayload ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  <Input type="password" placeholder={tr.vaultPassphrase} value={importPass} onChange={(e) => setImportPass(e.target.value)} className="max-w-xs" />
                  <Button disabled={vaultBusy || !importPass} onClick={() => void importVault()}>
                    <Upload className="h-4 w-4" /> {tr.vaultRestoreBtn}
                  </Button>
                </div>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">{tr.vaultLostPass}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{tr.trashTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{tr.trashNote}</p>
        </CardHeader>
        <CardContent>
          {app.trashedCases.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tr.trashEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {app.trashedCases.map((c) => {
                const daysLeft = c.deletedAt ? Math.max(0, 30 - Math.floor((Date.now() - new Date(c.deletedAt).getTime()) / 86400000)) : 0;
                return (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 p-3.5">
                    <div>
                      <p className="font-medium text-sm">{c.attorneyName}{c.firm ? ` — ${c.firm}` : ""}</p>
                      <p className="text-xs text-muted-foreground">{tr.trashDaysLeft.replace("{days}", String(daysLeft))}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => void app.restoreCase(c.id)}>
                        <Undo2 className="h-3.5 w-3.5" /> {tr.trashRestore}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => {
                          if (window.confirm(tr.trashPurgeConfirm)) void app.purgeCase(c.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> {tr.trashDeleteForever}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
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
