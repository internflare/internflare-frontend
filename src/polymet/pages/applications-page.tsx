import { useMemo, useReducer } from "react";
import { ArrowUpDownIcon, LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { CompanyLogo } from "@/polymet/components/company-logo";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { SourceBadge, StageBadge } from "@/polymet/components/status-badges";
import { ApplicationDetailSheet } from "@/polymet/components/application-detail-sheet";
import { SimplePagination } from "@/polymet/components/simple-pagination";
import { applications as seed, type Application, type ApplicationStage } from "@/polymet/data/talent-data";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { getCompany, getOpportunity } from "@/polymet/data/opportunities-data";
import { isInternship } from "@/polymet/lib/pathway-engine";

const stages: ApplicationStage[] = ["New", "Reviewed", "Shortlisted", "Interview", "Test Task", "Offer", "Hired", "Rejected", "Withdrawn"];
const PAGE = 5;
const isInternLevel = (id: string) => { const o = getOpportunity(id); return o ? isInternship(o) : false; };

type ApplicationsState = {
  apps: Application[];
  scope: string;
  q: string;
  stage: string;
  sortAsc: boolean;
  view: "table" | "cards";
  page: number;
  openId: string | null;
  level: string;
};

type ApplicationsAction =
  | { type: "set-apps"; apps: Application[] | ((apps: Application[]) => Application[]) }
  | { type: "set-scope"; scope: string }
  | { type: "set-query"; query: string }
  | { type: "set-stage"; stage: string }
  | { type: "toggle-sort" }
  | { type: "set-view"; view: "table" | "cards" }
  | { type: "set-page"; page: number }
  | { type: "set-open-id"; openId: string | null }
  | { type: "set-level"; level: string };

function applicationsReducer(state: ApplicationsState, action: ApplicationsAction): ApplicationsState {
  switch (action.type) {
    case "set-apps":
      return { ...state, apps: typeof action.apps === "function" ? action.apps(state.apps) : action.apps };
    case "set-scope":
      return { ...state, scope: action.scope };
    case "set-query":
      return { ...state, q: action.query };
    case "set-stage":
      return { ...state, stage: action.stage };
    case "toggle-sort":
      return { ...state, sortAsc: !state.sortAsc };
    case "set-view":
      return { ...state, view: action.view };
    case "set-page":
      return { ...state, page: action.page };
    case "set-open-id":
      return { ...state, openId: action.openId };
    case "set-level":
      return { ...state, level: action.level };
  }
}

export function ApplicationsPage() {
  const [state, dispatch] = useReducer(applicationsReducer, {
    apps: seed,
    scope: "internflare",
    q: "",
    stage: "all",
    sortAsc: false,
    view: "table",
    page: 1,
    openId: null,
    level: "all",
  });
  const { apps, scope, q, stage, sortAsc, view, page, openId, level } = state;
  const { candidate } = usePathway();
  const all = useMemo<Application[]>(() => {
    const fresh: Application[] = candidate.applied.map((id) => {
      const o = getOpportunity(id)!;
      const c = getCompany(o.companyId);
      return { id: `new-${id}`, opportunityId: id, title: o.title, company: c.name, companyInitials: c.initials, dateApplied: "12 May 2025", stage: "New", nextAction: "Awaiting employer review", managedBy: "internflare", updated: "Just now", history: [{ stage: "New", date: "Today", note: "Eligibility check passed at submission" }] };
    });
    return [...fresh, ...(candidate.id === "amara" ? apps : [])];
  }, [candidate, apps]);

  const list = useMemo(() => {
    const r = all.filter((a) =>
      (level === "all" || (level === "internship") === isInternLevel(a.opportunityId)) &&
      (scope === "all" || a.managedBy === scope) &&
      (stage === "all" || a.stage === stage) &&
      (!q || `${a.title} ${a.company}`.toLowerCase().includes(q.toLowerCase())),
    );
    return r.sort((x, y) => (sortAsc ? 1 : -1) * (Date.parse(x.dateApplied) - Date.parse(y.dateApplied)));
  }, [all, scope, stage, q, sortAsc, level]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE));
  const current = list.slice((page - 1) * PAGE, page * PAGE);
  const open = all.find((a) => a.id === openId) ?? null;

  const withdraw = (id: string) => {
    dispatch({ type: "set-apps", apps: (p) => p.map((a) => (a.id === id ? { ...a, stage: "Withdrawn", nextAction: "Withdrawn by you", history: [...a.history, { stage: "Withdrawn", date: "Today" }] } : a)) });
    dispatch({ type: "set-open-id", openId: null });
  };

  return (
    <div>
      <Toaster />
      <PageHeader title="My applications" description="Track every application and its next step. External applications are tracked separately because their status lives on the provider's site." />
      <Tabs value={scope} onValueChange={(v) => { dispatch({ type: "set-scope", scope: v }); dispatch({ type: "set-page", page: 1 }); }}>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="internflare">On Internflare ({all.filter((a) => a.managedBy === "internflare").length})</TabsTrigger>
          <TabsTrigger value="external">Tracked external ({all.filter((a) => a.managedBy === "external").length})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => { dispatch({ type: "set-query", query: e.target.value }); dispatch({ type: "set-page", page: 1 }); }} placeholder="Search role or company" className="h-9 bg-card pl-9" aria-label="Search applications" />
        </div>
        <Select value={stage} onValueChange={(v) => { dispatch({ type: "set-stage", stage: v }); dispatch({ type: "set-page", page: 1 }); }}>
          <SelectTrigger className="h-9 w-40 bg-card" aria-label="Filter by stage"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
       <Select value={level} onValueChange={(v) => { dispatch({ type: "set-level", level: v }); dispatch({ type: "set-page", page: 1 }); }}>
          <SelectTrigger className="h-9 w-40 bg-card" aria-label="Filter by level"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Internships & jobs</SelectItem>
            <SelectItem value="internship">Internships</SelectItem>
            <SelectItem value="job">Jobs</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 bg-card" onClick={() => dispatch({ type: "toggle-sort" })}>
          <ArrowUpDownIcon /> {sortAsc ? "Oldest first" : "Newest first"}
        </Button>
        <div className="ml-auto flex rounded-md border bg-card p-0.5" role="group" aria-label="View">
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", view === "table" && "bg-muted")} onClick={() => dispatch({ type: "set-view", view: "table" })} aria-label="Table view" aria-pressed={view === "table"}><ListIcon /></Button>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", view === "cards" && "bg-muted")} onClick={() => dispatch({ type: "set-view", view: "cards" })} aria-label="Card view" aria-pressed={view === "cards"}><LayoutGridIcon /></Button>
        </div>
      </div>

      <div className="mt-4">
        {list.length === 0 ? (
          <StateBlock kind={q || stage !== "all" ? "no-results" : "empty"} title={q || stage !== "all" ? "No applications match" : "No applications yet"} description="Find an opportunity that matches your skills and apply with your profile." action={{ label: "Find opportunities", to: "/app/internships" }} />
        ) : view === "table" ? (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Date applied</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="min-w-[220px]">Next action</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {current.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer" onClick={() => dispatch({ type: "set-open-id", openId: a.id })}>
                      <TableCell>
                        <button className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={(e) => { e.stopPropagation(); dispatch({ type: "set-open-id", openId: a.id }); }}>
                          <CompanyLogo initials={a.companyInitials} size="sm" />
                          <span>
                            <span className="block font-medium">{a.title}</span>
                            <span className="text-xs text-muted-foreground">{a.company}</span>
                          </span>
                        </button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{a.dateApplied}</TableCell>
                      <TableCell><StageBadge stage={a.stage} /></TableCell>
                      <TableCell className="text-sm">{a.nextAction}</TableCell>
                      <TableCell><SourceBadge source={a.managedBy} provider={a.provider} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="border-t px-4"><SimplePagination page={page} pageCount={pageCount} total={list.length} pageSize={PAGE} onPage={(nextPage) => dispatch({ type: "set-page", page: nextPage })} /></div>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {current.map((a) => (
                <button key={a.id} onClick={() => dispatch({ type: "set-open-id", openId: a.id })} className="rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="flex items-center gap-3">
                    <CompanyLogo initials={a.companyInitials} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.company} · {a.dateApplied}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5"><StageBadge stage={a.stage} /><SourceBadge source={a.managedBy} provider={a.provider} /></div>
                  <p className="mt-3 text-sm text-muted-foreground">{a.nextAction}</p>
                </button>
              ))}
            </div>
            <SimplePagination page={page} pageCount={pageCount} total={list.length} pageSize={PAGE} onPage={(nextPage) => dispatch({ type: "set-page", page: nextPage })} />
          </>
        )}
      </div>
      <ApplicationDetailSheet application={open} onOpenChange={(o) => !o && dispatch({ type: "set-open-id", openId: null })} onWithdraw={withdraw} />
    </div>
  );
}
