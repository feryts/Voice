"use client";

import { useEffect, useState } from "react";
import { PERMISSION_LABEL, MAX_APPOINTED_ADMINS, type AdminPermission } from "@/lib/data";

interface SafeAdmin {
  id: string;
  phone: string;
  name: string;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
  approved: boolean;
  createdAt: string;
}

const ALL_PERMISSIONS: AdminPermission[] = ["BAN_IP", "AGENCY_MANAGEMENT", "CUSTOMER_SERVICE", "ROOM_MONITOR"];

export default function AdminManagementClient() {
  const [admins, setAdmins] = useState<SafeAdmin[]>([]);
  const [draft, setDraft] = useState<Record<string, AdminPermission[]>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin-management")
      .then((r) => r.json())
      .then((data) => {
        const list: SafeAdmin[] = data.admins || [];
        setAdmins(list);
        setDraft((prev) => {
          const next = { ...prev };
          for (const a of list) {
            if (!next[a.id]) next[a.id] = a.permissions;
          }
          return next;
        });
      });
  }

  useEffect(load, []);

  const approvedCount = admins.filter((a) => a.approved && !a.isSuperAdmin).length;

  function togglePermission(adminId: string, perm: AdminPermission) {
    setDraft((prev) => {
      const current = prev[adminId] || [];
      const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
      return { ...prev, [adminId]: next };
    });
  }

  async function save(adminId: string) {
    setBusyId(adminId);
    setError(null);
    const res = await fetch("/api/admin-management/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, permissions: draft[adminId] || [] }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "İşlem başarısız.");
      setBusyId(null);
      return;
    }
    load();
    setBusyId(null);
  }

  async function revoke(adminId: string) {
    setBusyId(adminId);
    await fetch("/api/admin-management/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId }),
    });
    load();
    setBusyId(null);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-console-line bg-console-panel p-4 text-sm text-console-muted">
        Atanmış admin: <span className="font-mono text-console-text">{approvedCount}</span> /{" "}
        <span className="font-mono text-console-text">{MAX_APPOINTED_ADMINS}</span>
      </div>
      {error && (
        <div className="rounded-md border border-console-danger/40 bg-console-danger/5 px-4 py-2.5 text-sm text-console-danger">
          {error}
        </div>
      )}

      {admins
        .filter((a) => !a.isSuperAdmin)
        .map((admin) => (
          <div key={admin.id} className="rounded-lg border border-console-line bg-console-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-console-text">{admin.name}</p>
                <p className="font-mono text-xs text-console-muted">{admin.phone}</p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs ${
                  admin.approved
                    ? "border-console-teal/40 text-console-teal"
                    : "border-console-line text-console-muted"
                }`}
              >
                {admin.approved ? "Yetkili" : "Onay Bekliyor"}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map((perm) => {
                const active = (draft[admin.id] || []).includes(perm);
                return (
                  <button
                    key={perm}
                    onClick={() => togglePermission(admin.id, perm)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "border-console-amber bg-console-amber/15 text-console-amber"
                        : "border-console-line text-console-muted hover:bg-console-panelAlt"
                    }`}
                  >
                    {PERMISSION_LABEL[perm]}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => save(admin.id)}
                disabled={busyId === admin.id}
                className="rounded-md bg-console-amber px-4 py-2 text-xs font-medium text-console-bg hover:opacity-90 disabled:opacity-40"
              >
                Yetkileri Kaydet
              </button>
              {admin.approved && (
                <button
                  onClick={() => revoke(admin.id)}
                  disabled={busyId === admin.id}
                  className="rounded-md border border-console-danger/40 px-4 py-2 text-xs text-console-danger hover:bg-console-danger/10 disabled:opacity-40"
                >
                  Yetkiyi Tamamen Kaldır
                </button>
              )}
            </div>
          </div>
        ))}

      {admins.filter((a) => !a.isSuperAdmin).length === 0 && (
        <p className="text-sm text-console-muted">Henüz kayıt olan admin adayı yok.</p>
      )}
    </div>
  );
}
