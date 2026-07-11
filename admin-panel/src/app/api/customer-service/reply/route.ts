import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { replyToTicket } from "@/lib/data";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session || (!session.isSuperAdmin && !session.permissions.includes("CUSTOMER_SERVICE"))) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const { ticketId, text } = await req.json();
  const ticket = replyToTicket(ticketId, text);
  if (!ticket) return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true, ticket });
}
