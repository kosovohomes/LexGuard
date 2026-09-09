"use client";

// LexGuard — client-side attorney accountability & case documentation platform
// Single-page app (Phase 1 MVP) assembled from view components.
// Storage modes: private account (API + SQLite) and anonymous local (browser-only).
import { useEffect } from "react";
import { AppShell } from "@/components/lexguard/AppShell";
import { LockScreen, useAutoLock } from "@/components/lexguard/LockScreen";
import { useApp } from "@/lib/lexguard/store";
import { HomeView } from "@/components/lexguard/views/Home";
import { OnboardingView } from "@/components/lexguard/views/Onboarding";
import { AuthView } from "@/components/lexguard/views/Auth";
import { GuidesView, GuideView } from "@/components/lexguard/views/Guides";
import { JournalView } from "@/components/lexguard/views/Journal";
import { CaseDetailView } from "@/components/lexguard/views/CaseDetail";
import { FlagsView } from "@/components/lexguard/views/Flags";
import { RouterView } from "@/components/lexguard/views/Router";
import { DossierView } from "@/components/lexguard/views/Dossier";
import { DirectoryView } from "@/components/lexguard/views/Directory";
import { DeadlinesView } from "@/components/lexguard/views/Deadlines";
import { LegalView } from "@/components/lexguard/views/Legal";
import { SettingsView } from "@/components/lexguard/views/Settings";
import { AdminView } from "@/components/lexguard/views/Admin";
import { SearchView } from "@/components/lexguard/views/Search";

export default function Page() {
  const app = useApp();
  useAutoLock();

  useEffect(() => {
    void app.init();
  }, []);

  if (app.locked) return <LockScreen />;
  if (!app.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" aria-hidden />
          LexGuard…
        </div>
      </div>
    );
  }

  const v = app.stack[app.stack.length - 1];

  let view: React.ReactNode;
  switch (v.name) {
    case "onboarding":
      view = <OnboardingView />;
      break;
    case "auth":
      view = <AuthView />;
      break;
    case "guides":
      view = <GuidesView />;
      break;
    case "guide":
      view = <GuideView slug={v.slug ?? ""} />;
      break;
    case "journal":
      view = <JournalView />;
      break;
    case "case":
      view = v.caseId ? <CaseDetailView caseId={v.caseId} /> : <JournalView />;
      break;
    case "flags":
      view = v.caseId ? <FlagsView caseId={v.caseId} /> : <RouterView />;
      break;
    case "router":
      view = <RouterView caseId={v.caseId} />;
      break;
    case "dossier":
      view = v.caseId ? <DossierView caseId={v.caseId} /> : <JournalView />;
      break;
    case "directory":
      view = <DirectoryView />;
      break;
    case "deadlines":
      view = <DeadlinesView />;
      break;
    case "search":
      view = <SearchView />;
      break;
    case "legal":
      view = <LegalView slug={v.slug} />;
      break;
    case "settings":
      view = <SettingsView />;
      break;
    case "admin":
      view = <AdminView />;
      break;
    default:
      view = <HomeView />;
  }

  return <AppShell>{view}</AppShell>;
}
