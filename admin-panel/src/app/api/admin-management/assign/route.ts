import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assignPermissions, countApprovedNonSuperAdmins, adminAccounts, MAX_APPOINTED_ADMINS, type AdminPermission } from "@/lib/data";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session || !session.isSuperAdmin) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const { adminId, permissions } = await req.json() as { adminId: string; permissions: AdminPermission[] };

  const target = adminAccounts.find((a) => a.id === adminId);
  if (!target) {
    return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
  }

  const alreadyApproved = target.approved;
  const wantsToApprove = permissions.length > 0;

  if (!alreadyApproved && wantsToApprove && countApprovedNonSuperAdmins() >= MAX_APPOINTED_ADMINS) {
    return NextResponse.json(
      { error: `En fazla ${MAX_APPOINTED_ADMINS} admin atayabilirsin. Önce birinin yetkisini kaldır.` },
      { status: 400 }
    );
  }

  const updated = assignPermissions(adminId, permissions);
  return NextResponse.json({ ok: true, admin: { ...updated, password: undefined } });
}
