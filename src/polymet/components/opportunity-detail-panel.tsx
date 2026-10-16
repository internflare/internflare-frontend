import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  LockIcon,
  Share2Icon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { SourceBadge, VerificationBadge, MetaChip } from "@/polymet/components/status-badges";
import { MatchBreakdown } from "@/polymet/components/match-breakdown";
import { EligibilityGate } from "@/polymet/components/pathway/eligibility-gate";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { matchFactors } from "@/polymet/lib/pathway-engine";
import { getRole, opportunityRequirements } from "@/polymet/data/pathway-data";
import {
  arrangementLabel,
  formatCompensation,
  getCompany,
  typeLabel,
  type Opportunity,
} from "@/polymet/data/opportunities-data";

interface OpportunityDetailPanelProps {
  opportunity: Opportunity;
  coverImage?: string;
  showFullLink?: boolean;
  className?: string;
}

export function OpportunityDetailPanel({ opportunity: o, coverImage, showFullLink, className }: OpportunityDetailPanelProps) {
  const company = getCompany(o.companyId);
  const [saved, setSaved] = useState(false);
  const closed = o.status !== "open";
  const { candidate } = usePathway();
  const match = matchFactors(candidate, o.id);
  const req = opportunityRequirements[o.id];

  const facts = [
    { label: o.compensation?.paid === false ? "Compensation" : o.type === "internship" ? "Stipend" : "Salary", value: formatCompensation(o.compensation), sub: o.compensation ? (o.compensation.paid ? `${o.compensation.currency} · paid` : "Unpaid internship") : "Not disclosed" },
    { label: "Work arrangement", value: arrangementLabel[o.arrangement], sub: o.location },
    { label: "Type", value: req?.employment ?? typeLabel[o.type], sub: `${o.level} level` },
    { label: o.duration ? "Duration" : "Deadline", value: o.duration ?? o.deadline, sub: o.duration ? `Closes ${o.deadline}` : "Application deadline" },
  ];

  return (
    <article className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
      {coverImage && (
        <div className="relative h-36 sm:h-44">
          <img src={coverImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        </div>
      )}
      <div className={cn("p-5 sm:p-7", coverImage && "-mt-12 relative")}>
        <div className="flex items-start gap-4">
          <CompanyLogo initials={company.initials} tone={company.tone} size="lg" className="shadow-sm" />
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link to={`/companies/${company.id}`} className="font-medium hover:text-primary">{company.name}</Link>
              <VerificationBadge status={company.verification} />
            </div>
            <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-[28px]">{o.title}</h1>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" aria-label={saved ? "Remove from saved" : "Save"} aria-pressed={saved} onClick={() => setSaved((s) => !s)}>
              <BookmarkIcon className={cn(saved && "fill-primary text-primary")} />
            </Button>
            <Button variant="outline" size="icon" aria-label="Share opportunity">
              <Share2Icon />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <SourceBadge source={o.source} provider={o.provider} />
          <MetaChip>{o.industry}</MetaChip>
          {o.skills.map((s) => (
            <MetaChip key={s}>{s}</MetaChip>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-muted/40 p-3.5">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="mt-0.5 font-semibold">{f.value}</dd>
              <dd className="truncate text-xs text-muted-foreground">{f.sub}</dd>
            </div>
          ))}
        </dl>

        {/* Apply area — gated by role-specific eligibility */}
        <div className="mt-5">
          <EligibilityGate opportunity={o} companyName={company.name} fullDetailsTo={showFullLink ? `/opportunities/${o.id}` : undefined} />
        </div>

        {match && !closed && (
          <div className="mt-6">
            <MatchBreakdown {...match} />
          </div>
        )}

        <Separator className="my-6" />

        <div className="space-y-6 text-[15px]">
          <section>
            <h2 className="text-lg font-semibold">About the role</h2>
            <p className="mt-2 max-w-prose leading-relaxed text-muted-foreground">{o.description}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Responsibilities</h2>
            <ul className="mt-2 space-y-2">
              {o.responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Requirements</h2>
            <ul className="mt-2 space-y-2">
              {o.requirements.map((r) => (
                <li key={r} className="flex gap-2.5 rounded-lg border bg-muted/40 p-3">
                  <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
          {req && (
            <section>
              <h2 className="text-lg font-semibold">Required competencies</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configured by {req.configuredBy}: {getRole(req.roleId)?.title} {req.level} readiness of at least {req.threshold}.
              </p>
              {req.competencyMins.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {req.competencyMins.map((m) => (
                    <li key={m.competencyId} className="rounded-md border bg-muted/40 px-2.5 py-1 text-sm">
                      {getRole(req.roleId)?.competencies.find((c) => c.id === m.competencyId)?.label} ≥ {m.min}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {o.benefits.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Benefits</h2>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {o.benefits.map((b) => (
                  <div key={b.title} className="rounded-lg border p-3">
                    <p className="font-medium text-brown">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold">How to apply</h2>
            <p className="mt-2 text-muted-foreground">{o.instructions}</p>
          </section>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm text-muted-foreground">
          <span>Posted {o.postedDate}</span>
          <Link to={`/companies/${company.id}`} className="font-medium text-foreground hover:text-primary">
            View {company.name} profile →
          </Link>
        </div>
      </div>
    </article>
  );
}
