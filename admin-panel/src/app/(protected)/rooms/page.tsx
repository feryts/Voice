import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import RoomsClient from "./RoomsClient";

export default function RoomsPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const canStealth = session.isSuperAdmin || session.permissions.includes("ROOM_MONITOR");

  return (
    <>
      <Topbar session={session} title="Odalar" />
      <main className="p-8">
        <p className="mb-4 text-sm text-console-muted">
          Tüm adminler odalara normal modda girip çıkabilir.
          {canStealth ? " Oda Kontrolü yetkin olduğu için gizli modda da girebilirsin." : ""}
        </p>
        <RoomsClient canStealth={canStealth} />
      </main>
    </>
  );
}
