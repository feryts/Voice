"use client";

import { useEffect, useState } from "react";
import type { Agency, AppUser } from "@/lib/data";

interface AgencyReport {
  agency: Agency;
  hosts: AppUser[];
  grossUSD: number;
  commissionUSD: number;
  hostShareUSD: number;
}

export default function AgenciesClient() {
  const [report, setReport] = useState<AgencyReport[]>([]);
  const [scope, setScope] = useState<"ALL" | "OWN" | null>(null);

  useEffect(() => {
    fetch("/api/agencies")
      .then((r) => r.json())
      .then((data) => {
        setReport(data.report || []);
        setScope(data.scope || null);
      });
  }, []);

  return (
    <div className="space-y-6">
      {scope === "OWN" && (
        <p className="text-sm text-console-muted">
          Sadece kendi ajansının kazanç raporunu görüyorsun.
        </p>
      )}
      {report.map(({ agency, hosts, grossUSD, commissionUSD, hostShareUSD }) => (
        <section key={agency.id} className="rounded-lg border border-console-line bg-console-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-console-text">{agency.name}</p>
              <p className="font-mono text-xs text-console-muted">
                Komisyon oranı: %{(agency.commissionRate * 100).toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-console-amber">${grossUSD.toFixed(2)}</p>
              <p className="text-xs text-console-muted">toplam brüt kazanç</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-console-line bg-console-panelAlt p-3">
              <p className="font-mono text-[11px] uppercase text-console-muted">Ajans Payı</p>
              <p className="mt-1 font-mono text-lg text-console-violet">${commissionUSD.toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-console-line bg-console-panelAlt p-3">
              <p className="font-mono text-[11px] uppercase text-console-muted">Yayıncı Payı</p>
              <p className="mt-1 font-mono text-lg text-console-teal">${hostShareUSD.toFixed(2)}</p>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-console-line text-console-muted">
                <th className="pb-2 font-normal">Yayıncı</th>
                <th className="pb-2 font-normal">Kazanç</th>
                <th className="pb-2 font-normal">Durum</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((h) => (
                <tr key={h.id} className="border-b border-console-line/50">
                  <td className="py-2.5 text-console-text">{h.username}</td>
                  <td className="py-2.5 font-mono text-console-text">${h.totalEarningsUSD.toFixed(2)}</td>
                  <td className="py-2.5">
                    {h.banned ? (
                      <span className="text-xs text-console-danger">Banlı</span>
                    ) : (
                      <span className="text-xs text-console-muted">Aktif</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
