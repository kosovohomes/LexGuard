import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession, normalizeEmail } from "@/lib/lexguard/auth";

export async function POST(req: Request) {
  try {
    const { email, password, state, locale, ageConfirmed } = await req.json();
    const norm = normalizeEmail(String(email ?? ""));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (!password || String(password).length < 8) {
      return NextResponse.json({ error: "weak_password" }, { status: 400 });
    }
    if (ageConfirmed !== true) {
      // PRD §9.2 — neutral age gate (16+); enforced server-side as well
      return NextResponse.json({ error: "age_required" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email: norm } });
    if (existing && !existing.deletedAt) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    const user = existing
      ? await db.user.update({
          where: { email: norm },
          data: { passwordHash: hashPassword(String(password)), deletedAt: null, state: state ?? null, locale: locale ?? "en" },
        })
      : await db.user.create({
          data: {
            email: norm,
            passwordHash: hashPassword(String(password)),
            state: state ?? null,
            locale: locale ?? "en",
          },
        });
    await createSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email, state: user.state, locale: user.locale });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
