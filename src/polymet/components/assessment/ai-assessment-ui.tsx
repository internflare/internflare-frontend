import { CheckCircle2Icon, ChevronDownIcon, XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { expertiseLevels, getLevel, type AiAssessmentReport, type CareerRole, type ExpertiseLevel } from "@/polymet/data/pathway-data";

/* ---------- Level picker ---------- */

interface LevelPickerProps {
  value: ExpertiseLevel;
  onChange: (id: ExpertiseLevel) => void;
  roleTitle: string;
}

export function LevelPicker({ value, onChange, roleTitle }: LevelPickerProps) {
  return (
    <div role="radiogroup" aria-label="Expertise level" className="grid gap-2 sm:grid-cols-2">
      {expertiseLevels.map((l) => {
        const active = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l.id)}
            className={cn("rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "border-primary bg-accent/50" : "hover:bg-muted/60")}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{l.label} {roleTitle}</p>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">max {l.ceiling}</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{l.years}</p>
            <p className="mt-2 text-xs">{l.focus}</p>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- AI report ---------- */

export function AiReportPanel({ report, role }: { report: AiAssessmentReport; role: CareerRole }) {
  const lvl = getLevel(report.level);
  const demo = report.demonstratedLevel === "below-intern" ? "Foundation" : getLevel(report.demonstratedLevel).label;
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ai-strong">AI interview report</p>
          <h2 className="mt-1 text-lg font-semibold">{lvl.label} {role.title} · {report.results.length} questions · {report.durationMins} min</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{report.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg bg-muted/60 px-3 py-2"><p className="text-[11px] text-muted-foreground">Rubric score</p><p className="text-lg font-bold tabular-nums">{report.rawAverage}%</p></div>
          <div className="rounded-lg bg-ai-soft px-3 py-2"><p className="text-[11px] text-ai-strong">Demonstrated</p><p className="text-lg font-bold text-ai-strong">{demo}</p></div>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {report.results.map((r) => (
          <li key={r.questionId}>
            <Collapsible>
              <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className={cn("flex h-9 w-12 shrink-0 items-center justify-center rounded-md text-sm font-bold tabular-nums", r.raw >= 70 ? "bg-success-soft text-success" : r.raw >= 45 ? "bg-warning-soft text-warning" : "bg-destructive/10 text-destructive")}>{r.raw}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.kind} · {role.competencies.find((c) => c.id === r.competencyId)?.label} · {r.summary}</span>
                </span>
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="grid gap-3 px-3 pb-1 pt-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-success">Covered</p>
                  <ul className="mt-1 space-y-1">
                    {r.covered.length ? r.covered.map((c) => <li key={c} className="flex gap-1.5 text-sm"><CheckCircle2Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />{c}</li>) : <li className="text-sm text-muted-foreground">Nothing yet</li>}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-warning">Missing</p>
                  <ul className="mt-1 space-y-1">
                    {r.missed.length ? r.missed.map((c) => <li key={c} className="flex gap-1.5 text-sm"><XCircleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />{c}</li>) : <li className="text-sm text-muted-foreground">Nothing — full marks</li>}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Each answer is graded against a published rubric, and scores are capped at {lvl.ceiling} for the {lvl.label} level. AI grading supports employer review but never replaces it. Prototype: question generation and grading are simulated.</p>
    </section>
  );
}
