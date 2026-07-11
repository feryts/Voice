import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import UsersClient from "./UsersClient";

export default function UsersPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Kullanıcılar & Banlar" />
      <main className="p-8">
        <UsersClient />
      </main>
    </>
  );
}
