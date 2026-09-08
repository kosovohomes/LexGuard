import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession, normalizeEmail } from "@/lib/lexguard/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const norm = normalizeEmail(String(email ?? ""));
    const user = await db.user.findUnique({ where: { email: norm } });
    if (!user || user.deletedAt || !verifyPassword(String(password ?? ""), user.passwordHash)) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email, state: user.state, locale: user.locale });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
