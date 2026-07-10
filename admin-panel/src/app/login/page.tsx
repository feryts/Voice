"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WaveformDivider from "@/components/WaveformDivider";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-console-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <WaveformDivider className="mx-auto mb-4 justify-center" />
          <h1 className="font-display text-2xl font-bold text-console-text">Kontrol Paneli</h1>
          <p className="mt-1 text-sm text-console-muted">Devam etmek için şifreni gir</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-console-line bg-console-panel p-6"
        >
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-console-muted">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-md border border-console-line bg-console-panelAlt px-3 py-2.5 text-console-text outline-none focus:border-console-teal"
            placeholder="••••••••"
          />
          {error && <p className="mt-3 text-sm text-console-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full rounded-md bg-console-amber py-2.5 font-medium text-console-bg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] leading-relaxed text-console-muted">
          Demo şifreler: süper admin / ajans yöneticisi / moderatör
          <br />
          rolleri için README dosyasına bak.
        </p>
      </div>
    </div>
  );
}
