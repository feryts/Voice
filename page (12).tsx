import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import AdminManagementClient from "./AdminManagementClient";

export default function AdminManagementPage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Admin Yönetimi" />
      <main className="p-8">
        <p className="mb-5 text-sm text-console-muted">
          Kayıt olan adaylara buradan yetki ata (en fazla 5 admin). Bir adminin birden fazla yetkisi
          olabilir. Hiçbir yetki verilmezse hesap "onay bekliyor" durumunda kalır ve giriş yapamaz.
        </p>
        <AdminManagementClient />
      </main>
    </>
  );
}
