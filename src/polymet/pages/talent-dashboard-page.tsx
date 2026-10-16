import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarClockIcon,
  CheckSquareIcon,
  CircleIcon,
  EyeIcon,
  GaugeIcon,
  HandshakeIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { ReadinessRing } from "@/polymet/components/readiness-ring";
import { StageBadge } from "@/polymet/components/status-badges";
import { StatTile, WidgetCard } from "@/polymet/components/widget-card";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { EligibilityPill, GoalVsEvidence, NextActionsList, ReadinessLevelCards } from "@/polymet/components/pathway/pathway-ui";
import { modulesFor, nextActions, recommendedFor, roleReadiness } from "@/polymet/lib/pathway-engine";
import { applications, currentTalent, interviews, leads, mentors, pipelineStages, tasks } from "@/polymet/data/talent-data";
import { formatCompensation, getCompany, opportunities } from "@/polymet/data/opportunities-data";

export function TalentDashboardPage() {
  const { candidate } = usePathway();
  const hasHistory = candidate.id === "amara";
  const roleId = candidate.targetRoleId;
  const rr = roleId ? roleReadiness(candidate, roleId) : null;
  const mods = roleId ? modulesFor(roleId) : [];
  const lp = roleId ? candidate.learning[roleId] : undefined;
  const learningProgress = mods.length ? Math.round(((lp?.completed.length ?? 0) / mods.length) * 100) : 0;
  const recJobs = recommendedFor(candidate, "job");
  const recInterns = recommendedFor(candidate, "internship");
  const recommended = (recJobs.length && rr?.status === "job" ? [...recJobs, ...recInterns] : [...recInterns, ...recJobs]).slice(0, 3);
  const active = applications.filter((a) => !hasHistory ? false : !(["Rejected", "Withdrawn", "Hired"].includes(a.stage)) && a.managedBy === "internflare");
  const upcoming = hasHistory ? interviews.filter((i) => i.status !== "completed") : [];
  const currentModule = mods.find((m) => !lp?.completed.includes(m.id));
  const profilePct = hasHistory ? currentTalent.profileCompleteness : candidate.id === "new" ? 20 : candidate.id === "kwame" ? 92 : 55;
  const profileItems = hasHistory
    ? currentTalent.missingProfileItems
    : [
        { label: "Add education and experience", href: "/app/profile" },
        { label: "Upload your CV", href: "/app/profile" },
        { label: "Add a portfolio project", href: "/app/portfolio" },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Thursday, 15 May</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{candidate.id === "new" ? "Welcome to Internflare" : `Welcome back, ${candidate.firstName}`}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{candidate.headline}{rr ? ` · Goal: ${rr.role.title}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="bg-card"><Link to="/app/learn">Learn</Link></Button>
          <Button asChild variant="outline" className="bg-card"><Link to="/app/internships">Internships</Link></Button>
          <Button asChild><Link to="/app/jobs">Jobs</Link></Button>
        </div>
      </div>

      <section aria-labelledby="readiness-overview">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="readiness-overview" className="text-lg font-semibold">Readiness overview</h2>
            <p className="text-sm text-muted-foreground">{rr && rr.assessment ? `${rr.role.title} · last assessed ${rr.assessment.assessedOn}` : "Separate statuses for learning, internships and jobs"}</p>
          </div>
          <Link to={`/app/assessments${roleId ? `?role=${roleId}` : ""}`} className="text-sm font-semibold text-primary hover:underline">Assessments & readiness →</Link>
        </div>
        <GoalVsEvidence goal={candidate.statedGoal} readiness={rr} className="mb-4" />
        {rr ? <ReadinessLevelCards readiness={rr} learningProgress={learningProgress} /> : null}
        <NextActionsList actions={nextActions(candidate)} className={rr ? "mt-4" : ""} />
      </section>

      {hasHistory && (
      <div className="rounded-xl border border-success/25 bg-success-soft/70 p-4 sm:flex sm:items-center sm:gap-4">
        <HandshakeIcon className="h-6 w-6 shrink-0 text-success" />
        <div className="mt-2 flex-1 sm:mt-0">
          <p className="font-semibold">Brightwave Studio sent you an offer</p>
          <p className="text-sm text-muted-foreground">Product Design Intern · $400/month · Review before 24 May 2025</p>
        </div>
        <Button asChild size="sm" className="mt-3 sm:mt-0"><Link to="/app/offers">Review offer</Link></Button>
      </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Active applications" value={active.length + candidate.applied.length} sub="Managed on Internflare" />
        <StatTile label="Upcoming interviews" value={upcoming.length} sub={upcoming.length ? "Next: Thu 22 May" : "None scheduled"} />
        <StatTile label="Offers" value={hasHistory ? currentTalent.stats.offers : 0} sub={hasHistory ? "1 awaiting response" : "—"} />
        <StatTile label="Assessments" value={Object.keys(candidate.assessments).length} sub="Completed roles" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <WidgetCard title="Application pipeline" description="Applications managed on Internflare" action={<Link to="/app/applications" className="text-sm font-medium text-primary hover:underline">View all</Link>}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
              {pipelineStages.map((s) => {
                const n = applications.filter((a) => a.stage === s && a.managedBy === "internflare").length;
                return (
                  <div key={s} className="rounded-lg border bg-muted/30 p-2.5 text-center">
                    <p className="text-xl font-bold tabular-nums">{n}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{s}</p>
                  </div>
                );
              })}
            </div>
            <ul className="mt-4 divide-y">
              {active.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <CompanyLogo initials={a.companyInitials} size="sm" tone={getCompany(opportunities.find((o) => o.id === a.opportunityId)?.companyId ?? "").tone} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.company} · {a.nextAction}</p>
                  </div>
                  <StageBadge stage={a.stage} />
                </li>
              ))}
            </ul>
          </WidgetCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <WidgetCard title="Upcoming interviews" icon={<CalendarClockIcon className="h-4 w-4" />} action={<Link to="/app/interviews" className="text-sm font-medium text-primary hover:underline">All</Link>}>
              <ul className="space-y-3">
                {upcoming.map((i) => (
                  <li key={i.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{i.company} · {i.stage}</p>
                      {i.format.startsWith("AI") ? <span className="text-xs font-medium text-ai-strong">{i.format}</span> : <VideoIcon className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{i.date} · {i.time} {i.timezone}</p>
                  </li>
                ))}
              </ul>
            </WidgetCard>
            <WidgetCard title="Tasks & deadlines" icon={<CheckSquareIcon className="h-4 w-4" />}>
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <CircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.meta}</p>
                    </div>
                    <span className={t.urgent ? "shrink-0 text-xs font-semibold text-destructive" : "shrink-0 text-xs text-muted-foreground"}>{t.due}</span>
                  </li>
                ))}
              </ul>
            </WidgetCard>
          </div>

          <WidgetCard title="Recommended for you" description="Listings you're eligible for, based on your assessed competencies" icon={<SparklesIcon className="h-4 w-4 text-ai-strong" />} action={<Link to={rr?.status === "job" ? "/app/jobs?eligible=1" : "/app/internships?eligible=1"} className="text-sm font-medium text-primary hover:underline">Browse</Link>}>
            {recommended.length === 0 && (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No eligible listings yet. Complete your assessment or recommended learning to unlock applications. <Link to={roleId ? `/app/learning?role=${roleId}` : "/app/learn"} className="font-medium text-primary hover:underline">See what to learn next</Link></p>
            )}
            <div className="grid gap-3 md:grid-cols-3">
              {recommended.map(({ o, e }) => {
                const c = getCompany(o.companyId);
                return (
                  <Link key={o.id} to={`/app/${e.requirement?.level === "internship" ? "internships" : "jobs"}?selected=${o.id}`} className="rounded-lg border p-3.5 transition-colors hover:border-primary/40">
                    <div className="flex items-center gap-2">
                      <CompanyLogo initials={c.initials} tone={c.tone} size="sm" />
                      <span className="truncate text-xs text-muted-foreground">{c.name}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug">{o.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{e.requirement?.employment} · {formatCompensation(o.compensation)}</p>
                    <EligibilityPill e={e} className="mt-2" />
                  </Link>
                );
              })}
            </div>
          </WidgetCard>
        </div>

        <div className="space-y-6">
          <WidgetCard title="Profile completeness" description="Helps employers review you — it doesn't unlock applications on its own" action={<span className="text-sm font-semibold tabular-nums">{profilePct}%</span>}>
            <Progress value={profilePct} className="h-2" aria-label="Profile completeness" />
            <ul className="mt-3 space-y-1.5">
              {profileItems.map((m) => (
                <li key={m.label}>
                  <Link to={m.href} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                    {m.label} <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </WidgetCard>

          <WidgetCard title="Career readiness" description={rr?.assessment ? `${rr.role.title} · assessed ${rr.assessment.assessedOn}` : "Not assessed yet"} icon={<GaugeIcon className="h-4 w-4" />}>
            {rr && rr.overall !== null ? (
              <div className="flex items-center gap-5">
                <ReadinessRing value={rr.overall} size={96} label={`${rr.role.title} readiness`} />
                <div className="space-y-1.5 text-sm">
                  <p>Internship: <span className={rr.internship.ok ? "font-semibold text-success" : "font-semibold text-warning"}>{rr.internship.ok ? "eligible" : "not yet"}</span> <span className="text-muted-foreground">({rr.internship.threshold})</span></p>
                  <p>Job: <span className={rr.job.ok ? "font-semibold text-success" : "font-semibold text-warning"}>{rr.job.ok ? "eligible" : "not yet"}</span> <span className="text-muted-foreground">({rr.job.threshold})</span></p>
                  <Link to={`/app/assessments?role=${rr.role.id}`} className="inline-block font-medium text-primary hover:underline">See explanation →</Link>
                </div>
              </div>
            ) : (
              <Button asChild className="w-full"><Link to={roleId ? `/app/assessments/${roleId}/take` : "/onboarding"}>{roleId ? "Take your assessment" : "Choose a career goal"}</Link></Button>
            )}
          </WidgetCard>

          <WidgetCard title="Learning path" icon={<BookOpenIcon className="h-4 w-4" />} action={<Link to={roleId ? `/app/learning?role=${roleId}` : "/app/learn"} className="text-sm font-medium text-primary hover:underline">Open</Link>}>
            <p className="text-sm text-muted-foreground">{mods.length ? `${lp?.completed.length ?? 0} of ${mods.length} modules complete` : "Explore Learning is open to everyone."}</p>
            {currentModule && (
              <div className="mt-3 rounded-lg border p-3">
                <p className="text-sm font-medium">Next: {currentModule.title}</p>
                <Progress value={learningProgress} className="mt-2 h-1.5" aria-label={`${learningProgress}% of plan`} />
                <p className="mt-1.5 text-xs text-muted-foreground">{currentModule.evidenceRequired ? "Practical evidence required" : "No evidence required"}</p>
              </div>
            )}
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Avatar className="h-8 w-8"><AvatarImage src={mentors[0].avatar} alt="" /><AvatarFallback>CE</AvatarFallback></Avatar>
              <div className="text-xs">
                <p className="font-medium">Mentor session with {mentors[0].name}</p>
                <p className="text-muted-foreground">{mentors[0].next}</p>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Client follow-ups" description="User-recorded lead activity" action={<Link to="/app/leads" className="text-sm font-medium text-primary hover:underline">Lead tracker</Link>}>
            <ul className="space-y-2">
              {leads.map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.stage}</p>
                  </div>
                  <span className={l.followUp === "Today" ? "text-xs font-semibold text-primary" : "text-xs text-muted-foreground"}>{l.followUp}</span>
                </li>
              ))}
            </ul>
          </WidgetCard>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><EyeIcon className="h-3.5 w-3.5" /> All figures are illustrative demo data.</p>
        </div>
      </div>
    </div>
  );
}
