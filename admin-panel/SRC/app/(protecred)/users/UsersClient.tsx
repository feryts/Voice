"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppUser } from "@/lib/data";

export default function UsersClient() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.phone.includes(q) || u.lastIp.includes(q)
    );
  }, [users, query]);

  async function toggleBan(user: AppUser) {
    setBusyId(user.id);
    await fetch(`/api/users/${user.id}/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !user.banned }),
    });
    load();
    setBusyId(null);
  }

  return (
    <div className="rounded-lg border border-console-line bg-console-panel p-5">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Kullanıcı adı, telefon veya IP ile ara…"
        className="mb-4 w-full max-w-sm rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
      />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-console-line text-console-muted">
            <th className="pb-2 font-normal">Kullanıcı</th>
            <th className="pb-2 font-normal">Coin Bakiyesi</th>
            <th className="pb-2 font-normal">Son IP</th>
            <th className="pb-2 font-normal">Durum</th>
            <th className="pb-2 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="border-b border-console-line/50">
              <td className="py-3">
                <p className="text-console-text">{u.username}</p>
                <p className="font-mono text-xs text-console-muted">{u.phone}</p>
              </td>
              <td className="py-3 font-mono text-console-text">{u.coinBalance.toLocaleString("tr-TR")}</td>
              <td className="py-3 font-mono text-xs text-console-muted">{u.lastIp}</td>
              <td className="py-3">
                {u.banned ? (
                  <span className="rounded-full border border-console-danger/40 px-2.5 py-1 text-xs text-console-danger">
                    Banlı
                  </span>
                ) : (
                  <span className="rounded-full border border-console-teal/40 px-2.5 py-1 text-xs text-console-teal">
                    Aktif
                  </span>
                )}
              </td>
              <td className="py-3 text-right">
                <button
                  disabled={busyId === u.id}
                  onClick={() => toggleBan(u)}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                    u.banned
                      ? "border-console-teal/40 text-console-teal hover:bg-console-teal/10"
                      : "border-console-danger/40 text-console-danger hover:bg-console-danger/10"
                  }`}
                >
                  {u.banned ? "Ban Kaldır" : "Banla"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
