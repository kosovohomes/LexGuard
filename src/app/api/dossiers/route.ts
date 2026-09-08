import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";
import { RULE_LIBRARY_VERSION } from "@/lib/lexguard/rules";

// POST /api/dossiers — record dossier generation (north-star metric, PRD §14)
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const b = await req.json();
    const c = await db.case.findUnique({ where: { id: String(b.caseId ?? "") } });
    if (!c || c.userId !== user.id) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const d = await db.dossier.create({
      data: {
        caseId: c.id,
        specJson: JSON.stringify({ ruleLibraryVersion: RULE_LIBRARY_VERSION }),
        unbranded: !!b.unbranded,
      },
    });
    return NextResponse.json({ dossier: { id: d.id, createdAt: d.createdAt } });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
