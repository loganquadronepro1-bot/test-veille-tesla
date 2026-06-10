interface CompetitorCardProps {
  name: string;
  type: "direct" | "indirect";
  region: string;
  threat: "high" | "medium" | "low";
  note: string;
  keyword: string;
}

const threatColors = {
  high: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", dot: "#ef4444" },
  medium: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "#f59e0b" },
  low: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "#10b981" },
};

const threatLabels = { high: "MENACE ÉLEVÉE", medium: "MENACE MODÉRÉE", low: "MENACE FAIBLE" };

export function CompetitorCard({ name, type, region, threat, note, keyword }: CompetitorCardProps) {
  const colors = threatColors[threat];
  return (
    <div className={`relative flex flex-col gap-3 p-4 border ${colors.border} ${colors.bg}`} style={{ borderRadius: 0 }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-foreground" style={{ fontWeight: 600, fontSize: "14px" }}>{name}</span>
          <div className="flex items-center gap-2">
            <span
              className="text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
            >
              {type === "direct" ? "CONCURRENT DIRECT" : "CONCURRENT INDIRECT"} · {region}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
          <span className={`${colors.text} uppercase tracking-widest`} style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>
            {threatLabels[threat]}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground" style={{ fontSize: "11px", lineHeight: 1.6 }}>{note}</p>

      <div className="flex items-center gap-2 pt-1 border-t border-border/50">
        <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>ALERT →</span>
        <code className="text-primary" style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>{keyword}</code>
      </div>
    </div>
  );
}
