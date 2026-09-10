"use client";

// LexGuard App Shell — header, nav, quick-exit (FR-6.1), discreet mode (FR-6.2),
// sticky footer with disclaimer (PRD §11.4).
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, TriangleAlert, BookOpen, FolderOpen, Compass, LifeBuoy, CalendarClock, Search, Settings as SettingsIcon, LogOut, Globe, ExternalLink } from "lucide-react";
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

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-2">
          <button onClick={() => app.home()} className="flex items-center gap-2.5 mr-3 shrink-0 group" aria-label="LexGuard home">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary to-[oklch(0.78_0.12_212)] text-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.72_0.155_287/50%)] transition-transform group-hover:scale-105" aria-hidden>
              <Shield className="h-4 w-4" />
            </span>
            <span className={`lg-display text-lg tracking-tight leading-none ${app.discreet ? "hidden" : "hidden sm:inline"}`}>LexGuard</span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main">
            {navItems.map((n) => (
              <button
                key={n.label}
                onClick={n.view}
                aria-current={n.active ? "page" : undefined}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors ${
                  n.active
                    ? "bg-primary/15 font-semibold text-primary ring-1 ring-inset ring-primary/25"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 ml-auto">
            <Select value={app.userState ?? ""} onValueChange={(s) => app.setUserState(s as USState)} aria-label={tr.chooseState}>
              <SelectTrigger className="w-[76px] h-9" size="sm">
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
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => app.setLocale(app.locale === "en" ? "es" : "en")} aria-label="Language">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{tr.langLabel}</span>
            </Button>
            {app.user ? (
              <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground" onClick={() => void app.signOut()} aria-label={tr.logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground" onClick={() => app.navigate({ name: "settings" })} aria-label={tr.navSettings}>
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav — scrollable pill row */}
        <div className="md:hidden border-t border-border/70">
          <div className="mx-auto max-w-6xl px-3 py-2 flex gap-1.5 overflow-x-auto">
            {navItems.map((n) => (
              <button
                key={n.label}
                onClick={n.view}
                aria-current={n.active ? "page" : undefined}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
                  n.active
                    ? "border-primary/30 bg-primary/15 font-semibold text-primary"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:text-accent-foreground"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 outline-none">{children}</main>

      <footer className="mt-auto border-t border-border/60 bg-[oklch(0.13_0.02_278)]/60 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-3xl space-y-2 text-sm text-muted-foreground">
            <p className="lg-eyebrow">{app.locale === "es" ? "Aviso importante" : "Important notice"}</p>
            <p className="font-medium text-foreground leading-relaxed">{tr.disclaimer}</p>
            <p className="leading-relaxed">{tr.verifyFirst}</p>
          </div>
          <nav className="flex flex-wrap md:flex-col items-start gap-x-4 gap-y-1.5 text-sm md:justify-self-end" aria-label="Footer">
            <button className="lg-link inline-flex items-center gap-1" onClick={() => app.navigate({ name: "settings" })}>
              {tr.safetyTitle} <ExternalLink className="h-3 w-3" />
            </button>
            <button className="lg-link" onClick={() => app.navigate({ name: "legal", slug: "privacy" })}>
              {tr.footerPrivacy}
            </button>
            <button className="lg-link" onClick={() => app.navigate({ name: "legal", slug: "terms" })}>
              {tr.footerTerms}
            </button>
            <button className="lg-link" onClick={() => app.navigate({ name: "legal", slug: "accessibility" })}>
              {tr.footerA11y}
            </button>
            <button className="lg-link" onClick={() => app.navigate({ name: "admin" })}>
              {tr.navAdmin}
            </button>
            <span className="text-xs text-muted-foreground/80">{tr.demoNote}</span>
          </nav>
        </div>
      </footer>

      {/* FR-6.1 persistent quick-exit */}
      <button
        onClick={() => window.location.replace(EXIT_URL)}
        className="fixed bottom-4 right-4 z-50 inline-flex h-11 items-center gap-2 rounded-full bg-destructive px-4 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
        title={tr.quickExitHint}
        aria-label={`${tr.quickExit} — ${tr.quickExitHint}`}
      >
        <TriangleAlert className="h-4 w-4" aria-hidden />
        {tr.quickExit}
      </button>

      {/* Phase 3 — mobile-first quick log (FAB bottom-left) */}
      <QuickLog />
    </div>
  );
}

export function PageTitle({ title, sub, back }: { title: string; sub?: string; back?: () => void }) {
  const tr = t(useApp((s) => s.locale));
  return (
    <div className="mb-8">
      {back ? (
        <Button variant="ghost" size="sm" className="mb-3 -ml-2 gap-1.5 text-muted-foreground" onClick={back}>
          <ArrowLeft className="h-4 w-4" /> {tr.back}
        </Button>
      ) : null}
      <h1 className="lg-display text-3xl sm:text-[2.5rem] leading-tight tracking-tight">{title}</h1>
      {sub ? <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">{sub}</p> : null}
    </div>
  );
}

export function StateBadge({ state }: { state: USState }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold tracking-wide">
      {state}
    </span>
  );
}
