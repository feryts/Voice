"use client";

import { useEffect, useState } from "react";
import type { AdminRequest } from "@/lib/data";

const STATUS_LABEL: Record<AdminRequest["status"], string> = {
  PENDING: "Beklemede",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
};

const STATUS_COLOR: Record<AdminRequest["status"], string> = {
  PENDING: "text-console-amber border-console-amber/40",
  APPROVED: "text-console-teal border-console-teal/40",
  REJECTED: "text-console-danger border-console-danger/40",
};

export default function RequestsClient({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/requests")
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []));
  }

  useEffect(load, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() }),
    });
    setMessage("");
    load();
    setBusy(false);
  }

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    setBusy(true);
    await fetch("/api/requests/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      {!isSuperAdmin && (
        <form onSubmit={submit} className="rounded-lg border border-console-line bg-console-panel p-5">
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-console-muted">
            Süper Admine Yeni Talep
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Talebini yaz…"
            className="w-full rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
          />
          <button
            type="submit"
            disabled={busy || !message.trim()}
            className="mt-3 rounded-md bg-console-amber px-4 py-2 text-sm font-medium text-console-bg hover:opacity-90 disabled:opacity-40"
          >
            Gönder
          </button>
        </form>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="rounded-lg border border-console-line bg-console-panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs text-console-muted">{r.fromAdminName}</p>
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${STATUS_COLOR[r.status]}`}>
                {STATUS_LABEL[r.status]}
              </span>
            </div>
            <p className="text-sm text-console-text">{r.message}</p>
            {isSuperAdmin && r.status === "PENDING" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => decide(r.id, "APPROVED")}
                  disabled={busy}
                  className="rounded-md border border-console-teal/40 px-3 py-1.5 text-xs text-console-teal hover:bg-console-teal/10"
                >
                  Onayla
                </button>
                <button
                  onClick={() => decide(r.id, "REJECTED")}
                  disabled={busy}
                  className="rounded-md border border-console-danger/40 px-3 py-1.5 text-xs text-console-danger hover:bg-console-danger/10"
                >
                  Reddet
                </button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-console-muted">Henüz talep yok.</p>}
      </div>
    </div>
  );
}
