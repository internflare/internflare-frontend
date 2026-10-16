import { cn } from "@/lib/utils";

interface ReadinessRingProps {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "primary" | "ai";
  label?: string;
  className?: string;
}

export function ReadinessRing({ value, size = 120, stroke = 10, tone = "primary", label, className }: ReadinessRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Score"}: ${value} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className={cn("fill-none transition-[stroke-dashoffset] duration-700", tone === "primary" ? "stroke-primary" : "stroke-ai")}
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-3xl font-bold tabular-nums leading-none" style={{ fontSize: size / 4 }}>{value}</span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
