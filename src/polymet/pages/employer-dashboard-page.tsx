import { Link } from "react-router-dom";
import { ActivityIcon, CalendarClockIcon, EyeIcon, FilePlus2Icon, SparklesIcon, StarIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MatchBadge, StageBadge, VerificationBadge } from "@/polymet/components/status-badges";
import { StatTile, WidgetCard } from "@/polymet/components/widget-card";
import { candidates, employerInterviews, employerListings, employerOrg, planUsage, recentActivity } from "@/polymet/data/employer-data";
import { pipelineStages } from "@/polymet/data/talent-data";

export function EmployerDashboardPage() {
  const published = employerListings.filter((l) => l.status === "published");
  const drafts = employerListings.filter((l) => l.status === "draft");
  const totalApps = employerListings.reduce((n, l) => n + l.applicants, 0);
  const shortlisted = candidates.filter((c) => ["Shortlisted", "Interview", "Test Task"].includes(c.stage));
  const stageCounts = pipelineStages.map((s) => ({ s, n: candidates.filter((c) => c.stage === s).length }));
  const maxStage = Math.max(1, ...stageCounts.map((x) => x.n));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{employerOrg.name}</h1><VerificationBadge status={employerOrg.verification} /></div>
          <p className="mt-1 text-sm text-muted-foreground">Good morning, {employerOrg.admin.split(" ")[0]}. 13 new applications since your last visit.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="bg-card"><Link to="/employer/candidates"><UsersIcon /> Review applicants</Link></Button>
          <Button asChild><Link to="/employer/listings/new"><FilePlus2Icon /> New listing</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Published listings" value={published.length} sub={`${drafts.length} draft · 1 paused`} />
        <StatTile label="Total applications" value={totalApps} sub="Across all listings" />
        <StatTile label="Shortlisted" value={shortlisted.length} sub="In active stages" />
        <StatTile label="Upcoming interviews" value={employerInterviews.length} sub="Next: Thu 22 May" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <WidgetCard title="Hiring pipeline" description="Stage distribution across listings" action={<Link to="/employer/candidates" className="text-sm font-medium text-primary hover:underline">Open inbox</Link>}>
            <ul className="space-y-2.5">
              {stageCounts.map(({ s, n }) => (
                <li key={s} className="grid grid-cols-[100px_1fr_32px] items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{s}</span>
                  <div className="h-2.5 rounded-full bg-muted"><div className={cn("h-full rounded-full", s === "Hired" || s === "Offer" ? "bg-success" : s === "Shortlisted" ? "bg-ai" : "bg-primary")} style={{ width: `${(n / maxStage) * 100}%` }} /></div>
                  <span className="text-right tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          </WidgetCard>

          <WidgetCard title="Listing performance" action={<Link to="/employer/listings" className="text-sm font-medium text-primary hover:underline">All listings</Link>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Listing</th><th className="pb-2 font-medium">Views</th><th className="pb-2 font-medium">Applicants</th><th className="pb-2 font-medium">Conversion</th><th className="pb-2 font-medium">New</th></tr></thead>
                <tbody className="divide-y">
                  {published.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2.5"><Link to={`/employer/listings/${l.id}`} className="font-medium hover:text-primary">{l.title}</Link></td>
                      <td className="tabular-nums">{l.views.toLocaleString()}</td>
                      <td className="tabular-nums">{l.applicants}</td>
                      <td className="tabular-nums">{((l.applicants / l.views) * 100).toFixed(1)}%</td>
                      <td>{l.newApplicants > 0 && <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-semibold text-brown">+{l.newApplicants}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetCard>

          <WidgetCard title="Shortlisted candidates" icon={<StarIcon className="h-4 w-4" />}>
            <ul className="divide-y">
              {shortlisted.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={c.avatar} alt="" /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1"><Link to={`/employer/candidates/${c.id}`} className="text-sm font-medium hover:text-primary">{c.name}</Link><p className="truncate text-xs text-muted-foreground">{employerListings.find((l) => l.id === c.listingId)?.title}</p></div>
                  {c.match && <MatchBadge score={c.match.score} className="hidden sm:inline-flex" />}
                  <StageBadge stage={c.stage} />
                </li>
              ))}
            </ul>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard title="Plan usage" description={`${employerOrg.plan} · renews ${employerOrg.renewal}`} action={<Link to="/employer/billing" className="text-sm font-medium text-primary hover:underline">Manage</Link>}>
            <ul className="space-y-3">
              {planUsage.map((u) => {
                const pct = Math.round((u.used / u.limit) * 100);
                return (
                  <li key={u.label}>
                    <div className="flex justify-between text-sm"><span>{u.label}</span><span className={cn("tabular-nums", pct >= 80 ? "font-semibold text-warning" : "text-muted-foreground")}>{u.used}/{u.limit}</span></div>
                    <Progress value={pct} className="mt-1.5 h-1.5" aria-label={`${u.label} ${pct}%`} />
                  </li>
                );
              })}
            </ul>
          </WidgetCard>
          <WidgetCard title="Upcoming interviews" icon={<CalendarClockIcon className="h-4 w-4" />} action={<Link to="/employer/hiring" className="text-sm font-medium text-primary hover:underline">All</Link>}>
            <ul className="space-y-2">
              {employerInterviews.map((i) => (
                <li key={i.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{i.candidate}</p>
                  <p className="text-xs text-muted-foreground">{i.role} · {i.date} {i.time} · {i.format}</p>
                </li>
              ))}
            </ul>
          </WidgetCard>
          <WidgetCard title="Quick actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "New listing", to: "/employer/listings/new", I: FilePlus2Icon },
                { l: "Review new", to: "/employer/candidates", I: EyeIcon },
                { l: "Invite teammate", to: "/employer/onboarding", I: UserPlusIcon },
                { l: "AI description", to: "/employer/listings/new", I: SparklesIcon },
              ].map(({ l, to, I }) => (
                <Link key={l} to={to} className="flex flex-col items-start gap-2 rounded-lg border p-3 text-sm font-medium hover:border-primary/40 hover:bg-accent/30"><I className="h-4 w-4 text-primary" />{l}</Link>
              ))}
            </div>
          </WidgetCard>
          <WidgetCard title="Recent activity" icon={<ActivityIcon className="h-4 w-4" />}>
            <ul className="space-y-3">{recentActivity.map((a) => <li key={a.id} className="text-sm"><p>{a.text}</p><p className="text-xs text-muted-foreground">{a.time}</p></li>)}</ul>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
