import { NextRequest, NextResponse } from "next/server";
import { checkPassword, encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
  }

  const session = checkPassword(password);
  if (!session) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, role: session.role });
  res.cookies.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 saat
  });
  return res;
}
