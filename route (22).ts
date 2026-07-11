import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import RequestsClient from "./RequestsClient";

export default function RequestsPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title={session.isSuperAdmin ? "Gelen Talepler" : "Taleplerim"} />
      <main className="p-8">
        <RequestsClient isSuperAdmin={session.isSuperAdmin} />
      </main>
    </>
  );
}
