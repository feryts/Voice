import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { users } from "@/lib/data";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || (!session.isSuperAdmin && !session.permissions.includes("BAN_IP"))) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const { banned } = await req.json();
  const user = users.find((u) => u.id === params.id);
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }
  user.banned = Boolean(banned);

  return NextResponse.json({ ok: true, user });
}
