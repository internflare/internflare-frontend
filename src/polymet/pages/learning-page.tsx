import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleIcon,
  CompassIcon,
  ExternalLinkIcon,
  FlagIcon,
  RefreshCwIcon,
  SparklesIcon,
  UploadIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader } from "@/polymet/components/page-states";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { GapExplanation } from "@/polymet/components/pathway/pathway-ui";
import { careerRoles, getRole, type PathwayModule } from "@/polymet/data/pathway-data";
import { modulesFor, overallScore, projectedAssessment, roleReadiness } from "@/polymet/lib/pathway-engine";

function EvidenceDialog({ module: m, roleId }: { module: PathwayModule; roleId: string }) {
  const { submitEvidence } = usePathway();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const valid = /^https?:\/\/.+\..+/.test(url.trim());
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UploadIcon /> Submit practical evidence</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit evidence · {m.title}</DialogTitle>
          <DialogDescription>{m.assignment}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`ev-url-${m.id}`}>Link to your work</Label>
            <Input id={`ev-url-${m.id}`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/you/project" />
            {url && !valid && <p className="text-xs text-destructive">Enter a full URL starting with https://</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`ev-note-${m.id}`}>What you did and what you learned</Label>
            <Textarea id={`ev-note-${m.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </div>
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">Evidence is reviewed at reassessment. Until then it's labelled as submitted, not verified.</p>
        </div>
        <DialogFooter>
          <Button disabled={!valid} onClick={() => { submitEvidence(roleId, m.id, url.trim(), note.trim()); setOpen(false); toast("Evidence submitted", { description: "Request a reassessment when you're ready." }); }}>Submit evidence</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LearningPage() {
  const { candidate, toggleModule, reassess } = usePathway();
  const [params, setParams] = useSearchParams();
  const assessed = Object.keys(candidate.assessments);
  const roleId = params.get("role") || candidate.targetRoleId || assessed[0] || careerRoles[0].id;
  const role = getRole(roleId)!;
  const r = roleReadiness(candidate, roleId)!;
  const lp = candidate.learning[roleId] ?? { completed: [], evidence: {}, appliedBoosts: [] };
  const modules = modulesFor(roleId);
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);

  const target = r.status === "not-assessed" ? null : r.internship.ok ? (r.job.ok ? null : "job") : "internship";
  const unmetIds = new Set(target ? (target === "job" ? role.coreMins.job : role.coreMins.internship).filter((m) => (r.assessment?.scores[m.competencyId]?.score ?? 0) < m.min).map((m) => m.competencyId) : []);
  const sorted = [...modules].sort((a, b) => Number(Object.keys(b.boosts).some((k) => unmetIds.has(k))) - Number(Object.keys(a.boosts).some((k) => unmetIds.has(k))));
  const progress = modules.length ? Math.round((lp.completed.length / modules.length) * 100) : 0;
  const projected = projectedAssessment(candidate, roleId);
  const projectedOverall = overallScore(projected ?? undefined, role);
  const readyModules = modules.filter((m) => lp.completed.includes(m.id) && (!m.evidenceRequired || lp.evidence[m.id]) && !(lp.appliedBoosts ?? []).includes(m.id));
  const missingEvidence = modules.filter((m) => lp.completed.includes(m.id) && m.evidenceRequired && !lp.evidence[m.id]);
  const after = result ? roleReadiness(candidate, roleId) : null;

  return (
    <div>
      <Toaster />
      <PageHeader
        eyebrow={<span className="text-xs font-semibold uppercase tracking-wider text-primary">Level 1 · Recommended learning path</span>}
        title={`My learning path · ${role.title}`}
        description="Personalised from your assessment gaps. Complete modules, submit practical evidence, then request reassessment to unlock the next level."
        actions={
          <>
            <Select value={roleId} onValueChange={(v) => { setParams({ role: v }); setResult(null); }}>
              <SelectTrigger className="w-[200px] bg-card" aria-label="Role"><SelectValue /></SelectTrigger>
              <SelectContent>{careerRoles.map((x) => <SelectItem key={x.id} value={x.id}>{x.title}</SelectItem>)}</SelectContent>
            </Select>
            <Button asChild variant="outline" className="bg-card"><Link to={`/app/learn?role=${roleId}`}><CompassIcon /> Explore all learning</Link></Button>
          </>
        }
      />

      {r.status === "not-assessed" && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-ai/30 bg-ai-soft/60 p-4 sm:flex-row sm:items-center">
          <SparklesIcon className="h-5 w-5 shrink-0 text-ai-strong" />
          <p className="flex-1 text-sm">You haven't taken the {role.title} assessment. These modules are a general starting point — take the assessment for a plan matched to your gaps.</p>
          <Button asChild size="sm"><Link to={`/app/assessments/${roleId}/take`}>Take assessment</Link></Button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between text-sm"><span className="font-semibold">Plan progress</span><span className="text-muted-foreground">{lp.completed.length}/{modules.length} complete</span></div>
            <Progress value={progress} className="mt-2 h-2" aria-label="Plan progress" />
          </div>

          {sorted.length === 0 && <p className="rounded-xl border border-dashed bg-card p-6 text-sm text-muted-foreground">No structured modules for this role yet — browse Explore Learning for resources.</p>}

          <ol className="space-y-4">
            {sorted.map((m) => {
              const done = lp.completed.includes(m.id);
              const ev = lp.evidence[m.id];
              const counted = (lp.appliedBoosts ?? []).includes(m.id);
              const forGap = Object.keys(m.boosts).some((k) => unmetIds.has(k));
              return (
                <li key={m.id} className={cn("rounded-xl border bg-card p-5", forGap && !done && "border-primary/40")}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleModule(roleId, m.id)} aria-pressed={done} aria-label={done ? `Mark ${m.title} incomplete` : `Mark ${m.title} complete`} className="mt-0.5 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {done ? <CheckCircle2Icon className="h-6 w-6 text-success" /> : <CircleIcon className="h-6 w-6 text-muted-foreground" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{m.title}</p>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium">{m.kind}</span>
                        {forGap && <span className="rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-brown">Targets your gap</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.duration} · improves {Object.entries(m.boosts).map(([k, v]) => `${role.competencies.find((c) => c.id === k)?.label} (+${v})`).join(", ")}</p>
                      <p className="mt-2 text-sm">{m.assignment}</p>
                      {m.resources.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {m.resources.map((res) => (
                            <li key={res.url}>
                              <a href={res.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted">{res.kind}: {res.title} <ExternalLinkIcon className="h-3 w-3" /></a>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {counted ? (
                          <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Counted at reassessment</span>
                        ) : ev ? (
                          <span className="rounded-md bg-ai-soft px-2 py-0.5 text-xs font-medium text-ai-strong">Evidence submitted · awaiting reassessment</span>
                        ) : m.evidenceRequired ? (
                          <EvidenceDialog module={m} roleId={roleId} />
                        ) : (
                          <span className="text-xs text-muted-foreground">No evidence required — mark complete when done.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><FlagIcon className="h-4 w-4" /> Progression criteria</p>
            {r.status === "not-assessed" ? (
              <p className="mt-2 text-sm text-muted-foreground">Internship threshold {role.thresholds.internship}, job threshold {role.thresholds.job}. Take the assessment to see your gaps.</p>
            ) : target ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">To become {target}-eligible as a {role.title}:</p>
                <GapExplanation met={r[target].met} unmet={r[target].unmet} className="mt-3 !grid-cols-1" />
              </>
            ) : (
              <p className="mt-2 text-sm text-success">You meet job-level thresholds for {role.title}. Continue learning voluntarily any time.</p>
            )}
          </div>

          <div id="reassess" className="scroll-mt-24 rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><RefreshCwIcon className="h-4 w-4" /> Request reassessment</p>
            {r.overall !== null && projectedOverall !== null && (
              <p className="mt-2 text-sm">Current <span className="font-semibold">{r.overall}</span> → projected <span className="font-semibold text-ai-strong">{projectedOverall}</span> if your evidence is accepted.</p>
            )}
            {missingEvidence.length > 0 && <p className="mt-2 text-xs text-warning">Submit evidence for: {missingEvidence.map((m) => m.title).join(", ")}</p>}
            <Button
              className="mt-3 w-full"
              disabled={r.status === "not-assessed" || readyModules.length === 0}
              onClick={() => {
                const res = reassess(roleId);
                if (res) { setResult(res); toast("Reassessment complete", { description: `${role.title}: ${res.before} → ${res.after}` }); }
              }}
            >
              Request reassessment
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              {readyModules.length ? `${readyModules.length} module(s) with new evidence will be reviewed.` : "Complete a module and submit its evidence first."} In this prototype the review completes instantly.
            </p>
            {result && after && (
              <div className="mt-4 rounded-lg border border-success/25 bg-success-soft/60 p-3 text-sm">
                <p className="font-semibold">Reassessed: {result.before} → {result.after}</p>
                <p className="text-muted-foreground">{after.job.ok ? "You now meet the job-readiness threshold." : after.internship.ok ? "You meet the internship-readiness threshold — internship applications are unlocked for eligible listings." : "Not yet at the internship threshold. Keep going — your progress is saved."}</p>
                <div className="mt-2 flex flex-wrap gap-3 font-semibold">
                  {after.internship.ok && <Link to={`/app/internships?role=${roleId}&eligible=1`} className="text-primary hover:underline">View internships →</Link>}
                  {after.job.ok && <Link to={`/app/jobs?role=${roleId}&eligible=1`} className="text-primary hover:underline">View jobs →</Link>}
                  <Link to={`/app/assessments?role=${roleId}`} className="text-primary hover:underline">Full result →</Link>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold"><UsersIcon className="h-4 w-4" /> Optional mentor support</p>
            <p className="mt-1 text-sm text-muted-foreground">Get feedback on assignments and weekly accountability from a mentor who knows {role.title} hiring.</p>
            <Link to="/app/mentors" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Find a mentor <ArrowRightIcon className="h-3.5 w-3.5" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
