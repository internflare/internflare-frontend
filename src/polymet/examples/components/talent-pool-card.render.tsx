import { TalentPoolCard } from "@/polymet/components/employer/talent-pool-card";
import { assessedTalent } from "@/polymet/data/talent-pool-data";
import { poolStatus } from "@/polymet/lib/pathway-engine";

export default function TalentPoolCardRender() {
  const t = assessedTalent[2];
  const s = poolStatus(t.assessment)!;
  return (
    <div className="max-w-sm p-6">
      <TalentPoolCard talent={t} status={s} shortlisted={false} invited={false} onShortlist={() => {}} onView={() => {}} onInvite={() => {}} />
    </div>
  );
}
