import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/lexguard/auth";

// GET /api/documents/[id] — authenticated download (ownership enforced)
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const doc = await db.document.findUnique({ where: { id }, include: { case: true } });
  if (!doc || doc.case.userId !== user.id) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const body = Buffer.from(doc.data);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": doc.mime,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

// DELETE /api/documents/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const doc = await db.document.findUnique({ where: { id }, include: { case: true } });
  if (!doc || doc.case.userId !== user.id) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await db.document.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
