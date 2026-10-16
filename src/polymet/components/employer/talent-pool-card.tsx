import { BadgeCheckIcon, BookmarkIcon, ClockIcon, MapPinIcon, SendIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EvidenceTag } from "@/polymet/components/pathway/pathway-ui";
import type { PoolTalent } from "@/polymet/data/talent-pool-data";
import type { PoolStatus, listingFit } from "@/polymet/lib/pathway-engine";

interface TalentPoolCardProps {
  talent: PoolTalent;
  status: PoolStatus;
  fit?: ReturnType<typeof listingFit>;
  shortlisted: boolean;
  invited: boolean;
  onShortlist: () => void;
  onView: () => void;
  onInvite: () => void;
}

const routeLabel: Record<PoolTalent["route"], string | null> = {
  direct: null,
  internship: "Reached via internship pathway",
  learning: "Reached via learning pathway",
};

export function TalentPoolCard({ talent: t, status, fit, shortlisted, invited, onShortlist, onView, onInvite }: TalentPoolCardProps) {
  const top = [...status.role.competencies]
    .map((c) => ({ c, r: t.assessment.scores[c.id] }))
    .filter((x) => x.r)
    .sort((a, b) => b.r.score - a.r.score)
    .slice(0, 3);
  const strong = t.evidence.filter((e) => e.kind === "verified" || e.kind === "employer-confirmed").length;
  const above = status.overall - status.threshold;

  return (
    <article className="flex flex-col rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={t.avatar} alt="" />
          <AvatarFallback>{t.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <button onClick={onView} className="truncate text-left font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{t.name}</button>
            {t.identityVerified && <BadgeCheckIcon className="h-4 w-4 shrink-0 text-success" aria-label="Identity verified" />}
          </div>
          <p className="truncate text-sm text-muted-foreground">{t.headline}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onShortlist} aria-pressed={shortlisted} aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"} className="h-8 w-8 shrink-0">
          <BookmarkIcon className={cn("h-4 w-4", shortlisted && "fill-primary text-primary")} />
        </Button>
      </div>

      <div className="mt-4 rounded-xl bg-muted/50 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">{status.role.title} · job readiness</p>
          <p className="text-sm font-bold tabular-nums">{status.overall}<span className="font-normal text-muted-foreground">/100</span></p>
        </div>
        <div className="relative mt-2 h-2 rounded-full bg-background">
          <div className="h-2 rounded-full bg-success" style={{ width: `${status.overall}%` }} />
          <span className="absolute -top-1 h-4 w-0.5 rounded bg-foreground/70" style={{ left: `${status.threshold}%` }} aria-hidden="true" />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">Job threshold {status.threshold} · {above > 0 ? `+${above} above` : "meets exactly"} · all core minimums met</p>
      </div>

      <ul className="mt-3 space-y-1.5">
        {top.map(({ c, r }) => (
          <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate">{c.label}</span>
            <span className="flex shrink-0 items-center gap-1.5"><span className="tabular-nums font-medium">{r.score}</span><EvidenceTag kind={r.evidence} /></span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" />{t.location} · {t.arrangements.join(" / ")}</span>
        <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" />{t.availability}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {t.employment.map((e) => <span key={e} className="rounded-md border px-1.5 py-0.5 text-[11px] font-medium">{e}</span>)}
        <span className="rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">{strong} confirmed/verified evidence</span>
        {routeLabel[t.route] && <span className="inline-flex items-center gap-1 rounded-md bg-ai-soft px-1.5 py-0.5 text-[11px] font-medium text-ai-strong"><TrendingUpIcon className="h-3 w-3" />{routeLabel[t.route]}</span>}
      </div>

      {fit && (
        <p className={cn("mt-3 rounded-lg px-2.5 py-1.5 text-xs font-medium", fit.ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
          {fit.ok ? `Meets your listing's requirements (${fit.overall}/${fit.req.threshold})` : `Job-ready, but below your listing: ${fit.unmet[0]?.label}`}
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        <Button variant="outline" className="flex-1 bg-card" onClick={onView}>View evidence</Button>
        <Button className="flex-1" onClick={onInvite} disabled={invited}><SendIcon />{invited ? "Invited" : "Invite"}</Button>
      </div>
    </article>
  );
}
