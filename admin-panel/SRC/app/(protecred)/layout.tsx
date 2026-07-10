import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-console-bg">
      <Sidebar role={session.role} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
