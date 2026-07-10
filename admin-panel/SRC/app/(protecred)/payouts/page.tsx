import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import PayoutsClient from "./PayoutsClient";

export default function PayoutsPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Maaş / Ödemeler" />
      <main className="p-8">
        <PayoutsClient />
      </main>
    </>
  );
}
