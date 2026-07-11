import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import SecurityClient from "./SecurityClient";

export default function SecurityPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="IP Güvenlik" />
      <main className="p-8">
        <SecurityClient />
      </main>
    </>
  );
}
