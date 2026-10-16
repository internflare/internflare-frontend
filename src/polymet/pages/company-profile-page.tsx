import { useParams } from "react-router-dom";
import { BadgeCheckIcon, CalendarIcon, GlobeIcon, MapPinIcon, UserIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { OpportunityCard } from "@/polymet/components/opportunity-card";
import { StateBlock } from "@/polymet/components/page-states";
import { VerificationBadge } from "@/polymet/components/status-badges";
import { companies, opportunities } from "@/polymet/data/opportunities-data";

export function CompanyProfilePage() {
  const { id = "paystack-labs" } = useParams();
  const company = companies.find((c) => c.id === id) ?? companies[0];
  const open = opportunities.filter((o) => o.companyId === company.id && o.status === "open");

  return (
    <div>
      <div className="h-40 border-b bg-[radial-gradient(60%_120%_at_0%_0%,hsl(var(--accent))_0%,transparent_70%),radial-gradient(50%_120%_at_100%_0%,hsl(var(--ai-soft))_0%,transparent_70%)] sm:h-48" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
          <CompanyLogo initials={company.initials} tone={company.tone} size="xl" className="border-4 border-background shadow-md" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <VerificationBadge status={company.verification} />
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{company.location}</span>
              <span className="flex items-center gap-1"><GlobeIcon className="h-4 w-4" />{company.website}</span>
              <span className="flex items-center gap-1"><UsersIcon className="h-4 w-4" />{company.size}</span>
              <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />Founded {company.founded}</span>
            </div>
          </div>
          <Button variant="outline" className="bg-card">Follow company</Button>
        </div>

        <div className="mt-10 grid gap-8 pb-16 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-2 max-w-prose leading-relaxed text-muted-foreground">{company.about}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Culture & ways of working</h2>
              <p className="text-xs text-muted-foreground">Provided by the employer (self-reported)</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {company.culture.map((c) => (
                  <div key={c.title} className="rounded-xl border bg-card p-4">
                    <p className="font-medium">{c.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Open opportunities ({open.length})</h2>
              <div className="mt-3">
                {open.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">{open.map((o) => <OpportunityCard key={o.id} opportunity={o} />)}</div>
                ) : (
                  <StateBlock kind="empty" title="No open opportunities right now" description="Follow this company to be notified when they publish new roles." />
                )}
              </div>
            </section>
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl border bg-card p-5">
              <p className="flex items-center gap-2 font-semibold"><BadgeCheckIcon className="h-4 w-4 text-success" /> Verified by Internflare</p>
              {company.verifiedFacts.length ? (
                <ul className="mt-3 space-y-2 text-sm">{company.verifiedFacts.map((f) => <li key={f} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success" />{f}</li>)}</ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No details have been verified yet.</p>
              )}
            </div>
            <div className="rounded-xl border bg-card p-5">
              <p className="flex items-center gap-2 font-semibold"><UserIcon className="h-4 w-4 text-muted-foreground" /> Self-reported by employer</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{company.selfReported.map((f) => <li key={f} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />{f}</li>)}</ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
