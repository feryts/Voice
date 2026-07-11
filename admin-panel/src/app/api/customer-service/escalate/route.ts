import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { escalateTicket } from "@/lib/data";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session || (!session.isSuperAdmin && !session.permissions.includes("CUSTOMER_SERVICE"))) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const { ticketId } = await req.json();
  const ticket = escalateTicket(ticketId);
  if (!ticket) return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true, ticket });
}
