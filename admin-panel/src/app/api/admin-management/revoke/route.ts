import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { revokeAdmin } from "@/lib/data";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const { adminId } = await req.json();
  const updated = revokeAdmin(adminId);
  if (!updated) {
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, admin: { ...updated, password: undefined } });
}
