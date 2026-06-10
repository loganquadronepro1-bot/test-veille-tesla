interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accent?: boolean;
}

export function MetricCard({ label, value, sub, trend, trendLabel, accent }: MetricCardProps) {
  const trendColor =
    trend === "up" ? "text-emerald-400" :
    trend === "down" ? "text-red-400" :
    "text-gray-500";

  const trendArrow =
    trend === "up" ? "↑" :
    trend === "down" ? "↓" :
    "—";

  return (
    <div
      className="relative flex flex-col gap-1 p-4 border border-border bg-card overflow-hidden"
      style={{ borderRadius: 0 }}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
      )}
      <span
        className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <span
        className="text-2xl text-foreground"
        style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
      >
        {value}
      </span>
      <div className="flex items-center gap-2 mt-0.5">
        {trend && (
          <span className={`text-[11px] ${trendColor}`} style={{ fontFamily: "var(--font-mono)" }}>
            {trendArrow} {trendLabel}
          </span>
        )}
        {sub && !trend && (
          <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
