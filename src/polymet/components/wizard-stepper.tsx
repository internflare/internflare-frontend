import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface WizardStepperProps {
  steps: string[];
  current: number;
  completed: number[];
  onStepClick?: (i: number) => void;
  title?: string;
}

export function WizardStepper({ steps, current, completed, onStepClick, title = "Your progress" }: WizardStepperProps) {
  const pct = Math.round((completed.length / steps.length) * 100);
  return (
    <nav aria-label="Steps" className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{title}</span>
        <span className="tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="mt-2 h-1.5" aria-label={`${pct}% complete`} />
      <ol className="mt-4 hidden space-y-0.5 lg:block">
        {steps.map((s, i) => {
          const done = completed.includes(i);
          const active = i === current;
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active && "bg-accent text-brown hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                    done ? "border-success bg-success text-white dark:text-background" : active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
                  )}
                >
                  {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn("truncate", active ? "font-semibold" : "text-muted-foreground", done && !active && "text-foreground")}>{s}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground lg:hidden">
        Step {current + 1} of {steps.length}: <span className="font-medium text-foreground">{steps[current]}</span>
      </p>
    </nav>
  );
}

export function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
