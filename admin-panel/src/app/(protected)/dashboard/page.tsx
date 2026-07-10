import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import WaveformDivider from "@/components/WaveformDivider";
import { users, payouts, coinPackages, agencies, loginLogs } from "@/lib/data";

export default function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const pendingPayouts = payouts.filter((p) => p.status === "PENDING").length;
  const activeHosts = users.filter((u) => u.role === "HOST" && !u.banned).length;

  return (
    <>
      <Topbar session={session} title="Genel Bakış" />
      <main className="p-8">
        <WaveformDivider className="mb-6" />

        {session.role === "SUPER_ADMIN" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Toplam Kullanıcı" value={String(totalUsers)} accent="teal" />
            <StatCard label="Aktif Yayıncı" value={String(activeHosts)} accent="amber" />
            <StatCard label="Bekleyen Ödeme" value={String(pendingPayouts)} accent="violet" />
            <StatCard label="Banlı Kullanıcı" value={String(bannedUsers)} accent="danger" />
          </div>
        )}

        {session.role === "AGENCY_MANAGER" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Ajansındaki Yayıncı"
              value={String(users.filter((u) => u.agencyId === session.agencyId).length)}
              accent="teal"
            />
            <StatCard label="Ajans Sayfası" value="→ Ajans Kazançları" accent="amber" sub="Detaylı rapor için sol menü" />
          </div>
        )}

        {session.role === "MODERATOR" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatCard label="Toplam Kullanıcı" value={String(totalUsers)} accent="teal" />
            <StatCard label="Banlı Kullanıcı" value={String(bannedUsers)} accent="danger" />
            <StatCard label="Giriş Kaydı" value={String(loginLogs.length)} accent="violet" />
          </div>
        )}

        <div className="mt-10 rounded-lg border border-console-line bg-console-panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-console-muted">Not</p>
          <p className="mt-2 text-sm leading-relaxed text-console-text">
            Bu panel demo verilerle çalışıyor. Sunucu yeniden başladığında (her deploy'da) veriler
            sıfırlanır. Gerçek veriye bağlamak için <code className="font-mono text-console-teal">src/lib/data.ts</code> içindeki
            fonksiyonları bir veritabanı (PostgreSQL + Prisma önerilir) sorgularıyla değiştirmen yeterli.
          </p>
        </div>
      </main>
    </>
  );
}
