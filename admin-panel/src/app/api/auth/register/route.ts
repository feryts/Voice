import { NextRequest, NextResponse } from "next/server";
import { findAdminByPhone, registerAdminAccount } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { phone, password, name } = await req.json();

  if (!phone || !password || !name) {
    return NextResponse.json({ error: "İsim, telefon numarası ve şifre gerekli." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
  }
  if (findAdminByPhone(phone)) {
    return NextResponse.json({ error: "Bu telefon numarasıyla zaten bir kayıt var." }, { status: 409 });
  }

  registerAdminAccount(phone, password, name);

  return NextResponse.json({
    ok: true,
    message: "Kaydın alındı. Süper adminin sana yetki atamasını bekliyorsun.",
  });
}
