import { PERMISSION_LABEL, type AdminPermission } from "@/lib/data";

const PERMISSION_COLOR: Record<AdminPermission, string> = {
  BAN_IP: "bg-console-danger/15 text-console-danger border-console-danger/40",
  AGENCY_MANAGEMENT: "bg-console-violet/15 text-console-violet border-console-violet/40",
  CUSTOMER_SERVICE: "bg-console-teal/15 text-console-teal border-console-teal/40",
  ROOM_MONITOR: "bg-console-amber/15 text-console-amber border-console-amber/40",
};

export default function PermissionBadges({
  isSuperAdmin,
  permissions,
}: {
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
}) {
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-console-amber/40 bg-console-amber/15 px-3 py-1 text-xs font-mono tracking-wide text-console-amber">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Süper Admin
      </span>
    );
  }

  if (permissions.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-console-line px-3 py-1 text-xs font-mono tracking-wide text-console-muted">
        Onay Bekliyor
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {permissions.map((p) => (
        <span
          key={p}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono tracking-wide ${PERMISSION_COLOR[p]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {PERMISSION_LABEL[p]}
        </span>
      ))}
    </div>
  );
}
