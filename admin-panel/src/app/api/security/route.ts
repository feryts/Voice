import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { loginLogs, findSharedIps } from "@/lib/data";

export async function GET() {
  const session = getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }
  return NextResponse.json({ loginLogs, sharedIps: findSharedIps() });
}
