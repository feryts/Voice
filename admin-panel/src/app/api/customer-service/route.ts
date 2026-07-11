import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supportTickets } from "@/lib/data";

function hasAccess(session: ReturnType<typeof getSession>) {
  return !!session && (session.isSuperAdmin || session.permissions.includes("CUSTOMER_SERVICE"));
}

export async function GET() {
  const session = getSession();
  if (!hasAccess(session)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  return NextResponse.json({ tickets: supportTickets });
}
