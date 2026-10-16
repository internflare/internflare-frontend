import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, Settings2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { employerPlans, formatNaira, talentPlans, type Plan } from "@/polymet/data/pricing-data";

interface PricingPlansProps {
  defaultAudience?: "talent" | "employer";
  currentPlanId?: string;
  compact?: boolean;
  onSelect?: (plan: Plan) => void;
}

export function PricingPlans({ defaultAudience = "talent", currentPlanId, compact, onSelect }: PricingPlansProps) {
  const [audience, setAudience] = useState(defaultAudience);
  const plans = audience === "talent" ? talentPlans : employerPlans;

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border bg-card p-1" role="tablist" aria-label="Plan audience">
          {(["talent", "employer"] as const).map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={audience === a}
              onClick={() => setAudience(a)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                audience === a ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {a === "talent" ? "For talent" : "For employers"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => {
          const current = currentPlanId === p.id;
          return (
            <div
              key={p.id}
              className={cn("relative flex flex-col rounded-2xl border bg-card p-6", p.highlighted && "border-primary shadow-lg ring-1 ring-primary")}
            >
              {p.highlighted && (
                <span className="absolute -top-2.5 left-6 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">Popular</span>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 min-h-[40px] text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-4">
                <span className="text-3xl font-bold tracking-tight">{formatNaira(p.price)}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              {!compact && (
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f.label} className="flex gap-2 text-sm">
                      {f.status === "included" ? (
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <Settings2Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={cn(f.status === "configurable" && "text-muted-foreground")}>
                        {f.label}
                        {f.status === "configurable" && <span className="block text-[11px]">Limits pending product configuration</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                {current ? (
                  <Button variant="outline" disabled className="w-full">Current plan</Button>
                ) : onSelect ? (
                  <Button variant={p.highlighted ? "default" : "outline"} className="w-full" onClick={() => onSelect(p)}>
                    {p.price === 0 ? "Switch to Free" : `Choose ${p.name}`}
                  </Button>
                ) : (
                  <Button asChild variant={p.highlighted ? "default" : "outline"} className="w-full">
                    <Link to={audience === "employer" ? "/sign-up?type=employer" : "/sign-up"}>{p.price === 0 ? "Start free" : `Choose ${p.name}`}</Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
