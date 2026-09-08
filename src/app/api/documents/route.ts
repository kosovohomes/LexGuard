import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";
import { createHash } from "crypto";

const MAX = 25 * 1024 * 1024; // PRD FR-2 acceptance: 25MB per file

// POST /api/documents (multipart) — upload to user-owned case
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const caseId = String(form.get("caseId") ?? "");
    const tags = String(form.get("tags") ?? "other");
    if (!file || !caseId) return NextResponse.json({ error: "invalid" }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: "too_big" }, { status: 413 });
    const c = await db.case.findUnique({ where: { id: caseId } });
    if (!c || c.userId !== user.id) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const doc = await db.document.create({
      data: {
        caseId,
        filename: file.name.slice(0, 300),
        mime: file.type || "application/octet-stream",
        size: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        tags: tags.slice(0, 200),
        data: bytes,
      },
      select: { id: true, caseId: true, filename: true, mime: true, size: true, tags: true, createdAt: true },
    });
    return NextResponse.json({ document: doc });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
