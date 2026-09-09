import { NextResponse } from "next/server";
import { RULES, RULE_LIBRARY_VERSION } from "@/lib/lexguard/rules";

// GET /api/health — machine-readable liveness for the status page (PRD §9.3).
// Returns no personal data and touches no user tables.
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "lexguard",
    time: new Date().toISOString(),
    ruleLibraryVersion: RULE_LIBRARY_VERSION,
    rulesLive: RULES.length,
  });
}
