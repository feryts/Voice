"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/lib/data";

export default function RoomsClient({ canStealth }: { canStealth: boolean }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => setRooms(data.rooms || []));
  }, []);

  async function enter(room: Room, stealth: boolean) {
    setBusyId(room.id);
    setMessage(null);
    const res = await fetch("/api/rooms/enter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id, stealth }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Girilemedi.");
    } else {
      setMessage(
        stealth
          ? `"${room.name}" odasına gizli modda girdin.`
          : `"${room.name}" odasına girdin.`
      );
    }
    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="rounded-md border border-console-teal/40 bg-console-teal/5 px-4 py-2.5 text-sm text-console-teal">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-lg border border-console-line bg-console-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-console-text">{room.name}</p>
              {room.live ? (
                <span className="flex items-center gap-1.5 rounded-full border border-console-danger/40 px-2.5 py-1 text-[11px] text-console-danger">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> CANLI
                </span>
              ) : (
                <span className="rounded-full border border-console-line px-2.5 py-1 text-[11px] text-console-muted">
                  Kapalı
                </span>
              )}
            </div>
            <p className="text-sm text-console-muted">
              Yayıncı: <span className="text-console-text">{room.hostUsername}</span>
            </p>
            <p className="mt-1 font-mono text-xs text-console-muted">{room.listenerCount} dinleyici</p>

            <div className="mt-4 flex gap-2">
              <button
                disabled={busyId === room.id || !room.live}
                onClick={() => enter(room, false)}
                className="flex-1 rounded-md border border-console-teal/40 py-2 text-xs text-console-teal hover:bg-console-teal/10 disabled:opacity-40"
              >
                Normal Gir
              </button>
              {canStealth && (
                <button
                  disabled={busyId === room.id || !room.live}
                  onClick={() => enter(room, true)}
                  className="flex-1 rounded-md border border-console-amber/40 py-2 text-xs text-console-amber hover:bg-console-amber/10 disabled:opacity-40"
                >
                  Gizli Gir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
