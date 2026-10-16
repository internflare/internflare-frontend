import { Link } from "react-router-dom";
import { ArrowRightIcon, CheckCircle2Icon, ClipboardCheckIcon, ExternalLinkIcon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApplyDialog } from "@/polymet/components/apply-dialog";
import { ExternalApplyDialog } from "@/polymet/components/external-apply-dialog";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { GapExplanation } from "@/polymet/components/pathway/pathway-ui";
import { eligibilityFor } from "@/polymet/lib/pathway-engine";
import type { Opportunity } from "@/polymet/data/opportunities-data";

interface EligibilityGateProps {
  opportunity: Opportunity;
  companyName: string;
  fullDetailsTo?: string;
}

export function EligibilityGate({ opportunity: o, companyName, fullDetailsTo }: EligibilityGateProps) {
  const { candidate } = usePathway();
  const e = eligibilityFor(candidate, o.id);
  const req = e.requirement;

  if (e.state === "closed") {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <LockIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold">{e.headline}</p>
            <p className="text-sm text-muted-foreground">Applications closed on {o.deadline}.</p>
            <Link to={e.primary.to} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{e.primary.label} <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </div>
    );
  }

  if (e.state === "eligible") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success-soft/60 p-3 text-sm">
          <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div>
            <p className="font-semibold">{e.headline}</p>
            <p className="text-muted-foreground">
              {e.role?.title} readiness {e.overall} meets the {req?.level} threshold of {req?.threshold} set by {req?.configuredBy}.
            </p>
          </div>
        </div>
        {o.source === "external" && o.provider && o.externalUrl ? (
          <div className="space-y-2">
            <ExternalApplyDialog provider={o.provider} url={o.externalUrl} company={companyName} title={o.title} />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ExternalLinkIcon className="h-3 w-3" /> Sourced from {o.provider}. Applications are submitted and managed there.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <ApplyDialog opportunityId={o.id} title={o.title} company={companyName} />
            {fullDetailsTo && (
              <Button asChild size="lg" variant="outline" className="bg-card"><Link to={fullDetailsTo}>Full details <ArrowRightIcon /></Link></Button>
            )}
          </div>
        )}
      </div>
    );
  }

  const notAssessed = e.state === "not-assessed";
  return (
    <div className={cn("rounded-xl border p-4", notAssessed ? "border-ai/30 bg-ai-soft/60" : "border-warning/30 bg-warning-soft")}>
      <div className="flex gap-3">
        {notAssessed ? <ClipboardCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-ai-strong" /> : <LockIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{e.headline}</p>
          <p className="text-sm text-muted-foreground">
            {req?.configuredBy} requires {e.role?.title} {req?.level} readiness of {req?.threshold}
            {req?.competencyMins.length ? " plus minimum competency scores" : ""}. Eligibility is checked for this role only — it isn't a permanent label.
          </p>
          <GapExplanation met={e.met} unmet={e.unmet} className="mt-3 rounded-lg bg-card/70 p-3" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm"><Link to={e.primary.to}>{e.primary.label}</Link></Button>
            {e.secondary && <Button asChild size="sm" variant="outline" className="bg-card"><Link to={e.secondary.to}>{e.secondary.label}</Link></Button>}
          </div>
          <Button size="lg" className="mt-3 w-full" disabled aria-describedby={`gate-${o.id}`}>
            <LockIcon /> Apply unavailable until requirements are met
          </Button>
          <p id={`gate-${o.id}`} className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheckIcon className="h-3 w-3" /> Profile completion alone can't bypass this check. Is something inaccurate? <Link to="/app/profile" className="font-medium underline underline-offset-2">Correct your profile</Link> or <Link to="/app/portfolio" className="font-medium underline underline-offset-2">add evidence</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
