import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRightIcon, BookOpenIcon, ClipboardCheckIcon, HistoryIcon, InfoIcon, PencilIcon, PlusIcon, ScaleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/polymet/components/page-states";
import { ReadinessRing } from "@/polymet/components/readiness-ring";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { CompetencyTable, EligibilityPill, GapExplanation, GoalVsEvidence, NextActionsList, ReadinessLevelCards } from "@/polymet/components/pathway/pathway-ui";
import { getCompany, getOpportunity } from "@/polymet/data/opportunities-data";
import { careerRoles, getLevel, opportunityRequirements, scoringRules } from "@/polymet/data/pathway-data";
import { eligibilityFor, modulesFor, nextActions, projectedAssessment, roleReadiness } from "@/polymet/lib/pathway-engine";

export function AssessmentsPage() {
  const { candidate } = usePathway();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const assessedIds = Object.keys(candidate.assessments);
  const roleId = params.get("role") || candidate.targetRoleId || assessedIds[0] || careerRoles[0].id;
  const r = roleReadiness(candidate, roleId)!;
  const role = r.role;
  const tabs = Array.from(new Set([...(candidate.targetRoleId ? [candidate.targetRoleId] : []), ...assessedIds]));
  const lp = candidate.learning[roleId];
  const mods = modulesFor(roleId);
  const learningProgress = mods.length ? Math.round(((lp?.completed.length ?? 0) / mods.length) * 100) : 0;
  const projected = projectedAssessment(candidate, roleId);
  const roleOpps = Object.entries(opportunityRequirements).filter(([, req]) => req.roleId === roleId).map(([id]) => getOpportunity(id)!).filter((o) => o.status === "open");
  const pending = careerRoles.filter((x) => !candidate.assessments[x.id]);

  return (
    <div>
      <PageHeader
        eyebrow={<span className="text-xs font-semibold uppercase tracking-wider text-primary">Assessments & readiness</span>}
        title="Your readiness, role by role"
        description="Eligibility is calculated for each role and opportunity — never a single permanent label. Every result explains what you did well, what's missing and how to improve."
        actions={
          <>
            <Button asChild variant="outline" className="bg-card"><Link to={`/app/learning?role=${roleId}`}><BookOpenIcon /> Start recommended learning</Link></Button>
            <Button asChild><Link to={r.job.ok ? `/app/jobs?role=${roleId}&eligible=1` : `/app/internships?role=${roleId}`}>View suitable opportunities</Link></Button>
          </>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {tabs.map((id) => {
          const rr = roleReadiness(candidate, id)!;
          return (
            <button key={id} onClick={() => setParams({ role: id })} aria-pressed={id === roleId} className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors", id === roleId ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted")}>
              {rr.role.title}
              {rr.overall !== null && <span className="ml-1.5 opacity-70">{rr.overall}</span>}
            </button>
          );
        })}
        <Select value="" onValueChange={(v) => setParams({ role: v })}>
          <SelectTrigger className="h-9 w-auto gap-2 bg-card" aria-label="Check another role"><PlusIcon className="h-4 w-4" /><SelectValue placeholder="Check another role" /></SelectTrigger>
          <SelectContent>{careerRoles.map((x) => <SelectItem key={x.id} value={x.id}>{x.title}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {r.status === "not-assessed" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border bg-card p-6 sm:p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ai-soft text-ai-strong"><ClipboardCheckIcon className="h-5 w-5" /></span>
            <h2 className="mt-4 text-xl font-semibold">AI skills interview · {role.title}</h2>
            <p className="mt-1 text-muted-foreground">Choose Intern, Junior, Mid or Senior. The AI generates production-level questions for that level — including code reviews and coding tasks for technical roles — and grades every answer against a published rubric. About 25–40 minutes.</p>
            <ul className="mt-4 flex flex-wrap gap-2">{role.competencies.map((c) => <li key={c.id} className="rounded-md border bg-muted/40 px-2.5 py-1 text-sm">{c.label}</li>)}</ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => navigate(`/app/assessments/${roleId}/take`)}>Start AI interview <ArrowRightIcon /></Button>
              <Button asChild variant="outline" className="bg-card"><Link to={`/app/learn?role=${roleId}`}>Explore learning first</Link></Button>
            </div>
          </div>
          <ScoringRulesCard internship={r.internship.threshold} job={r.job.threshold} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 text-center">
              <ReadinessRing value={r.overall ?? 0} label={`${role.title} readiness`} />
              <p className="mt-3 text-sm font-semibold">{r.status === "job" ? "Job-ready" : r.status === "internship" ? "Internship-ready" : "Building foundations"}</p>
              <p className="text-xs text-muted-foreground">{r.assessment?.level ? `${getLevel(r.assessment.level).label} level · ` : ""}Last assessed {r.assessment?.assessedOn} · attempt {r.assessment?.attempts}</p>
              <Button asChild variant="outline" size="sm" className="mt-4 bg-card"><Link to={`/app/assessments/${roleId}/take`}>Retake AI interview</Link></Button>
            </div>
            <div className="space-y-4">
              <GoalVsEvidence goal={candidate.statedGoal} readiness={r} />
              <ReadinessLevelCards readiness={r} learningProgress={learningProgress} />
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Recommended next actions</h2>
            <NextActionsList actions={nextActions({ ...candidate, targetRoleId: roleId })} className="mt-3" />
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            {(["internship", "job"] as const).map((lvl) => (
              <div key={lvl} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold capitalize">{lvl} requirements · threshold {r[lvl].threshold}</p>
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", r[lvl].ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>{r[lvl].ok ? "Met" : "Not met yet"}</span>
                </div>
                <GapExplanation met={r[lvl].met} unmet={r[lvl].unmet} className="mt-4" />
              </div>
            ))}
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Competency breakdown</h2>
                <p className="text-sm text-muted-foreground">Purple arrows show projected scores if submitted learning evidence is accepted at reassessment.</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="bg-card"><Link to="/app/profile"><PencilIcon /> Correct profile info</Link></Button>
                <Button asChild variant="outline" size="sm" className="bg-card"><Link to="/app/portfolio"><PlusIcon /> Add evidence</Link></Button>
              </div>
            </div>
            <div className="mt-3">{r.assessment && <CompetencyTable role={role} assessment={r.assessment} projected={projected} />}</div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Role-specific eligibility</h2>
            <p className="text-sm text-muted-foreground">Each employer sets its own threshold. You can be eligible for one listing and not another.</p>
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {roleOpps.length === 0 && <li className="p-4 text-sm text-muted-foreground">No open listings for this role right now.</li>}
              {roleOpps.map((o) => {
                const e = eligibilityFor(candidate, o.id);
                const lvl = opportunityRequirements[o.id].level;
                return (
                  <li key={o.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{o.title}</p>
                      <p className="text-xs text-muted-foreground">{getCompany(o.companyId).name} · {lvl === "internship" ? "Internship" : opportunityRequirements[o.id].employment} · threshold {opportunityRequirements[o.id].threshold}</p>
                    </div>
                    <EligibilityPill e={e} />
                    <Link to={`/app/${lvl === "internship" ? "internships" : "jobs"}?selected=${o.id}`} className="text-sm font-semibold text-primary hover:underline">View</Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <p className="flex items-center gap-2 font-semibold"><HistoryIcon className="h-4 w-4" /> Assessments completed</p>
          <ul className="mt-3 space-y-3 text-sm">
            {assessedIds.length === 0 && <li className="text-muted-foreground">None yet.</li>}
            {assessedIds.flatMap((id) => candidate.assessments[id].history.map((h) => ({ id, ...h }))).reverse().map((h) => (
              <li key={`${h.id}-${h.date}-${h.overall}`} className="flex items-center justify-between gap-2">
                <span>{careerRoles.find((x) => x.id === h.id)?.title} · {h.kind}</span>
                <span className="text-muted-foreground">{h.date} · <span className="font-semibold text-foreground">{h.overall}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-semibold">Available / pending assessments</p>
          <ul className="mt-3 divide-y text-sm">
            {pending.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-2 py-2">
                <span>{x.title}<span className="block text-xs text-muted-foreground">{x.competencies.length} competencies · internship {x.thresholds.internship} / job {x.thresholds.job}</span></span>
                <Link to={`/app/assessments/${x.id}/take`} className="font-semibold text-primary hover:underline">Start</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-6 flex items-start gap-2 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
        <ScaleIcon className="mt-0.5 h-4 w-4 shrink-0" />
        One result never permanently classifies you. Submit new evidence or complete learning and request a reassessment at any time. AI-assisted scoring supports — never replaces — human review by employers.
      </p>
    </div>
  );
}

export function ScoringRulesCard({ internship, job }: { internship: number; job: number }) {
  return (
    <aside className="rounded-2xl border bg-card p-5">
      <p className="flex items-center gap-2 font-semibold"><InfoIcon className="h-4 w-4" /> How scoring works</p>
      <ul className="mt-3 space-y-3 text-sm">
        {scoringRules.map((s) => (
          <li key={s.part}>
            <p className="font-medium">{s.part}{s.weight ? ` · ${s.weight}%` : ""}</p>
            <p className="text-muted-foreground">{s.detail}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
        Overall = average of competency scores. Default thresholds: internship {internship}, job {job}. Employers may set different thresholds and per-competency minimums for each listing.
      </div>
    </aside>
  );
}
