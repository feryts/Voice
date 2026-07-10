import RoleBadge from "./RoleBadge";
import type { Session } from "@/lib/auth";

export default function Topbar({ session, title }: { session: Session; title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-console-line bg-console-bg px-8 py-5">
      <h1 className="font-display text-xl font-bold text-console-text">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-console-muted">{session.name}</span>
        <RoleBadge role={session.role} />
      </div>
    </header>
  );
}
