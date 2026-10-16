import { ClipboardCheckIcon, InfoIcon, ScaleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompetencyTable, EvidenceTag, GapExplanation } from "@/polymet/components/pathway/pathway-ui";
import { employerCandidateCompetencies, getRole, opportunityRequirements } from "@/polymet/data/pathway-data";
import { checkRequirement } from "@/polymet/lib/pathway-engine";

interface CandidateCompetenciesProps {
  candidateId: string;
  listingId: string;
}

/** Role-specific competency review for employers. Supports — never replaces — human judgement. */
export function CandidateCompetencies({ candidateId, listingId }: CandidateCompetenciesProps) {
  const a = employerCandidateCompetencies[candidateId];
  const req = opportunityRequirements[listingId];
  const role = getRole(req?.roleId ?? a?.roleId ?? "");
  if (!a || !role) {
    return (
      <section className="rounded-xl border border-dashed bg-card p-5 text-sm text-muted-foreground">
        No role assessment shared for this listing. Review CV and portfolio evidence, or request an interview or paid test task.
      </section>
    );
  }
  const threshold = req?.threshold ?? role.thresholds.job;
  const mins = req?.competencyMins ?? [];
  const r = checkRequirement(a, role, threshold, mins);
  const minMap = Object.fromEntries(mins.map((m) => [m.competencyId, m.min]));

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold"><ClipboardCheckIcon className="h-4 w-4" /> Role competencies · {role.title}</p>
          <p className="text-sm text-muted-foreground">Assessed {a.assessedOn} · attempt {a.attempts} · your threshold {threshold}{req ? ` (${req.level})` : ""}</p>
        </div>
        <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", r.ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
          {r.overall}/{threshold} · {r.ok ? "Meets your requirements" : "Below your requirements"}
        </span>
      </div>

      <GapExplanation met={r.met} unmet={r.unmet} className="mt-4" />

      <div className="mt-4">
        <CompetencyTable role={role} assessment={a} mins={Object.keys(minMap).length ? minMap : undefined} />
      </div>

      {(a.interviewResult || a.testTaskResult) && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
          {a.interviewResult && <li className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Interview</p>{a.interviewResult}</li>}
          {a.testTaskResult && <li className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Test task</p>{a.testTaskResult}</li>}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <InfoIcon className="h-3.5 w-3.5" /> Evidence labels:
        <EvidenceTag kind="self-reported" /><EvidenceTag kind="assessed" /><EvidenceTag kind="employer-confirmed" /><EvidenceTag kind="verified" />
      </div>
      <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <ScaleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Scores summarise assessment and evidence against your configured requirements. They are not proof of competence and don't make hiring decisions — review evidence, interviews and test tasks before deciding.
      </p>
    </section>
  );
}
