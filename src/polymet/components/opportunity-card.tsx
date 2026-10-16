import { Link } from "react-router-dom";
import { BookmarkIcon, BriefcaseIcon, ClockIcon, MapPinIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { MetaChip, SourceBadge, VerificationBadge } from "@/polymet/components/status-badges";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { EligibilityPill } from "@/polymet/components/pathway/pathway-ui";
import { eligibilityFor } from "@/polymet/lib/pathway-engine";
import { opportunityRequirements } from "@/polymet/data/pathway-data";
import {
  arrangementLabel,
  formatCompensation,
  getCompany,
  typeLabel,
  type Opportunity,
} from "@/polymet/data/opportunities-data";

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: "grid" | "list";
  selected?: boolean;
  onSelect?: (id: string) => void;
  saved?: boolean;
}

export function OpportunityCard({ opportunity: o, variant = "grid", selected, onSelect, saved: initialSaved }: OpportunityCardProps) {
  const company = getCompany(o.companyId);
  const [saved, setSaved] = useState(!!initialSaved);
  const closed = o.status !== "open";
  const { candidate } = usePathway();
  const eligibility = eligibilityFor(candidate, o.id);

  const saveButton = (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0 text-muted-foreground"
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved((s) => !s);
      }}
    >
      <BookmarkIcon className={cn(saved && "fill-primary text-primary")} />
    </Button>
  );

  if (variant === "list") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(o.id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(o.id)}
        aria-pressed={selected}
        className={cn(
          "group relative cursor-pointer rounded-xl border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          selected && "border-primary shadow-sm ring-1 ring-primary",
        )}
      >
        {selected && <span className="absolute inset-y-3 left-0 w-1 rounded-r bg-primary" aria-hidden="true" />}
        <div className="flex items-start gap-3">
          <CompanyLogo initials={company.initials} tone={company.tone} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="truncate">{company.name}</span>
              <VerificationBadge status={company.verification} compact />
            </div>
            <h3 className="truncate text-[15px] font-semibold leading-snug">{o.title}</h3>
          </div>
          <EligibilityPill e={eligibility} className="hidden sm:inline-flex" />{saveButton}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{o.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <MetaChip>
            <MapPinIcon className="h-3 w-3" /> {arrangementLabel[o.arrangement]}
          </MetaChip>
          <MetaChip>
            <WalletIcon className="h-3 w-3" /> {formatCompensation(o.compensation)}
          </MetaChip>
          <SourceBadge source={o.source} provider={o.provider} />
          {closed && <MetaChip className="border-destructive/20 bg-destructive/10 text-destructive">Closed</MetaChip>}
          <span className="ml-auto text-xs text-muted-foreground">{o.postedAgo}</span>
        </div>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <CompanyLogo initials={company.initials} tone={company.tone} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="truncate">{company.name}</span>
            <VerificationBadge status={company.verification} compact />
          </div>
          <p className="text-xs text-muted-foreground">Posted {o.postedAgo}</p>
        </div>
        {saveButton}
      </div>
      <Link
        to={`/opportunities/${o.id}`}
        className="mt-4 rounded text-base font-semibold leading-snug hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {o.title}
      </Link>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <EligibilityPill e={eligibility} />
        <SourceBadge source={o.source} provider={o.provider} />
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <WalletIcon className="h-4 w-4 shrink-0" />
          <span className={cn(o.compensation?.paid ? "font-medium text-foreground" : "")}>{formatCompensation(o.compensation)}</span>
        </li>
        <li className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{o.location}</span>
        </li>
        <li className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 shrink-0" />
          {opportunityRequirements[o.id]?.employment ?? typeLabel[o.type]} · {arrangementLabel[o.arrangement]}
        </li>
        <li className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 shrink-0" />
          Closes {o.deadline}
        </li>
      </ul>
      <div className="mt-auto pt-5">
        <Button asChild variant={o.source === "external" ? "outline" : "default"} className="w-full">
          <Link to={`/opportunities/${o.id}`}>{o.source === "external" ? `View on ${o.provider}` : eligibility.state === "eligible" ? "View & apply" : "View requirements"}</Link>
        </Button>
      </div>
    </article>
  );
}
