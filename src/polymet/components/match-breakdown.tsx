import { Link } from "react-router-dom";
import { LightbulbIcon, SparklesIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { MatchFactor } from "@/polymet/data/opportunities-data";

interface MatchBreakdownProps {
  score: number;
  summary: string;
  factors: MatchFactor[];
}

export function MatchBreakdown({ score, summary, factors }: MatchBreakdownProps) {
  return (
    <section aria-labelledby="match-heading" className="rounded-xl border border-ai/30 bg-ai-soft/60 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ai text-white dark:text-background">
          <SparklesIcon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 id="match-heading" className="font-semibold">
            Match summary · <span className="text-ai-strong">{score}%</span>
          </h3>
          <p className="text-sm text-muted-foreground">Compared with the skills and evidence on your profile.</p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {factors.map((f) => (
          <li key={f.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{f.label}</span>
              <span className="tabular-nums text-ai-strong">{f.score}%</span>
            </div>
            <Progress value={f.score} className="mt-1.5 h-1.5 bg-ai/20 [&>div]:bg-ai" aria-label={`${f.label} ${f.score}%`} />
            <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2 rounded-lg border bg-card p-3 text-sm">
        <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-ai-strong" />
        <p>{summary}</p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Match scores are guidance only — employers make hiring decisions.{" "}
        <Link to="/app/assessments" className="font-medium text-foreground underline underline-offset-2">How this is calculated</Link>
      </p>
    </section>
  );
}
