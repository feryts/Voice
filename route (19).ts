"use client";

import { useEffect, useState } from "react";
import type { SupportTicket } from "@/lib/data";

const STATUS_LABEL: Record<SupportTicket["status"], string> = {
  OPEN: "Açık",
  ESCALATED: "Süper Admine İletildi",
  CLOSED: "Kapatıldı",
};

const STATUS_COLOR: Record<SupportTicket["status"], string> = {
  OPEN: "text-console-amber border-console-amber/40",
  ESCALATED: "text-console-violet border-console-violet/40",
  CLOSED: "text-console-muted border-console-line",
};

export default function CustomerServiceClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/customer-service")
      .then((r) => r.json())
      .then((data) => {
        setTickets(data.tickets || []);
        if (!selectedId && data.tickets?.length) setSelectedId(data.tickets[0].id);
      });
  }

  useEffect(load, []);

  const selected = tickets.find((t) => t.id === selectedId) || null;

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    setBusy(true);
    await fetch("/api/customer-service/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: selected.id, text: reply.trim() }),
    });
    setReply("");
    load();
    setBusy(false);
  }

  async function escalate() {
    if (!selected) return;
    setBusy(true);
    await fetch("/api/customer-service/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: selected.id }),
    });
    load();
    setBusy(false);
  }

  async function close() {
    if (!selected) return;
    setBusy(true);
    await fetch("/api/customer-service/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: selected.id }),
    });
    load();
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="space-y-2 md:col-span-1">
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`w-full rounded-lg border p-3 text-left transition-colors ${
              selectedId === t.id
                ? "border-console-teal bg-console-panelAlt"
                : "border-console-line bg-console-panel hover:bg-console-panelAlt"
            }`}
          >
            <p className="text-sm text-console-text">{t.subject}</p>
            <p className="mt-0.5 font-mono text-xs text-console-muted">{t.username}</p>
            <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[11px] ${STATUS_COLOR[t.status]}`}>
              {STATUS_LABEL[t.status]}
            </span>
          </button>
        ))}
      </div>

      <div className="md:col-span-2">
        {selected ? (
          <div className="rounded-lg border border-console-line bg-console-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-bold text-console-text">{selected.subject}</p>
                <p className="font-mono text-xs text-console-muted">{selected.username}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={escalate}
                  disabled={busy || selected.status !== "OPEN"}
                  className="rounded-md border border-console-violet/40 px-3 py-1.5 text-xs text-console-violet hover:bg-console-violet/10 disabled:opacity-40"
                >
                  Süper Admine İlet
                </button>
                <button
                  onClick={close}
                  disabled={busy || selected.status === "CLOSED"}
                  className="rounded-md border border-console-line px-3 py-1.5 text-xs text-console-muted hover:bg-console-panelAlt disabled:opacity-40"
                >
                  Kapat
                </button>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              {selected.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.from === "admin"
                      ? "ml-auto bg-console-amber/15 text-console-text"
                      : "bg-console-panelAlt text-console-text"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {selected.status !== "CLOSED" && (
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Cevabını yaz…"
                  className="flex-1 rounded-md border border-console-line bg-console-panelAlt px-3 py-2 text-sm text-console-text outline-none focus:border-console-teal"
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                />
                <button
                  onClick={sendReply}
                  disabled={busy || !reply.trim()}
                  className="rounded-md bg-console-amber px-4 py-2 text-sm font-medium text-console-bg hover:opacity-90 disabled:opacity-40"
                >
                  Gönder
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-console-muted">Bekleyen talep yok.</p>
        )}
      </div>
    </div>
  );
}
