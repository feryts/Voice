export default function StatCard({
  label,
  value,
  accent = "amber",
  sub,
}: {
  label: string;
  value: string;
  accent?: "amber" | "teal" | "violet" | "danger";
  sub?: string;
}) {
  const accentMap = {
    amber: "text-console-amber",
    teal: "text-console-teal",
    violet: "text-console-violet",
    danger: "text-console-danger",
  };
  return (
    <div className="rounded-lg border border-console-line bg-console-panel p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-console-muted">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accentMap[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-console-muted">{sub}</p>}
    </div>
  );
}
