import { useMemo, useReducer } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  FileTextIcon,
  GraduationCapIcon,
  MessageSquareTextIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { OpportunityCard } from "@/polymet/components/opportunity-card";
import { OpportunityDetailPanel } from "@/polymet/components/opportunity-detail-panel";
import { StateBlock } from "@/polymet/components/page-states";
import { JobsWordmark } from "@/polymet/components/brand-logo";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { getCompany, opportunities } from "@/polymet/data/opportunities-data";
import { careerRoles, opportunityRequirements, type PathwayLevel } from "@/polymet/data/pathway-data";
import { eligibilityFor, levelOf, roleReadiness } from "@/polymet/lib/pathway-engine";

interface BoardProps {
  level: PathwayLevel;
  publicView?: boolean;
}

type OpportunityBoardState = {
  query: string;
  arrangement: string;
  kind: string;
  mobileOpen: boolean;
};

type OpportunityBoardAction =
  | { type: "search-changed"; query: string }
  | { type: "arrangement-selected"; arrangement: string }
  | { type: "kind-selected"; kind: string }
  | { type: "mobile-panel-open-changed"; open: boolean };

function opportunityBoardReducer(
  state: OpportunityBoardState,
  action: OpportunityBoardAction,
): OpportunityBoardState {
  switch (action.type) {
    case "search-changed":
      return { ...state, query: action.query };
    case "arrangement-selected":
      return { ...state, arrangement: action.arrangement };
    case "kind-selected":
      return { ...state, kind: action.kind };
    case "mobile-panel-open-changed":
      return { ...state, mobileOpen: action.open };
  }
}

function PathwayBanner({ level, roleId, base }: { level: PathwayLevel; roleId: string | null; base: string }) {
  const { candidate } = usePathway();
  if (!roleId) {
    return (
      <Banner tone="ai" Icon={SparklesIcon} title="Check your eligibility before applying" body="Applications open once you've completed the assessment for the role and met the employer's threshold. Choose a career goal to start." cta={{ label: "Choose a career goal", to: "/onboarding" }} />
    );
  }
  const r = roleReadiness(candidate, roleId);
  if (!r) return null;
  const role = r.role.title;
  if (r.status === "not-assessed")
    return <Banner tone="ai" Icon={SparklesIcon} title={`Take the ${role} assessment to unlock applications`} body="You can browse everything now. Applying requires a completed role assessment — your profile alone isn't enough." cta={{ label: "Start assessment", to: `/app/assessments/${roleId}/take` }} />;
  if (level === "internship") {
    if (r.job.ok)
      return <Banner tone="success" Icon={TrendingUpIcon} title={`Your evidence supports ${role} jobs`} body={`Readiness ${r.overall} meets the job threshold of ${r.job.threshold}. You don't need to complete an internship first.`} cta={{ label: "Explore jobs you may qualify for", to: `${base}/jobs?role=${roleId}&eligible=1` }} />;
    if (r.internship.ok)
      return <Banner tone="success" Icon={GraduationCapIcon} title="You may qualify for these internships" body={`${role} readiness ${r.overall} meets the default internship threshold of ${r.internship.threshold}. Each listing may set its own requirements.`} cta={{ label: "Explore jobs you may qualify for", to: `${base}/jobs?role=${roleId}` }} />;
    return <Banner tone="warning" Icon={BookOpenIcon} title="Not eligible yet? See your recommended learning plan" body={`Still needed for ${role} internships: ${r.internship.unmet.map((g) => g.label).join(" · ")}`} cta={{ label: "Open learning plan", to: `/app/learning?role=${roleId}` }} />;
  }
  if (r.job.ok)
    return <Banner tone="success" Icon={BriefcaseIcon} title="Your current skills match these jobs" body={`${role} readiness ${r.overall} meets the job threshold of ${r.job.threshold}.`} cta={{ label: "View assessment details", to: `/app/assessments?role=${roleId}` }} />;
  if (r.internship.ok)
    return <Banner tone="warning" Icon={GraduationCapIcon} title="Not job-ready yet — but you qualify for internships" body={`Still needed for ${role} jobs: ${r.job.unmet.map((g) => g.label).join(" · ")}`} cta={{ label: "Check suitable internships", to: `${base}/internships?role=${roleId}&eligible=1` }} secondary={{ label: "Job-readiness plan", to: `/app/learning?role=${roleId}` }} />;
  return <Banner tone="warning" Icon={BookOpenIcon} title="Not eligible yet? Check your learning recommendations" body={`You don't meet ${role} internship or job thresholds yet. A learning pathway is ready for you.`} cta={{ label: "Start recommended learning", to: `/app/learning?role=${roleId}` }} secondary={{ label: "Check suitable internships", to: `${base}/internships?role=${roleId}` }} />;
}

function Banner({ tone, Icon, title, body, cta, secondary }: { tone: "ai" | "success" | "warning"; Icon: React.ElementType; title: string; body: string; cta: { label: string; to: string }; secondary?: { label: string; to: string } }) {
  const cls = { ai: "border-ai/30 bg-ai-soft/60 [&_svg.lead]:text-ai-strong", success: "border-success/25 bg-success-soft/60 [&_svg.lead]:text-success", warning: "border-warning/30 bg-warning-soft [&_svg.lead]:text-warning" }[tone];
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center", cls)}>
      <Icon className="lead h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {secondary && <Button asChild size="sm" variant="outline" className="bg-card"><Link to={secondary.to}>{secondary.label}</Link></Button>}
        <Button asChild size="sm"><Link to={cta.to}>{cta.label}</Link></Button>
      </div>
    </div>
  );
}

function OpportunityBoard({ level, publicView }: BoardProps) {
  const { candidate } = usePathway();
  const [params, setParams] = useSearchParams();
  const [state, dispatch] = useReducer(opportunityBoardReducer, {
    query: "",
    arrangement: "all",
    kind: "all",
    mobileOpen: false,
  });
  const { query: q, arrangement, kind, mobileOpen } = state;
  const base = publicView ? "" : "/app";
  const isIntern = level === "internship";

  const roleParam = params.get("role") ?? "all";
  const eligibleOnly = params.get("eligible") === "1";
  const tab = params.get("tab") ?? "all";
  const bannerRole = roleParam !== "all" ? roleParam : candidate.targetRoleId;

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v === null || v === "" || v === "all") next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const pool = useMemo(() => opportunities.filter((o) => levelOf(o) === level), [level]);
  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return pool
      .map((o) => ({ o, e: eligibilityFor(candidate, o.id), req: opportunityRequirements[o.id] }))
      .filter(({ o, e, req }) => {
        if (kw && ![o.title, getCompany(o.companyId).name, ...o.skills].some((s) => s.toLowerCase().includes(kw))) return false;
        if (arrangement !== "all" && o.arrangement !== arrangement) return false;
        if (isIntern && kind !== "all" && (kind === "paid") !== (o.compensation?.paid ?? false)) return false;
        if (!isIntern && kind !== "all" && req?.employment !== kind) return false;
        if (roleParam !== "all" && req?.roleId !== roleParam) return false;
        if (eligibleOnly && e.state !== "eligible") return false;
        if (tab === "recommended" && e.state !== "eligible") return false;
        if (tab === "applied" && !candidate.applied.includes(o.id)) return false;
        return true;
      })
      .sort((a, b) => {
        const rank = { eligible: 0, "not-eligible": 1, "not-assessed": 2, unconfigured: 3, closed: 4 } as const;
        return rank[a.e.state] - rank[b.e.state] || (b.e.overall ?? 0) - (a.e.overall ?? 0);
      });
  }, [pool, candidate, q, arrangement, kind, roleParam, eligibleOnly, tab, isIntern]);

  const selectedId = params.get("selected");
  const selected = rows.find((r) => r.o.id === selectedId)?.o ?? rows[0]?.o;
  const eligibleCount = pool.filter((o) => eligibilityFor(candidate, o.id).state === "eligible").length;
  const appliedCount = pool.filter((o) => candidate.applied.includes(o.id)).length;
  const select = (id: string) => {
    setParam("selected", id);
    if (window.matchMedia("(max-width: 1023px)").matches)
      dispatch({ type: "mobile-panel-open-changed", open: true });
  };

  const sideLinks = isIntern
    ? [
        { Icon: BriefcaseIcon, label: "Track internship applications", to: "/app/applications" },
        { Icon: CalendarClockIcon, label: "Interview schedule", to: "/app/interviews" },
        { Icon: MessageSquareTextIcon, label: "Interview preparation", to: "/app/tools/interview-practice" },
        { Icon: TrendingUpIcon, label: "Internship outcomes → job readiness", to: `/app/assessments?role=${bannerRole ?? ""}` },
      ]
    : [
        { Icon: FileTextIcon, label: "CV & application support", to: "/app/tools/cv-review" },
        { Icon: BriefcaseIcon, label: "Track job applications", to: "/app/applications" },
        { Icon: CalendarClockIcon, label: "Interviews & assessments", to: "/app/interviews" },
        { Icon: GraduationCapIcon, label: "Offers & employment outcomes", to: "/app/offers" },
      ];

  return (
    <div className={cn(publicView && "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8")}>
      <Toaster />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{isIntern ? "Level 2 · Internships" : "Level 3 · The job pool"}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{isIntern ? "Internships" : <JobsWordmark className="gap-2 [&>svg]:h-7 [&>svg]:w-7" />}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {isIntern
              ? "Paid and unpaid internships with clearly stated terms. Each listing shows the competencies and internship-readiness threshold the employer configured."
              : "A pool of assessed, job-ready talent and the full-time, part-time, contract and freelance roles open to them. Only candidates whose evidence meets job-readiness can apply — everyone else gets routed to internships or learning."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="bg-card"><Link to={`${base}/learn`}><BookOpenIcon /> Learn</Link></Button>
          <Button asChild variant="outline" className="bg-card"><Link to={isIntern ? `${base}/jobs` : `${base}/internships`}>{isIntern ? <BriefcaseIcon /> : <GraduationCapIcon />} {isIntern ? "Jobs" : "Internships"}</Link></Button>
          <Button asChild variant="outline" className="bg-card"><Link to="/app/assessments">Assessments & readiness</Link></Button>
        </div>
      </div>

      <div className="mt-5">
        <PathwayBanner level={level} roleId={bannerRole} base={base} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setParam("tab", v)} className="mt-5">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="all">All {isIntern ? "internships" : "jobs"} ({pool.length})</TabsTrigger>
          <TabsTrigger value="recommended">Recommended for you ({eligibleCount})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({appliedCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-2 rounded-xl border bg-card p-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => dispatch({ type: "search-changed", query: e.target.value })} placeholder="Role, skill or company" className="h-10 border-0 bg-muted/60 pl-9 shadow-none" aria-label="Search" />
        </div>
        <Select value={roleParam} onValueChange={(v) => setParam("role", v)}>
          <SelectTrigger className="h-10" aria-label="Role"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {careerRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={arrangement} onValueChange={(value) => dispatch({ type: "arrangement-selected", arrangement: value })}>
          <SelectTrigger className="h-10" aria-label="Work arrangement"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any arrangement</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kind} onValueChange={(value) => dispatch({ type: "kind-selected", kind: value })}>
          <SelectTrigger className="h-10" aria-label={isIntern ? "Paid status" : "Employment type"}><SelectValue /></SelectTrigger>
          <SelectContent>
            {isIntern ? (
              <>
                <SelectItem value="all">Paid & unpaid</SelectItem>
                <SelectItem value="paid">Paid only</SelectItem>
                <SelectItem value="unpaid">Unpaid only</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="all">Any employment type</SelectItem>
                {["Full-time", "Part-time", "Contract", "Freelance", "Graduate · Full-time"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </>
            )}
          </SelectContent>
        </Select>
        <div className="flex h-10 items-center gap-2 rounded-md px-3">
          <Switch id={`elig-${level}`} checked={eligibleOnly} onCheckedChange={(v) => setParam("eligible", v ? "1" : null)} />
          <Label htmlFor={`elig-${level}`} className="whitespace-nowrap text-sm">Eligible only</Label>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="space-y-3">
          {rows.length === 0 ? (
            <StateBlock
              kind={tab === "applied" ? "empty" : "no-results"}
              title={tab === "applied" ? `No ${isIntern ? "internship" : "job"} applications yet` : eligibleOnly || tab === "recommended" ? "No eligible listings with these filters" : "No listings match"}
              description={eligibleOnly || tab === "recommended" ? "Eligibility is checked per role. Try another role, or see what to learn next." : "Try fewer filters or a different keyword."}
              action={eligibleOnly || tab === "recommended" ? { label: "See learning recommendations", to: `/app/learning${bannerRole ? `?role=${bannerRole}` : ""}` } : undefined}
            />
          ) : (
            rows.map(({ o }) => <OpportunityCard key={o.id} opportunity={o} variant="list" selected={selected?.id === o.id} onSelect={select} />)
          )}
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm font-semibold">{isIntern ? "Your internship journey" : "Your job search"}</p>
            <ul className="mt-2 space-y-1">
              {sideLinks.map(({ Icon, label, to }) => (
                <li key={label}>
                  <Link to={to} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" /> <span className="flex-1">{label}</span> <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hidden lg:block">
          {selected && <OpportunityDetailPanel opportunity={selected} showFullLink className="sticky top-20" />}
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={(open) => dispatch({ type: "mobile-panel-open-changed", open })}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-0 lg:hidden">
          <SheetTitle className="sr-only">{selected?.title}</SheetTitle>
          {selected && <OpportunityDetailPanel opportunity={selected} showFullLink className="rounded-none border-0" />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function InternshipsPage({ publicView }: { publicView?: boolean }) {
  return <OpportunityBoard level="internship" publicView={publicView} />;
}

export function JobsPage({ publicView }: { publicView?: boolean }) {
  return <OpportunityBoard level="job" publicView={publicView} />;
}
