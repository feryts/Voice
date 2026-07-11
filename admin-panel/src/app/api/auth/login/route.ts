import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, encodeSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json({ error: "Telefon numarası ve şifre gerekli." }, { status: 400 });
  }

  const { session, error } = checkCredentials(phone, password);
  if (error || !session) {
    return NextResponse.json({ error: error || "Giriş başarısız." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
