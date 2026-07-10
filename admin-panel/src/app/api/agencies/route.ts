import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { agencies, getAgencyEarnings } from "@/lib/data";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  if (session.role === "SUPER_ADMIN") {
    const report = agencies.map((a) => getAgencyEarnings(a.id));
    return NextResponse.json({ report, scope: "ALL" });
  }

  if (session.role === "AGENCY_MANAGER" && session.agencyId) {
    const report = [getAgencyEarnings(session.agencyId)];
    return NextResponse.json({ report, scope: "OWN" });
  }

  return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
}
