import { isInternship } from "@/polymet/lib/pathway-engine";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { OpportunityCard } from "@/polymet/components/opportunity-card";
import { OpportunityDetailPanel } from "@/polymet/components/opportunity-detail-panel";
import { StateBlock } from "@/polymet/components/page-states";
import { VerificationBadge } from "@/polymet/components/status-badges";
import { getCompany, getOpportunity, opportunities } from "@/polymet/data/opportunities-data";

export function OpportunityDetailPage() {
  const { id = "frontend-engineering-intern" } = useParams();
  const o = getOpportunity(id);

  if (!o) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <StateBlock kind="no-results" title="Opportunity not found" description="It may have been removed by the employer or the link is incorrect." action={{ label: "Browse internships", to: "/internships" }} />
      </div>
    );
  }
  const company = getCompany(o.companyId);
  const similar = opportunities.filter((x) => x.id !== o.id && x.status === "open" && (isInternship(x) === isInternship(o))).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={isInternship(o) ? "/internships" : "/jobs"} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeftIcon className="h-4 w-4" /> {isInternship(o) ? "All internships" : "All jobs"}
      </Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <OpportunityDetailPanel opportunity={o} coverImage="https://v3b.fal.media/files/b/0aae2918/vLG9LZni8dPncJxccnJ6F_ItXppIaa.jpg" />
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <CompanyLogo initials={company.initials} tone={company.tone} />
              <div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.industry} · {company.size}</p>
              </div>
            </div>
            <VerificationBadge status={company.verification} className="mt-3" />
            <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">{company.about}</p>
            <Link to={`/companies/${company.id}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">View company profile</Link>
          </div>
          <div className="rounded-xl border bg-card p-5 text-sm">
            <p className="font-semibold">Key dates</p>
            <dl className="mt-2 space-y-1.5">
              <div className="flex justify-between"><dt className="text-muted-foreground">Posted</dt><dd>{o.postedDate}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Deadline</dt><dd>{o.deadline}</dd></div>
              {o.duration && <div className="flex justify-between"><dt className="text-muted-foreground">Duration</dt><dd>{o.duration}</dd></div>}
            </dl>
          </div>
        </aside>
      </div>
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Similar opportunities</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => <OpportunityCard key={s.id} opportunity={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
