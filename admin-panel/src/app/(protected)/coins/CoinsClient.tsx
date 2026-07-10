"use client";

import { useEffect, useState } from "react";
import type { CoinPackage } from "@/lib/data";

export default function CoinsClient() {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((data) => {
        setPackages(data.coinPackages);
        setRate(data.payoutRatePer1000Coins);
      });
  }, []);

  async function savePackage(pkg: CoinPackage) {
    setSavingId(pkg.id);
    const res = await fetch("/api/coins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pkg.id, priceUSD: pkg.priceUSD }),
    });
    if (res.ok) {
      setSavedFlash(pkg.id);
      setTimeout(() => setSavedFlash(null), 1500);
    }
    setSavingId(null);
  }

  async function saveRate() {
    setSavingId("rate");
    await fetch("/api/coins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutRate: rate }),
    });
    setSavedFlash("rate");
    setTimeout(() => setSavedFlash(null), 1500);
    setSavingId(null);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-console-line bg-console-panel p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-console-muted">Coin Paketleri</p>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-console-line text-console-muted">
              <th className="pb-2 font-normal">Coin Miktarı</th>
              <th className="pb-2 font-normal">Fiyat (USD)</th>
              <th className="pb-2 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-console-line/50">
                <td className="py-3 font-mono text-console-text">{pkg.coins.toLocaleString("tr-TR")} coin</td>
                <td className="py-3">
                  <input
                    type="number"
                    step="0.01"
                    value={pkg.priceUSD}
                    onChange={(e) =>
                      setPackages((prev) =>
                        prev.map((p) => (p.id === pkg.id ? { ...p, priceUSD: Number(e.target.value) } : p))
                      )
                    }
                    className="w-28 rounded-md border border-console-line bg-console-panelAlt px-2 py-1.5 font-mono text-console-text outline-none focus:border-console-teal"
                  />
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => savePackage(pkg)}
                    disabled={savingId === pkg.id}
                    className="rounded-md border border-console-amber/40 px-3 py-1.5 text-xs text-console-amber transition-colors hover:bg-console-amber/10 disabled:opacity-40"
                  >
                    {savedFlash === pkg.id ? "Kaydedildi ✓" : "Kaydet"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-console-line bg-console-panel p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-console-muted">
          Yayıncı Ödeme Oranı
        </p>
        <p className="mt-1 text-sm text-console-muted">Her 1000 coin karşılığı yayıncıya ödenen USD tutarı</p>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-32 rounded-md border border-console-line bg-console-panelAlt px-3 py-2 font-mono text-console-text outline-none focus:border-console-teal"
          />
          <span className="text-sm text-console-muted">USD / 1000 coin</span>
          <button
            onClick={saveRate}
            disabled={savingId === "rate"}
            className="rounded-md border border-console-amber/40 px-3 py-1.5 text-xs text-console-amber transition-colors hover:bg-console-amber/10 disabled:opacity-40"
          >
            {savedFlash === "rate" ? "Kaydedildi ✓" : "Kaydet"}
          </button>
        </div>
      </section>
    </div>
  );
}
