import { useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkXIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { SourceBadge, MetaChip } from "@/polymet/components/status-badges";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { EligibilityPill } from "@/polymet/components/pathway/pathway-ui";
import { eligibilityFor, isInternship } from "@/polymet/lib/pathway-engine";
import { formatCompensation, getCompany, opportunities } from "@/polymet/data/opportunities-data";
import { applications } from "@/polymet/data/talent-data";

const initialSaved = ["frontend-engineering-intern", "data-analyst-graduate", "support-engineer-ext", "ux-writer-closed", "freelance-brand-ext", "community-volunteer"];

export function SavedPage() {
  const [saved, setSaved] = useState(initialSaved);
  const { candidate } = usePathway();
  const items = opportunities.filter((o) => saved.includes(o.id));

  const remove = (id: string) => {
    setSaved((s) => s.filter((x) => x !== id));
    toast("Removed from saved", { action: { label: "Undo", onClick: () => setSaved((s) => [...s, id]) } });
  };

  return (
    <div>
      <Toaster />
      <PageHeader title="Saved opportunities" description={`${items.length} saved · closed listings stay here so you can follow the company.`} />
      {items.length === 0 ? (
        <StateBlock kind="empty" title="Nothing saved yet" description="Tap the bookmark on any opportunity to keep it here." action={{ label: "Browse internships", to: "/app/internships" }} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((o) => {
            const c = getCompany(o.companyId);
            const closed = o.status !== "open";
            const applied = (candidate.id === "amara" ? applications.find((a) => a.opportunityId === o.id) : undefined) ?? (candidate.applied.includes(o.id) ? { stage: "New" } : undefined);
            const e = eligibilityFor(candidate, o.id);
            const boardTo = `/app/${isInternship(o) ? "internships" : "jobs"}?selected=${o.id}`;
            return (
              <article key={o.id} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <CompanyLogo initials={c.initials} tone={c.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">{c.name}</p>
                    <Link to={`/opportunities/${o.id}`} className="font-semibold leading-snug hover:text-primary">{o.title}</Link>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label={`Remove ${o.title} from saved`} onClick={() => remove(o.id)}><BookmarkXIcon /></Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <EligibilityPill e={e} />
                  <SourceBadge source={o.source} provider={o.provider} />
                  <MetaChip>{formatCompensation(o.compensation)}</MetaChip>
                </div>
                <div className="mt-auto pt-4">
                  {closed ? (
                    <p className="flex items-center gap-1.5 rounded-lg bg-destructive/5 px-3 py-2 text-sm text-destructive"><LockIcon className="h-4 w-4" /> Closed on {o.deadline}</p>
                  ) : applied ? (
                    <p className="rounded-lg bg-muted px-3 py-2 text-sm">Applied · <span className="font-medium">{applied.stage}</span></p>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Closes {o.deadline}</span>
                      <Button asChild size="sm" variant={e.state === "eligible" ? "default" : "outline"} className={e.state === "eligible" ? "" : "bg-card"}><Link to={boardTo}>{e.state === "eligible" ? (o.source === "external" ? "View" : "Apply") : "See requirements"}</Link></Button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
