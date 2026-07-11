import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { coinPackages, payoutRatePer1000Coins, setPayoutRate } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ coinPackages, payoutRatePer1000Coins });
}

export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const body = await req.json();
  const { id, priceUSD, payoutRate } = body;

  if (typeof payoutRate === "number") {
    setPayoutRate(payoutRate);
  }

  if (id && typeof priceUSD === "number") {
    const pkg = coinPackages.find((p) => p.id === id);
    if (pkg) pkg.priceUSD = priceUSD;
  }

  return NextResponse.json({ ok: true, coinPackages, payoutRatePer1000Coins });
}
