import { Link } from "react-router-dom";
import { ArrowRightIcon, FolderKanbanIcon, HammerIcon, LayersIcon, LockIcon, TargetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/polymet/components/page-states";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { EvidenceTag } from "@/polymet/components/pathway/pathway-ui";
import { portfolioProjects } from "@/polymet/data/talent-data";
import { pathwayModules } from "@/polymet/data/pathway-data";

export function WorkspacePage() {
  const { candidate } = usePathway();
  const hasPortfolio = candidate.id === "amara";
  const practical = pathwayModules.filter((m) => m.kind === "Practical project" && candidate.learning[m.roleId]);

  return (
    <div>
      <PageHeader
        title="Workspace & projects"
        description="Everything you're building — employer workspaces, practical learning projects, portfolio work and client projects."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><HammerIcon className="h-4 w-4" /> Practical learning projects</p>
            <p className="text-sm text-muted-foreground">Projects from your learning path. Submitted evidence is reviewed at reassessment.</p>
            {practical.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No practical projects yet. <Link to="/app/learn" className="font-medium text-primary hover:underline">Browse practical projects in Learn</Link></p>
            ) : (
              <ul className="mt-4 divide-y">
                {practical.map((m) => {
                  const lp = candidate.learning[m.roleId];
                  const status = lp.appliedBoosts?.includes(m.id) ? "Counted at reassessment" : lp.evidence[m.id] ? "Evidence submitted" : lp.completed.includes(m.id) ? "Evidence needed" : "Not started";
                  return (
                    <li key={m.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.assignment}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{status}</span>
                      <Link to={`/app/learning?role=${m.roleId}`} className="text-sm font-semibold text-primary hover:underline">Open</Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-semibold"><LayersIcon className="h-4 w-4" /> Portfolio projects</p>
              <Link to="/app/portfolio" className="text-sm font-semibold text-primary hover:underline">Manage</Link>
            </div>
            {hasPortfolio ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {portfolioProjects.map((p) => (
                  <li key={p.id} className="rounded-lg border p-4">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.context} · {p.dates}</p>
                    <EvidenceTag kind={p.evidence} className="mt-2" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No portfolio projects yet. Add work to strengthen your assessment evidence.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-muted/40 p-5">
            <p className="flex items-center gap-2 font-semibold"><LockIcon className="h-4 w-4 text-muted-foreground" /> SquadCot workspace</p>
            <p className="mt-1 text-sm text-muted-foreground">Unlocks after you accept an offer and your employer grants access. Workspace data is never shared with other employers.</p>
            <Button asChild size="sm" variant="outline" className="mt-3 bg-card"><Link to="/app/offers">{hasPortfolio ? "Review pending offer" : "View offers"}</Link></Button>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><TargetIcon className="h-4 w-4" /> Client projects</p>
            <p className="mt-1 text-sm text-muted-foreground">Freelance work you've won through Client acquisition. Activity is user-recorded.</p>
            <Link to="/app/leads" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Open lead tracker <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><FolderKanbanIcon className="h-4 w-4" /> Turn work into eligibility</p>
            <p className="mt-1 text-sm text-muted-foreground">New practical evidence can be reviewed at your next reassessment.</p>
            <Link to="/app/assessments" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Assessments & readiness <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
