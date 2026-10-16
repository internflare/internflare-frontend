import { useMemo, useReducer } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookmarkPlusIcon,
  BookOpenIcon,
  BriefcaseIcon,
  ExternalLinkIcon,
  FileCodeIcon,
  GraduationCapIcon,
  HammerIcon,
  MonitorPlayIcon,
  NotebookTextIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { StateBlock } from "@/polymet/components/page-states";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { catalogue, catalogueTopics, careerRoles, type CatalogueItem } from "@/polymet/data/pathway-data";

const kindIcon: Record<CatalogueItem["kind"], React.ElementType> = {
  Course: GraduationCapIcon,
  Video: MonitorPlayIcon,
  Docs: NotebookTextIcon,
  Tutorial: FileCodeIcon,
  "Practical project": HammerIcon,
};

type LearnFilters = {
  query: string;
  kind: string;
  level: string;
  freeOnly: boolean;
};

type LearnFilterAction =
  | { type: "search-changed"; query: string }
  | { type: "kind-selected"; kind: string }
  | { type: "level-selected"; level: string }
  | { type: "free-filter-changed"; freeOnly: boolean };

function learnFiltersReducer(
  state: LearnFilters,
  action: LearnFilterAction,
): LearnFilters {
  switch (action.type) {
    case "search-changed":
      return { ...state, query: action.query };
    case "kind-selected":
      return { ...state, kind: action.kind };
    case "level-selected":
      return { ...state, level: action.level };
    case "free-filter-changed":
      return { ...state, freeOnly: action.freeOnly };
  }
}

export function LearnExplorePage({ publicView }: { publicView?: boolean }) {
  const { candidate } = usePathway();
  const [params, setParams] = useSearchParams();
  const [filters, dispatch] = useReducer(learnFiltersReducer, {
    query: "",
    kind: "all",
    level: "all",
    freeOnly: false,
  });
  const { query: q, kind, level, freeOnly } = filters;
  const topic = params.get("topic") ?? "all";
  const role = params.get("role") ?? "all";
  const readinessRole = role !== "all" ? role : candidate.targetRoleId;

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v === "all") next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const items = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return catalogue.filter((c) => {
      if (kw && ![c.title, c.provider, c.topic].some((s) => s.toLowerCase().includes(kw))) return false;
      if (topic !== "all" && c.topic !== topic) return false;
      if (role !== "all" && c.roleId !== role) return false;
      if (kind !== "all" && c.kind !== kind) return false;
      if (level !== "all" && c.level !== level) return false;
      if (freeOnly && !c.free) return false;
      return true;
    });
  }, [q, topic, role, kind, level, freeOnly]);

  const assessHref = readinessRole ? `/app/assessments?role=${readinessRole}` : "/app/assessments";

  return (
    <div className={cn(publicView && "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8")}>
      <Toaster />
      <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-accent via-card to-ai-soft p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Level 1 · Skilling & learning</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Explore Learning</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Open to everyone. Browse topics, courses, documentation and practical projects at your own pace — no assessment or recommendation needed, whatever your readiness level.
        </p>
        <div className="relative mt-5 max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => dispatch({ type: "search-changed", query: e.target.value })} placeholder="Search skills, topics or providers" className="h-11 bg-card pl-9" aria-label="Search learning" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" className="bg-card"><Link to={assessHref}><GraduationCapIcon /> Check your internship readiness</Link></Button>
          <Button asChild size="sm" variant="outline" className="bg-card"><Link to={assessHref}><BriefcaseIcon /> Check your job readiness</Link></Button>
          <Button asChild size="sm" variant="outline" className="bg-card"><Link to={`/app/learning${readinessRole ? `?role=${readinessRole}` : ""}`}><BookOpenIcon /> My recommended learning path</Link></Button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Topics">
        {["all", ...catalogueTopics].map((t) => (
          <button key={t} onClick={() => set("topic", t)} aria-pressed={topic === t} className={cn("rounded-md border px-3 py-1.5 text-sm font-medium transition-colors", topic === t ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted")}>
            {t === "all" ? "All topics" : t}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={role} onValueChange={(v) => set("role", v)}>
          <SelectTrigger className="bg-card" aria-label="Career role"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any career role</SelectItem>
            {careerRoles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={kind} onValueChange={(value) => dispatch({ type: "kind-selected", kind: value })}>
          <SelectTrigger className="bg-card" aria-label="Format"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any format</SelectItem>
            {Object.keys(kindIcon).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={(value) => dispatch({ type: "level-selected", level: value })}>
          <SelectTrigger className="bg-card" aria-label="Level"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any level</SelectItem>
            {["Beginner", "Intermediate", "Advanced"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-md border bg-card px-3">
          <Switch id="free-only" checked={freeOnly} onCheckedChange={(value) => dispatch({ type: "free-filter-changed", freeOnly: value })} />
          <Label htmlFor="free-only" className="text-sm">Free only</Label>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{items.length} resources · External resources open on the provider's site.</p>

      {items.length === 0 ? (
        <StateBlock kind="no-results" title="No resources match" description="Try another topic or clear filters." className="mt-4" />
      ) : (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => {
            const Icon = kindIcon[c.kind];
            const project = c.kind === "Practical project";
            return (
              <li key={c.id} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", project ? "bg-accent text-primary" : "bg-muted")}><Icon className="h-4 w-4" /></span>
                  <div className="flex flex-wrap justify-end gap-1">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium">{c.kind}</span>
                    {c.free && <span className="rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">Free</span>}
                  </div>
                </div>
                <p className="mt-3 font-semibold leading-snug">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.provider}</p>
                <p className="mt-2 text-xs text-muted-foreground">{c.topic} · {c.level} · {c.duration}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Button asChild size="sm" variant={project ? "default" : "outline"} className={project ? "" : "bg-card"}>
                    <a href={c.url} target="_blank" rel="noreferrer">{project ? "Start project" : "Open resource"} <ExternalLinkIcon /></a>
                  </Button>
                  {project ? (
                    <Button asChild size="sm" variant="ghost"><Link to="/app/portfolio">Submit as evidence</Link></Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => toast("Saved to your learning list", { description: c.title })}><BookmarkPlusIcon /> Save</Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <p className="flex items-center gap-2 font-semibold"><UsersIcon className="h-4 w-4" /> Learn with a mentor</p>
          <p className="mt-1 text-sm text-muted-foreground">Optional human coaching, feedback on practical work and accountability check-ins.</p>
          <Link to="/app/mentors" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Browse mentors →</Link>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="flex items-center gap-2 font-semibold"><GraduationCapIcon className="h-4 w-4" /> Ready to see where you stand?</p>
          <p className="mt-1 text-sm text-muted-foreground">Role assessments unlock internship and job applications when you meet each employer's threshold.</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/app/internships" className="text-primary hover:underline">Internships →</Link>
            <Link to="/app/jobs" className="text-primary hover:underline">Jobs →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
