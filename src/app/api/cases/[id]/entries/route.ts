import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";

// POST /api/cases/[id]/entries — create journal entry (immutable createdAt, FR-2.3)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const c = await db.case.findUnique({ where: { id } });
  if (!c || c.userId !== user.id) return NextResponse.json({ error: "not_found" }, { status: 404 });
  try {
    const b = await req.json();
    const validTypes = ["communication", "payment", "document", "promise", "note", "deadline"];
    if (!validTypes.includes(b.type) || !b.title || !b.occurredAt) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const entry = await db.entry.create({
      data: {
        caseId: id,
        type: b.type,
        occurredAt: new Date(b.occurredAt),
        title: String(b.title).slice(0, 300),
        body: b.body ? String(b.body).slice(0, 20000) : null,
        data: b.data ? JSON.stringify(b.data) : null,
      },
    });
    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
