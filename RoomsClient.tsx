"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { allowedNavItems } from "@/lib/permissions";
import type { Session } from "@/lib/auth";

export default function Sidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const items = allowedNavItems(session);

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-console-line bg-console-panel">
      <div className="px-5 py-6">
        <p className="font-display text-lg font-bold text-console-text">Kontrol Paneli</p>
        <p className="mt-0.5 font-mono text-[11px] text-console-muted">v0.1 — demo</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-console-panelAlt text-console-text"
                  : "text-console-muted hover:bg-console-panelAlt hover:text-console-text"
              }`}
            >
              <span
                className={`h-6 w-[3px] rounded-full transition-colors ${
                  active ? "bg-console-amber" : "bg-console-line group-hover:bg-console-teal"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-5">
        <LogoutButton />
      </div>
    </aside>
  );
}

function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
      className="w-full rounded-md border border-console-line py-2 text-xs font-mono text-console-muted transition-colors hover:border-console-danger hover:text-console-danger"
    >
      Oturumu Kapat
    </button>
  );
}
