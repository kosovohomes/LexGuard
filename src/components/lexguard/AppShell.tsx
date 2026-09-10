"use client";

// LexGuard App Shell — header, nav, quick-exit (FR-6.1), discreet mode (FR-6.2),
// sticky footer with disclaimer (PRD §11.4).
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, BookOpen, FolderOpen, Compass, LifeBuoy, CalendarClock, Search, Settings as SettingsIcon, LogOut, Globe, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import type { USState } from "@/lib/lexguard/types";
import { QuickLog } from "@/components/lexguard/QuickLog";

const EXIT_URL = "https://weather.com";

export function AppShell({ children }: { children: React.ReactNode }) {
  const app = useApp();
  const tr = t(app.locale);
  const v = app.stack[app.stack.length - 1];

  // FR-6.2 discreet mode — neutral tab title
  useEffect(() => {
    document.title = app.discreet ? (app.locale === "es" ? "Mis notas" : "My Notes") : `LexGuard — ${tr.tagline}`;
  }, [app.discreet, app.locale, tr.tagline]);

  // WCAG: <html lang> must match the active language
  useEffect(() => {
    document.documentElement.lang = app.locale === "es" ? "es" : "en";
  }, [app.locale]);

  // FR-6.1 quick exit: button + triple-Esc shortcut
  useEffect(() => {
    let count = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        count++;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => (count = 0), 1200);
        if (count >= 3) window.location.replace(EXIT_URL);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const navItems: { view: () => void; label: string; icon: React.ReactNode; active: boolean }[] = [
    { view: () => app.home(), label: tr.navHome, icon: <Shield className="h-4 w-4" />, active: v.name === "home" },
    { view: () => app.navigate({ name: "search" }), label: tr.navSearch, icon: <Search className="h-4 w-4" />, active: v.name === "search" },
    { view: () => app.navigate({ name: "guides" }), label: tr.navGuides, icon: <BookOpen className="h-4 w-4" />, active: v.name === "guides" || v.name === "guide" },
    { view: () => app.navigate({ name: "journal" }), label: tr.navJournal, icon: <FolderOpen className="h-4 w-4" />, active: ["journal", "case", "flags", "dossier"].includes(v.name) },
    { view: () => app.navigate({ name: "router" }), label: tr.navRouter, icon: <Compass className="h-4 w-4" />, active: v.name === "router" },
    { view: () => app.navigate({ name: "deadlines" }), label: tr.navDeadlines, icon: <CalendarClock className="h-4 w-4" />, active: v.name === "deadlines" },
    { view: () => app.navigate({ name: "directory" }), label: tr.navDirectory, icon: <LifeBuoy className="h-4 w-4" />, active: v.name === "directory" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* WCAG 2.1 AA: skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
      >
        {app.locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-2">
          <button onClick={() => app.home()} className="flex items-center gap-2 font-bold text-lg mr-2 shrink-0" aria-label="LexGuard home">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 text-white" aria-hidden>
              <Shield className="h-4 w-4" />
            </span>
            <span className={app.discreet ? "hidden" : "hidden sm:inline"}>LexGuard</span>
          </button>

          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Main">
            {navItems.map((n) => (
              <Button key={n.label} variant={n.active ? "secondary" : "ghost"} size="sm" onClick={n.view} className="gap-1.5" aria-current={n.active ? "page" : undefined}>
                {n.icon}
                {n.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <Select value={app.userState ?? ""} onValueChange={(s) => app.setUserState(s as USState)} aria-label={tr.chooseState}>
              <SelectTrigger className="w-[74px] h-9" size="sm">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="AZ">Arizona</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => app.setLocale(app.locale === "en" ? "es" : "en")} aria-label="Language">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{tr.langLabel}</span>
            </Button>
            {app.user ? (
              <Button variant="ghost" size="sm" onClick={() => void app.signOut()} aria-label={tr.logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => app.navigate({ name: "settings" })} aria-label={tr.navSettings}>
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-2 py-1.5 flex gap-1 overflow-x-auto">
            {navItems.map((n) => (
              <Button key={n.label} variant={n.active ? "secondary" : "ghost"} size="sm" onClick={n.view} className="gap-1.5 shrink-0" aria-current={n.active ? "page" : undefined}>
                {n.icon}
                {n.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 outline-none">{children}</main>

      <footer className="mt-auto border-t bg-muted/40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">{tr.disclaimer}</p>
          <p>{tr.verifyFirst}</p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button className="hover:underline inline-flex items-center gap-1" onClick={() => app.navigate({ name: "settings" })}>
              {tr.safetyTitle} <ExternalLink className="h-3 w-3" />
            </button>
            <button className="hover:underline" onClick={() => app.navigate({ name: "legal", slug: "privacy" })}>
              {tr.footerPrivacy}
            </button>
            <button className="hover:underline" onClick={() => app.navigate({ name: "legal", slug: "terms" })}>
              {tr.footerTerms}
            </button>
            <button className="hover:underline" onClick={() => app.navigate({ name: "legal", slug: "accessibility" })}>
              {tr.footerA11y}
            </button>
            <button className="hover:underline" onClick={() => app.navigate({ name: "admin" })}>
              {tr.navAdmin}
            </button>
            <span>{tr.demoNote}</span>
          </div>
        </div>
      </footer>

      {/* FR-6.1 persistent quick-exit */}
      <button
        onClick={() => window.location.replace(EXIT_URL)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        title={tr.quickExitHint}
        aria-label={`${tr.quickExit} — ${tr.quickExitHint}`}
      >
        {tr.quickExit} ✕
      </button>

      {/* Phase 3 — mobile-first quick log (FAB bottom-left) */}
      <QuickLog />
    </div>
  );
}

export function PageTitle({ title, sub, back }: { title: string; sub?: string; back?: () => void }) {
  const tr = t(useApp((s) => s.locale));
  return (
    <div className="mb-6">
      {back ? (
        <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={back}>
          ← {tr.back}
        </Button>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {sub ? <p className="text-muted-foreground mt-1 max-w-3xl">{sub}</p> : null}
    </div>
  );
}

export function StateBadge({ state }: { state: USState }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 px-2 py-0.5 text-xs font-semibold">
      {state}
    </span>
  );
}
