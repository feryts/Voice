import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { agencies, getAgencyEarnings, createAgency, closeAgency, reopenAgency } from "@/lib/data";

function hasAgencyAccess(session: ReturnType<typeof getSession>) {
  return !!session && (session.isSuperAdmin || session.permissions.includes("AGENCY_MANAGEMENT"));
}

export async function GET() {
  const session = getSession();
  if (!hasAgencyAccess(session)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const report = agencies.map((a) => getAgencyEarnings(a.id));
  return NextResponse.json({ report });
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!hasAgencyAccess(session)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const { name, commissionRate, hostQuota } = await req.json();
  if (!name || typeof commissionRate !== "number" || typeof hostQuota !== "number") {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }
  const agency = createAgency(name, commissionRate, hostQuota);
  return NextResponse.json({ ok: true, agency });
}

export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!hasAgencyAccess(session)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  const { agencyId, action } = await req.json();
  const agency = action === "close" ? closeAgency(agencyId) : action === "reopen" ? reopenAgency(agencyId) : null;
  if (!agency) {
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, agency });
}
