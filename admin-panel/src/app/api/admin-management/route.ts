import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { adminAccounts } from "@/lib/data";

export async function GET() {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  // Şifreleri response'a dahil etme
  const safe = adminAccounts.map(({ password, ...rest }) => rest);
  return NextResponse.json({ admins: safe });
}
