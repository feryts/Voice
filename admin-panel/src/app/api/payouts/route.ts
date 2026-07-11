import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { payouts } from "@/lib/data";

export async function GET() {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  return NextResponse.json({ payouts });
}

export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const { id, status } = await req.json();
  const payout = payouts.find((p) => p.id === id);
  if (!payout) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }
  if (status === "APPROVED" || status === "REJECTED") {
    payout.status = status;
  }

  return NextResponse.json({ ok: true, payouts });
}
