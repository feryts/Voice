import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { users } from "@/lib/data";

export async function GET() {
  const session = getSession();
  if (!session || (!session.isSuperAdmin && !session.permissions.includes("BAN_IP"))) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  return NextResponse.json({ users });
}
