import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";
import { searchDocs, type SearchDoc } from "@/lib/lexguard/search";

// GET /api/search?q=... — global search across the signed-in user's own data
// (cases, journal entries incl. structured payloads, documents incl. extracted text).
// Scoring runs on the server with the same isomorphic engine used for local mode;
// document bytes are never selected or transmitted.
export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 200);
  if (!q) return NextResponse.json({ hits: [] });
  try {
    const [cases, entries, documents] = await Promise.all([
      db.case.findMany({
        where: { userId: user.id },
        select: { id: true, attorneyName: true, firm: true, caseType: true, state: true, status: true },
      }),
      db.entry.findMany({
        where: { case: { userId: user.id } },
        select: { id: true, caseId: true, type: true, occurredAt: true, title: true, body: true, data: true },
        orderBy: { occurredAt: "desc" },
        take: 2000,
      }),
      db.document.findMany({
        where: { case: { userId: user.id } },
        select: { id: true, caseId: true, filename: true, tags: true, ocrText: true, createdAt: true },
      }),
    ]);
    const label = (caseId: string) => {
      const c = cases.find((x) => x.id === caseId);
      return c ? (c.firm ? `${c.attorneyName} — ${c.firm}` : c.attorneyName) : "";
    };
    const docs: SearchDoc[] = [];
    for (const c of cases) {
      docs.push({
        id: `case:${c.id}`,
        kind: "case",
        caseId: c.id,
        caseLabel: label(c.id),
        type: "case",
        title: c.firm ? `${c.attorneyName} — ${c.firm}` : c.attorneyName,
        text: [c.caseType, c.state, c.status].join(" "),
      });
    }
    for (const e of entries) {
      let amount: number | undefined;
      if (e.type === "payment" && e.data) {
        try {
          amount = (JSON.parse(e.data) as { amount?: number }).amount;
        } catch {
          amount = undefined;
        }
      }
      docs.push({
        id: `entry:${e.id}`,
        kind: "entry",
        caseId: e.caseId,
        caseLabel: label(e.caseId),
        type: e.type,
        occurredAt: e.occurredAt.toISOString(),
        title: e.title,
        text: [e.body ?? "", e.data ?? ""].join("\n"),
        amount,
      });
    }
    for (const d of documents) {
      docs.push({
        id: `doc:${d.id}`,
        kind: "document",
        caseId: d.caseId,
        caseLabel: label(d.caseId),
        type: d.tags,
        occurredAt: d.createdAt.toISOString(),
        title: d.filename,
        text: [d.tags, d.ocrText ?? ""].join("\n"),
      });
    }
    return NextResponse.json({ hits: searchDocs(docs, q, 30) });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
