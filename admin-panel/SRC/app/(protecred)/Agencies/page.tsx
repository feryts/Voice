import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import AgenciesClient from "./AgenciesClient";

export default function AgenciesPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Ajans Kazançları" />
      <main className="p-8">
        <AgenciesClient />
      </main>
    </>
  );
}
