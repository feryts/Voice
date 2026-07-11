"use client";

import { useEffect, useState } from "react";
import type { LoginLog } from "@/lib/data";

interface SharedIp {
  ip: string;
  usernames: string[];
}

export default function SecurityClient() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [sharedIps, setSharedIps] = useState<SharedIp[]>([]);

  useEffect(() => {
    fetch("/api/security")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.loginLogs || []);
        setSharedIps(data.sharedIps || []);
      });
  }, []);

  return (
    <div className="space-y-8">
      {sharedIps.length > 0 && (
        <section className="rounded-lg border border-console-danger/40 bg-console-danger/5 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-console-danger">
            Şüpheli — Aynı IP'den Birden Fazla Hesap
          </p>
          <div className="mt-3 space-y-2">
            {sharedIps.map((row) => (
              <div key={row.ip} className="flex items-center justify-between text-sm">
                <span className="font-mono text-console-text">{row.ip}</span>
                <span className="text-console-muted">{row.usernames.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-console-line bg-console-panel p-5">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-console-muted">
          Giriş Kayıtları
        </p>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-console-line text-console-muted">
              <th className="pb-2 font-normal">Kullanıcı</th>
              <th className="pb-2 font-normal">IP</th>
              <th className="pb-2 font-normal">Cihaz</th>
              <th className="pb-2 font-normal">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-console-line/50">
                <td className="py-2.5 text-console-text">{log.username}</td>
                <td className="py-2.5 font-mono text-console-teal">{log.ip}</td>
                <td className="py-2.5 text-console-muted">{log.device}</td>
                <td className="py-2.5 font-mono text-xs text-console-muted">
                  {new Date(log.at).toLocaleString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
