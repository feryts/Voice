import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import CustomerServiceClient from "./CustomerServiceClient";

export default function CustomerServicePage() {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <>
      <Topbar session={session} title="Müşteri Hizmetleri" />
      <main className="p-8">
        <CustomerServiceClient />
      </main>
    </>
  );
}
