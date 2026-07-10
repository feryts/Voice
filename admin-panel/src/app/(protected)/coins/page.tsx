import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import CoinsClient from "./CoinsClient";

export default function CoinsPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Coin Fiyatları" />
      <main className="p-8">
        <CoinsClient />
      </main>
    </>
  );
}
