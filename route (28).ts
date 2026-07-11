import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import WaveformDivider from "@/components/WaveformDivider";
import { users, payouts, supportTickets, rooms } from "@/lib/data";

export default function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const pendingPayouts = payouts.filter((p) => p.status === "PENDING").length;
  const activeHosts = users.filter((u) => u.role === "HOST" && !u.banned).length;
  const openTickets = supportTickets.filter((t) => t.status !== "CLOSED").length;
  const liveRooms = rooms.filter((r) => r.live).length;

  const canBanIp = session.isSuperAdmin || session.permissions.includes("BAN_IP");
  const canAgency = session.isSuperAdmin || session.permissions.includes("AGENCY_MANAGEMENT");
  const canSupport = session.isSuperAdmin || session.permissions.includes("CUSTOMER_SERVICE");

  return (
    <>
      <Topbar session={session} title="Genel Bakış" />
      <main className="p-8">
        <WaveformDivider className="mb-6" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Canlı Oda" value={String(liveRooms)} accent="amber" sub="Herkes odalara girip çıkabilir" />

          {session.isSuperAdmin && (
            <StatCard label="Bekleyen Ödeme" value={String(pendingPayouts)} accent="violet" />
          )}

          {canBanIp && <StatCard label="Banlı Kullanıcı" value={String(bannedUsers)} accent="danger" />}
          {canBanIp && <StatCard label="Toplam Kullanıcı" value={String(totalUsers)} accent="teal" />}

          {canAgency && !canBanIp && (
            <StatCard label="Aktif Yayıncı" value={String(activeHosts)} accent="teal" />
          )}

          {canSupport && <StatCard label="Açık Destek Talebi" value={String(openTickets)} accent="violet" />}
        </div>

        <div className="mt-10 rounded-lg border border-console-line bg-console-panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-console-muted">Not</p>
          <p className="mt-2 text-sm leading-relaxed text-console-text">
            Bu panel demo verilerle çalışıyor. Sunucu yeniden başladığında (her deploy'da) veriler
            sıfırlanır. Gerçek veriye bağlamak için <code className="font-mono text-console-teal">src/lib/data.ts</code> içindeki
            fonksiyonları bir veritabanı sorgularıyla değiştirmen yeterli.
          </p>
        </div>
      </main>
    </>
  );
}
