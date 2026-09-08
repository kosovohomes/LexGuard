import { NextResponse } from "next/server";
import { currentUser } from "@/lib/lexguard/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user });
}
