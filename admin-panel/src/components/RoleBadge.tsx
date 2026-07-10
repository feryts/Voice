import { ROLE_LABEL } from "@/lib/permissions";
import type { Role } from "@/lib/data";

const COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-console-amber/15 text-console-amber border-console-amber/40",
  AGENCY_MANAGER: "bg-console-violet/15 text-console-violet border-console-violet/40",
  MODERATOR: "bg-console-teal/15 text-console-teal border-console-teal/40",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono tracking-wide ${COLORS[role]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ROLE_LABEL[role]}
    </span>
  );
}
