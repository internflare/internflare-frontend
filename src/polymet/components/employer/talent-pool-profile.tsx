import { BadgeCheckIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CompetencyTable, EvidenceTag, GapExplanation } from "@/polymet/components/pathway/pathway-ui";
import { statedGoalLabel } from "@/polymet/data/pathway-data";
import type { PoolTalent } from "@/polymet/data/talent-pool-data";
import type { PoolStatus, listingFit } from "@/polymet/lib/pathway-engine";

interface TalentPoolProfileProps {
  talent: PoolTalent;
  status: PoolStatus;
  fit?: ReturnType<typeof listingFit>;
}

export function TalentPoolProfile({ talent: t, status, fit }: TalentPoolProfileProps) {
  const jobMins = Object.fromEntries(status.role.coreMins.job.map((m) => [m.competencyId, m.min]));
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarImage src={t.avatar} alt="" />
          <AvatarFallback>{t.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div>
          <p className="flex items-center gap-1.5 text-lg font-semibold">{t.name}{t.identityVerified && <BadgeCheckIcon className="h-4 w-4 text-success" aria-label="Identity verified" />}</p>
          <p className="text-sm text-muted-foreground">{t.headline}</p>
          <p className="text-xs text-muted-foreground">{t.location} · {t.availability} · expects {t.expectation}</p>
        </div>
      </div>

      <section className="rounded-xl border bg-success-soft/40 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-success"><ShieldCheckIcon className="h-4 w-4" /> Why {t.name.split(" ")[0]} is in the internflareJobs pool</p>
        <GapExplanation met={status.met} unmet={[]} className="mt-2" />
        <p className="mt-3 text-xs text-muted-foreground">
          Stated goal at sign-up: <span className="font-medium text-foreground">{statedGoalLabel[t.statedGoal]}</span>. Placement is decided by assessed evidence ({t.assessment.assessedOn}, attempt {t.assessment.attempts}), not by the stated goal.
        </p>
      </section>

      {fit && (
        <section className="rounded-xl border p-4">
          <p className="text-sm font-semibold">Against your listing · threshold {fit.req.threshold}</p>
          <GapExplanation met={fit.met} unmet={fit.unmet} className="mt-2" />
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold">Role competencies · {status.role.title}</h3>
        <CompetencyTable role={status.role} assessment={t.assessment} mins={jobMins} />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Work evidence</h3>
        {t.evidence.length === 0 ? (
          <p className="text-sm text-muted-foreground">No work evidence shared yet.</p>
        ) : (
          <ul className="space-y-2">
            {t.evidence.map((e) => (
              <li key={e.title} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{e.title}</p><EvidenceTag kind={e.kind} /></div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.outcome}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Readiness scores support — never replace — your team's judgement. Confirm fit with an interview or paid test task.
      </p>
    </div>
  );
}
