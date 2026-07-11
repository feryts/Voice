"use client";

import { useEffect, useState } from "react";
import type { Payout } from "@/lib/data";

const STATUS_STYLE: Record<Payout["status"], string> = {
  PENDING: "text-console-amber border-console-amber/40",
  APPROVED: "text-console-teal border-console-teal/40",
  REJECTED: "text-console-danger border-console-danger/40",
};

const STATUS_LABEL: Record<Payout["status"], string> = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
};

export default function PayoutsClient() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch("/api/payouts")
      .then((r) => r.json())
      .then((data) => setPayouts(data.payouts || []));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    setBusyId(id);
    await fetch("/api/payouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
    setBusyId(null);
  }

  return (
    <div className="rounded-lg border border-console-line bg-console-panel p-5">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-console-muted">
        Ödeme Talepleri
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-console-line text-console-muted">
            <th className="pb-2 font-normal">Yayıncı</th>
            <th className="pb-2 font-normal">Tutar</th>
            <th className="pb-2 font-normal">Talep Tarihi</th>
            <th className="pb-2 font-normal">Durum</th>
            <th className="pb-2 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p) => (
            <tr key={p.id} className="border-b border-console-line/50">
              <td className="py-3 text-console-text">{p.hostName}</td>
              <td className="py-3 font-mono text-console-text">${p.amountUSD.toFixed(2)}</td>
              <td className="py-3 font-mono text-xs text-console-muted">
                {new Date(p.requestedAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="py-3">
                <span className={`rounded-full border px-2.5 py-1 text-xs ${STATUS_STYLE[p.status]}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </td>
              <td className="py-3 text-right">
                {p.status === "PENDING" && (
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={busyId === p.id}
                      onClick={() => updateStatus(p.id, "APPROVED")}
                      className="rounded-md border border-console-teal/40 px-2.5 py-1 text-xs text-console-teal hover:bg-console-teal/10 disabled:opacity-40"
                    >
                      Onayla
                    </button>
                    <button
                      disabled={busyId === p.id}
                      onClick={() => updateStatus(p.id, "REJECTED")}
                      className="rounded-md border border-console-danger/40 px-2.5 py-1 text-xs text-console-danger hover:bg-console-danger/10 disabled:opacity-40"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
