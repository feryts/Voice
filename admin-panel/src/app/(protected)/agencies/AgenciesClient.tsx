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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [commissionRate, setCommissionRate] = useState("20");
  const [hostQuota, setHostQuota] = useState("10");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function load() {
    fetch("/api/agencies")
      .then((r) => r.json())
      .then((data) => setReport(data.report || []));
  }

  useEffect(load, []);

  async function createAgency(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const res = await fetch("/api/agencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        commissionRate: Number(commissionRate) / 100,
        hostQuota: Number(hostQuota),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error || "Ajans oluşturulamadı.");
      return;
    }
    setName("");
    setCommissionRate("20");
    setHostQuota("10");
    setShowForm(false);
    load();
  }

  async function toggleClose(agency: Agency) {
    setBusyId(agency.id);
    await fetch("/api/agencies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agencyId: agency.id, action: agency.closed ? "reopen" : "close" }),
    });
    load();
    setBusyId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-md border border-console-amber/40 px-3 py-1.5 text-xs text-console-amber hover:bg-console-amber/10"
        >
          {showForm ? "Vazgeç" : "+ Yeni Ajans"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createAgency} className="rounded-lg border border-console-line bg-console-panel p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase text-console-muted">Ajans Adı</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase text-console-muted">Komisyon (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase text-console-muted">Yayıncı Kotası</label>
              <input
                type="number"
                value={hostQuota}
                onChange={(e) => setHostQuota(e.target.value)}
                className="w-full rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
              />
            </div>
          </div>
          {formError && <p className="mt-3 text-sm text-console-danger">{formError}</p>}
          <button
            type="submit"
            className="mt-4 rounded-md bg-console-amber px-4 py-2 text-sm font-medium text-console-bg hover:opacity-90"
          >
            Oluştur
          </button>
        </form>
      )}

      {report.map(({ agency, hosts, grossUSD, commissionUSD, hostShareUSD }) => (
        <section
          key={agency.id}
          className={`rounded-lg border p-5 ${
            agency.closed ? "border-console-danger/40 bg-console-danger/5 opacity-70" : "border-console-line bg-console-panel"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-bold text-console-text">{agency.name}</p>
                {agency.closed && (
                  <span className="rounded-full border border-console-danger/40 px-2 py-0.5 text-[11px] text-console-danger">
                    Kapatıldı
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-console-muted">
                Komisyon %{(agency.commissionRate * 100).toFixed(0)} · Yayıncı kotası: {hosts.length}/{agency.hostQuota}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-console-amber">${grossUSD.toFixed(2)}</p>
                <p className="text-xs text-console-muted">toplam brüt kazanç</p>
              </div>
              <button
                disabled={busyId === agency.id}
                onClick={() => toggleClose(agency)}
                className={`rounded-md border px-3 py-1.5 text-xs disabled:opacity-40 ${
                  agency.closed
                    ? "border-console-teal/40 text-console-teal hover:bg-console-teal/10"
                    : "border-console-danger/40 text-console-danger hover:bg-console-danger/10"
                }`}
              >
                {agency.closed ? "Yeniden Aç" : "Kapat"}
              </button>
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
                <th className="pb-2 font-normal">Kota</th>
                <th className="pb-2 font-normal">Durum</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((h) => (
                <tr key={h.id} className="border-b border-console-line/50">
                  <td className="py-2.5 text-console-text">{h.username}</td>
                  <td className="py-2.5 font-mono text-console-text">${h.totalEarningsUSD.toFixed(2)}</td>
                  <td className="py-2.5 font-mono text-xs text-console-muted">{h.hostQuota?.toLocaleString("tr-TR")} coin</td>
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
