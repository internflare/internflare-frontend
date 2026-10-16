import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleDotIcon,
  ClipboardCheckIcon,
  GraduationCapIcon,
  LockIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { statedGoalLabel, type CareerRole, type EvidenceKind, type RoleAssessment, type StatedGoal } from "@/polymet/data/pathway-data";
import type { Eligibility, Gap, NextAction, RoleReadiness } from "@/polymet/lib/pathway-engine";

/* ---------- Evidence labels ---------- */

const evidenceStyle: Record<EvidenceKind, { label: string; cls: string; Icon: React.ElementType }> = {
  "self-reported": { label: "Self-reported", cls: "bg-muted text-muted-foreground", Icon: UserIcon },
  assessed: { label: "Assessed", cls: "bg-ai-soft text-ai-strong", Icon: ClipboardCheckIcon },
  "employer-confirmed": { label: "Employer-confirmed", cls: "bg-warning-soft text-warning", Icon: UserCheckIcon },
  verified: { label: "Independently verified", cls: "bg-success-soft text-success", Icon: BadgeCheckIcon },
};

export function EvidenceTag({ kind, className }: { kind: EvidenceKind; className?: string }) {
  const s = evidenceStyle[kind];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium", s.cls, className)}>
      <s.Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

/* ---------- Eligibility pill ---------- */

export function EligibilityPill({ e, className }: { e: Eligibility; className?: string }) {
  const map = {
    eligible: { label: "Eligible to apply", cls: "border-success/30 bg-success-soft text-success", Icon: CheckCircle2Icon },
    "not-assessed": { label: "Assessment required", cls: "border-ai/30 bg-ai-soft text-ai-strong", Icon: ClipboardCheckIcon },
    "not-eligible": { label: "Not eligible yet", cls: "border-warning/30 bg-warning-soft text-warning", Icon: LockIcon },
    closed: { label: "Closed", cls: "bg-muted text-muted-foreground", Icon: LockIcon },
    unconfigured: { label: "Pending configuration", cls: "bg-muted text-muted-foreground", Icon: CircleDashedIcon },
  }[e.state];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", map.cls, className)}>
      <map.Icon className="h-3.5 w-3.5" />
      {map.label}
      {e.overall !== null && e.requirement && e.state !== "closed" && <span className="font-normal opacity-80">· {e.overall}/{e.requirement.threshold}</span>}
    </span>
  );
}

/* ---------- Met / unmet explanation ---------- */

export function GapExplanation({ met, unmet, className }: { met: string[]; unmet: Gap[]; className?: string }) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What you did well</p>
        {met.length ? (
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {met.map((m) => (
              <li key={m} className="flex gap-2"><CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0 text-success" />{m}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-sm text-muted-foreground">No requirements met yet.</p>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Still needed</p>
        {unmet.length ? (
          <ul className="mt-1.5 space-y-1.5 text-sm">
            {unmet.map((g) => (
              <li key={g.label} className="flex gap-2">
                <CircleDotIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span><span className="font-medium">{g.label}</span><span className="block text-xs text-muted-foreground">{g.detail}</span></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-sm text-success">All requirements met.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Three-level status cards ---------- */

interface LevelCardsProps {
  readiness: RoleReadiness;
  learningProgress: number;
  className?: string;
}

export function ReadinessLevelCards({ readiness: r, learningProgress, className }: LevelCardsProps) {
  const assessed = r.status !== "not-assessed";
  const cards = [
    {
      key: "learn",
      title: "Skills & learning",
      Icon: BookOpenIcon,
      state: !assessed ? "Not assessed yet" : `${learningProgress}% of recommended plan`,
      tone: "ai" as const,
      body: !assessed ? "Take an assessment to get a personalised plan. Explore Learn is open any time." : r.status === "learning" ? "Complete these learning activities and demonstrate your skills to be reassessed." : "Optional learning can strengthen your evidence for higher-level roles.",
      cta: { label: assessed ? "Open learning path" : "Explore Learn", to: assessed ? `/app/learning?role=${r.role.id}` : `/app/learn?role=${r.role.id}` },
      progress: assessed ? learningProgress : 0,
    },
    {
      key: "internship",
      title: "Internship eligibility",
      Icon: GraduationCapIcon,
      state: !assessed ? "Assessment required" : r.internship.ok ? "Ready to apply" : "Not eligible yet",
      tone: r.internship.ok ? ("success" as const) : ("warning" as const),
      body: !assessed ? `Threshold ${r.internship.threshold}. Completing your profile alone does not unlock applications.` : r.internship.ok ? `You meet the ${r.role.title} internship threshold (${r.overall}/${r.internship.threshold}).` : r.internship.unmet.map((g) => g.label).join(" · "),
      cta: r.internship.ok ? { label: "You may qualify for these internships", to: `/app/internships?role=${r.role.id}&eligible=1` } : { label: assessed ? "See recommended learning" : "Take assessment", to: assessed ? `/app/learning?role=${r.role.id}` : `/app/assessments/${r.role.id}/take` },
      progress: r.overall !== null ? Math.min(100, Math.round((r.overall / r.internship.threshold) * 100)) : 0,
    },
    {
      key: "job",
      title: "Job eligibility",
      Icon: BriefcaseIcon,
      state: !assessed ? "Assessment required" : r.job.ok ? "Ready to apply" : "More experience needed",
      tone: r.job.ok ? ("success" as const) : ("warning" as const),
      body: !assessed ? `Threshold ${r.job.threshold} — higher than internships for comparable roles.` : r.job.ok ? `Your current skills match ${r.role.title} jobs (${r.overall}/${r.job.threshold}). No internship required first.` : r.job.unmet.map((g) => g.label).join(" · "),
      cta: r.job.ok ? { label: "Your current skills match these jobs", to: `/app/jobs?role=${r.role.id}&eligible=1` } : r.internship.ok ? { label: "Job-readiness plan", to: `/app/learning?role=${r.role.id}` } : { label: "Check suitable internships", to: `/app/internships?role=${r.role.id}` },
      progress: r.overall !== null ? Math.min(100, Math.round((r.overall / r.job.threshold) * 100)) : 0,
    },
  ];
  const toneCls = { ai: "bg-ai-soft text-ai-strong", success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning" };
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {cards.map((c) => (
        <div key={c.key} className="flex flex-col rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><c.Icon className="h-4 w-4" /></span>
            <p className="text-sm font-semibold">{c.title}</p>
          </div>
          <span className={cn("mt-3 w-fit rounded-md px-2 py-0.5 text-xs font-semibold", toneCls[c.tone])}>{c.state}</span>
          <Progress value={c.progress} className="mt-3 h-1.5" aria-label={`${c.title} progress`} />
          <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.body}</p>
          <Link to={c.cta.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {c.cta.label} <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}

/* ---------- Next actions ---------- */

export function NextActionsList({ actions, className }: { actions: NextAction[]; className?: string }) {
  const dot = { primary: "bg-primary", ai: "bg-ai", success: "bg-success", warning: "bg-warning" };
  return (
    <ul className={cn("divide-y rounded-xl border bg-card", className)}>
      {actions.map((a) => (
        <li key={a.title} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className={cn("hidden h-2 w-2 shrink-0 rounded-full sm:block", dot[a.tone])} />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{a.title}</p>
            <p className="text-sm text-muted-foreground">{a.detail}</p>
          </div>
          <Link to={a.cta.to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {a.cta.label} <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Competency table ---------- */

interface CompetencyTableProps {
  role: CareerRole;
  assessment: RoleAssessment;
  mins?: Record<string, number>;
  projected?: RoleAssessment | null;
}

export function CompetencyTable({ role, assessment, mins, projected }: CompetencyTableProps) {
  const internshipMins = Object.fromEntries(role.coreMins.internship.map((m) => [m.competencyId, m.min]));
  const jobMins = Object.fromEntries(role.coreMins.job.map((m) => [m.competencyId, m.min]));
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Competency</th>
            <th className="px-4 py-2.5 font-medium">Score</th>
            <th className="px-4 py-2.5 font-medium">Evidence</th>
            <th className="px-4 py-2.5 font-medium">{mins ? "Role minimum" : "Internship / job min"}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {role.competencies.map((c) => {
            const r = assessment.scores[c.id];
            const score = r?.score ?? 0;
            const p = projected?.scores[c.id]?.score;
            const min = mins ? mins[c.id] : jobMins[c.id] ?? internshipMins[c.id];
            const below = min !== undefined && score < min;
            return (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-7 font-semibold tabular-nums", below && "text-warning")}>{score}</span>
                    <Progress value={score} className="h-1.5 w-20" aria-label={`${c.label} score`} />
                    {p !== undefined && p > score && <span className="text-xs font-medium text-ai-strong">→ {p}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">{r ? <EvidenceTag kind={r.evidence} /> : <span className="text-xs text-muted-foreground">None</span>}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {mins ? (min ?? "—") : `${internshipMins[c.id] ?? "—"} / ${jobMins[c.id] ?? "—"}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Stated goal vs evidence-based recommendation ---------- */

const recommendationMeta: Record<RoleReadiness["status"], { label: string; Icon: React.ElementType; cls: string }> = {
  "not-assessed": { label: "Take an assessment", Icon: ClipboardCheckIcon, cls: "bg-muted text-muted-foreground" },
  learning: { label: "Learning pathway", Icon: BookOpenIcon, cls: "bg-warning-soft text-warning" },
  internship: { label: "Internships", Icon: GraduationCapIcon, cls: "bg-success-soft text-success" },
  job: { label: "Jobs (internflareJobs pool)", Icon: BriefcaseIcon, cls: "bg-success-soft text-success" },
};

function goalNote(goal: StatedGoal, status: RoleReadiness["status"]) {
  if (status === "not-assessed") return "Your goal guides what we show you. Your assessed evidence decides which level you can apply to.";
  if (goal === "job" && status === "internship") return "You aimed for a job. Your evidence isn't job-ready yet, so we're routing you to internships plus a job-readiness plan — not a rejection.";
  if (goal !== "exploring" && status === "learning") return `You aimed for ${goal === "job" ? "a job" : "an internship"}. Your evidence points to a learning pathway first. Complete it, submit evidence and reassess.`;
  if (goal === "internship" && status === "job") return "You aimed for an internship, but your evidence shows you're job-ready. You can enter the job pool now — internships remain open to you too.";
  if (goal === "exploring") return "You haven't set a level goal. We've recommended a level from your demonstrated evidence.";
  return "Your evidence supports your goal. You can apply at this level now.";
}

export function GoalVsEvidence({ goal, readiness: r, className }: { goal: StatedGoal; readiness?: RoleReadiness | null; className?: string }) {
  const status = r?.status ?? "not-assessed";
  const rec = recommendationMeta[status];
  const aligned = status !== "not-assessed" && ((goal === "job" && status === "job") || (goal === "internship" && status === "internship"));
  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Your stated goal</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><UserIcon className="h-4 w-4 text-muted-foreground" />{statedGoalLabel[goal]}</p>
        </div>
        <ArrowRightIcon className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Evidence-based recommendation{r?.overall != null ? ` · ${r.overall}/100` : ""}</p>
          <span className={cn("mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm font-semibold", rec.cls)}><rec.Icon className="h-4 w-4" />{rec.label}</span>
        </div>
      </div>
      <p className={cn("mt-3 border-t pt-3 text-xs", aligned ? "text-success" : "text-muted-foreground")}>{goalNote(goal, status)}</p>
    </div>
  );
}
