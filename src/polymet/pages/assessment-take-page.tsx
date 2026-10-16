import { useEffect, useReducer } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, BriefcaseIcon, CheckCircle2Icon, ClockIcon, GraduationCapIcon, LinkIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StateBlock } from "@/polymet/components/page-states";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { CompetencyTable, GapExplanation, GoalVsEvidence, NextActionsList } from "@/polymet/components/pathway/pathway-ui";
import { QuestionView, isAnswered } from "@/polymet/components/assessment/question-view";
import { AiReportPanel, LevelPicker } from "@/polymet/components/assessment/ai-assessment-ui";
import { ScoringRulesCard } from "@/polymet/pages/assessments-page";
import { careerRoles, getLevel, getRole, type ExpertiseLevel } from "@/polymet/data/pathway-data";
import type { QuestionResponse } from "@/polymet/data/ai-bank-types";
import { getOpportunity } from "@/polymet/data/opportunities-data";
import { eligibilityFor, nextActions, recommendedFor, roleReadiness } from "@/polymet/lib/pathway-engine";
import { buildReport, generateAssessment, hasBank, kindLabel, sleep, type EvidenceInput, type GeneratedAssessment } from "@/polymet/lib/ai-assessment";

type Phase = "setup" | "generating" | "interview" | "evidence" | "review" | "grading" | "done";
const steps = ["Role & level", "AI interview", "Work evidence", "Review & submit"];
const stepIndex: Record<Phase, number> = { setup: 0, generating: 0, interview: 1, evidence: 2, review: 3, grading: 3, done: 3 };
const genStages = ["Reading role competencies", "Calibrating difficulty to your level", "Selecting production scenarios and code tasks", "Preparing grading rubrics"];
const gradeStages = ["Checking code against task requirements", "Scoring answers against rubrics", "Applying level ceiling and evidence", "Writing your feedback report"];
const LEVELS: ExpertiseLevel[] = ["intern", "junior", "mid", "senior"];
const isExpertiseLevel = (value: string | null): value is ExpertiseLevel => value !== null && LEVELS.some((level) => level === value);

type AssessmentState = {
  level: ExpertiseLevel;
  phase: Phase;
  stage: number;
  gen: GeneratedAssessment | null;
  current: number;
  responses: Record<string, QuestionResponse>;
  evidence: Record<string, EvidenceInput>;
  startedAt: number | null;
  now: number;
};

type AssessmentAction =
  | { type: "set-level"; level: ExpertiseLevel }
  | { type: "set-phase"; phase: Phase }
  | { type: "set-stage"; stage: number }
  | { type: "set-generation"; generation: GeneratedAssessment }
  | { type: "reset-responses" }
  | { type: "set-response"; id: string; response: QuestionResponse }
  | { type: "set-evidence-link"; id: string; value: string }
  | { type: "set-evidence-note"; id: string; value: string }
  | { type: "set-current"; current: number }
  | { type: "move-current"; amount: number }
  | { type: "set-started-at"; startedAt: number }
  | { type: "set-now"; now: number };

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case "set-level":
      return { ...state, level: action.level };
    case "set-phase":
      return { ...state, phase: action.phase };
    case "set-stage":
      return { ...state, stage: action.stage };
    case "set-generation":
      return { ...state, gen: action.generation };
    case "reset-responses":
      return { ...state, responses: {} };
    case "set-response":
      return { ...state, responses: { ...state.responses, [action.id]: action.response } };
    case "set-evidence-link":
      return { ...state, evidence: { ...state.evidence, [action.id]: { ...state.evidence[action.id], link: action.value } } };
    case "set-evidence-note":
      return { ...state, evidence: { ...state.evidence, [action.id]: { ...state.evidence[action.id], note: action.value } } };
    case "set-current":
      return { ...state, current: action.current };
    case "move-current":
      return { ...state, current: state.current + action.amount };
    case "set-started-at":
      return { ...state, startedAt: action.startedAt };
    case "set-now":
      return { ...state, now: action.now };
  }
}

export function AssessmentTakePage() {
  const { roleId = "" } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fromOpp = params.get("from");
  const role = getRole(roleId);
  const { candidate, recordAssessment } = usePathway();
  const prev = candidate.assessments[roleId];
  const paramLevel = params.get("level");
  const [state, dispatch] = useReducer(assessmentReducer, {
    level: isExpertiseLevel(paramLevel) ? paramLevel : prev?.level ?? "junior",
    phase: "setup",
    stage: 0,
    gen: null,
    current: 0,
    responses: {},
    evidence: {},
    startedAt: null,
    now: Date.now(),
  });
  const { level, phase, stage, gen, current, responses, evidence, startedAt, now } = state;

  useEffect(() => {
    if (!startedAt || phase === "done") return;
    const t = setInterval(() => dispatch({ type: "set-now", now: Date.now() }), 1000);
    return () => clearInterval(t);
  }, [startedAt, phase]);

  if (!role) return <StateBlock kind="no-results" title="Assessment not found" description="This role assessment isn't configured yet." action={{ label: "All assessments", to: "/app/assessments" }} />;
  if (!hasBank(role.id)) return <StateBlock kind="empty" title="AI assessment coming soon" description={`We're still calibrating ${role.title} questions.`} action={{ label: "All assessments", to: "/app/assessments" }} />;
  if (phase === "done") return <AssessmentResult roleId={role.id} fromOpp={fromOpp} />;

  const lvl = getLevel(level);
  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0;
  const clock = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  const questions = gen?.questions ?? [];
  const answered = questions.filter((q) => isAnswered(q, responses[q.id])).length;
  const q = questions[current];

  const start = async () => {
    dispatch({ type: "set-phase", phase: "generating" });
    for (let i = 0; i < genStages.length; i++) { dispatch({ type: "set-stage", stage: i }); await sleep(650); }
    const g = generateAssessment(role.id, level, Date.now() % 997);
    dispatch({ type: "set-generation", generation: g });
    dispatch({ type: "reset-responses" });
    dispatch({ type: "set-current", current: 0 });
    dispatch({ type: "set-started-at", startedAt: Date.now() });
    dispatch({ type: "set-now", now: Date.now() });
    dispatch({ type: "set-phase", phase: "interview" });
    window.scrollTo(0, 0);
  };

  const submit = async () => {
    if (!gen) return;
    dispatch({ type: "set-phase", phase: "grading" });
    for (let i = 0; i < gradeStages.length; i++) { dispatch({ type: "set-stage", stage: i }); await sleep(700); }
    const { scores, report } = buildReport(gen, responses, evidence, Math.max(1, Math.round(elapsed / 60)));
    recordAssessment(role.id, scores, { level, report });
    dispatch({ type: "set-phase", phase: "done" });
    window.scrollTo(0, 0);
  };

  const busy = phase === "generating" || phase === "grading";
  const stages = phase === "grading" ? gradeStages : genStages;

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/assessments" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeftIcon className="h-4 w-4" /> Assessments</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ai-strong"><SparklesIcon className="h-3.5 w-3.5" /> AI skills interview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{phase === "setup" ? role.title : `${lvl.label} ${role.title}`} assessment</h1>
          {prev && <p className="mt-1 text-sm text-muted-foreground">Reassessment · previous result {prev.history.at(-1)?.overall}{prev.level ? ` at ${getLevel(prev.level).label}` : ""} on {prev.assessedOn}</p>}
        </div>
        {startedAt && !busy && <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-sm tabular-nums"><ClockIcon className="h-4 w-4 text-muted-foreground" />{clock} <span className="text-muted-foreground">/ ~{gen?.totalMins} min</span></span>}
      </div>

      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Assessment steps">
        {steps.map((s, i) => (
          <li key={s}>
            <div className={cn("h-1.5 rounded-full", i <= stepIndex[phase] ? "bg-primary" : "bg-muted")} />
            <p className={cn("mt-1.5 hidden text-xs sm:block", i === stepIndex[phase] ? "font-semibold" : "text-muted-foreground")}>{s}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border bg-card p-5 sm:p-7">
        {busy && (
          <div className="mx-auto max-w-md py-10 text-center" role="status" aria-live="polite">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ai-soft text-ai-strong"><SparklesIcon className="h-6 w-6 animate-pulse" /></span>
            <h2 className="mt-4 text-lg font-semibold">{phase === "grading" ? "Grading your interview" : `Generating your ${lvl.label} ${role.title} interview`}</h2>
            <ul className="mt-5 space-y-2 text-left">
              {stages.map((s, i) => (
                <li key={s} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", i > stage && "text-muted-foreground")}>
                  {i < stage ? <CheckCircle2Icon className="h-4 w-4 text-success" /> : i === stage ? <Loader2Icon className="h-4 w-4 animate-spin text-ai-strong" /> : <span className="h-4 w-4 rounded-full border" />}
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase === "setup" && (
          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Role</h2>
                <Select value={role.id} onValueChange={(v) => navigate(`/app/assessments/${v}/take${fromOpp ? `?from=${fromOpp}` : ""}`)}>
                  <SelectTrigger className="mt-2 max-w-sm" aria-label="Role"><SelectValue /></SelectTrigger>
                  <SelectContent>{careerRoles.filter((r) => hasBank(r.id)).map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Your expertise level</h2>
                <p className="mt-1 text-sm text-muted-foreground">The AI pitches production-level questions at this level. Harder levels can prove more, but are graded more strictly — your evidence decides where you land.</p>
                <div className="mt-3"><LevelPicker value={level} onChange={(v) => dispatch({ type: "set-level", level: v })} roleTitle={role.title} /></div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                <p className="font-semibold">What to expect</p>
                <ul className="mt-2 grid gap-1.5 text-muted-foreground sm:grid-cols-2">
                  <li>· One question per competency ({role.competencies.length} total)</li>
                  <li>· Real production scenarios at {lvl.label} level</li>
                  <li>· {["frontend-developer", "backend-engineer", "data-analyst"].includes(role.id) ? "Code-snippet reviews and a coding task" : "Practical tasks using real-world material"}</li>
                  <li>· Rubric-based feedback on every answer</li>
                </ul>
              </div>
              {fromOpp && <p className="rounded-lg bg-accent px-3 py-2 text-sm">You started from <span className="font-semibold">{getOpportunity(fromOpp)?.title}</span>. We'll bring you back there with your result.</p>}
              <p className="text-xs text-muted-foreground">Prototype: question generation and grading are simulated locally against published rubrics.</p>
            </div>
            <ScoringRulesCard internship={role.thresholds.internship} job={role.thresholds.job} />
          </div>
        )}

        {phase === "interview" && q && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Questions">
              {questions.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Question ${i + 1}: ${kindLabel[x.kind]}${isAnswered(x, responses[x.id]) ? " (answered)" : ""}`}
                  onClick={() => dispatch({ type: "set-current", current: i })}
                  className={cn("h-8 min-w-8 rounded-md border px-2 text-xs font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === current ? "border-primary bg-primary text-primary-foreground" : isAnswered(x, responses[x.id]) ? "bg-success-soft text-success" : "hover:bg-muted")}
                >
                  {i + 1}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">{answered}/{questions.length} answered</span>
            </div>
            <Progress value={(answered / questions.length) * 100} className="mb-6 h-1" />
            <QuestionView
              key={q.id}
              q={q}
              index={current}
              total={questions.length}
              competency={role.competencies.find((c) => c.id === q.competencyId)?.label ?? ""}
              response={responses[q.id] ?? {}}
              onChange={(r) => dispatch({ type: "set-response", id: q.id, response: r })}
            />
          </div>
        )}

        {phase === "evidence" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Work evidence (optional)</h2>
              <p className="text-sm text-muted-foreground">Links to real work (repos, case studies, dashboards) add up to 10 points per competency; descriptions add 4 — always capped at the {lvl.label} ceiling of {lvl.ceiling}.</p>
            </div>
            {role.competencies.map((c) => (
              <div key={c.id} className="grid gap-2 rounded-xl border p-4 sm:grid-cols-2">
                <p className="text-sm font-medium sm:col-span-2">{c.label}</p>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={evidence[c.id]?.link ?? ""} onChange={(e) => dispatch({ type: "set-evidence-link", id: c.id, value: e.target.value })} placeholder="https://… link to relevant work" className="pl-9" aria-label={`${c.label} evidence link`} />
                </div>
                <Textarea value={evidence[c.id]?.note ?? ""} onChange={(e) => dispatch({ type: "set-evidence-note", id: c.id, value: e.target.value })} rows={1} placeholder="Or briefly describe what you did" aria-label={`${c.label} description`} />
              </div>
            ))}
          </div>
        )}

        {phase === "review" && gen && (
          <div>
            <h2 className="text-lg font-semibold">Review & submit</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {gen.questions.map((x, i) => (
                <li key={x.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <span className="min-w-0"><span className="font-medium">{i + 1}. {x.title}</span><span className="block text-xs text-muted-foreground">{kindLabel[x.kind]}</span></span>
                  {isAnswered(x, responses[x.id]) ? <span className="shrink-0 rounded-md bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">Answered</span> : <button onClick={() => { dispatch({ type: "set-current", current: i }); dispatch({ type: "set-phase", phase: "interview" }); }} className="shrink-0 rounded-md bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning hover:underline">Unanswered — go to question</button>}
                </li>
              ))}
              <li className="flex justify-between rounded-lg border p-3"><span>Evidence links provided</span><span className="font-semibold">{Object.values(evidence).filter((e) => e.link?.trim()).length}</span></li>
            </ul>
            {answered < gen.questions.length && <p className="mt-3 text-sm text-warning">Unanswered questions score 0.</p>}
            <p className="mt-4 text-xs text-muted-foreground">Your answers are graded against the rubrics for {lvl.label} {role.title}. You'll see what you covered and missed for every question.</p>
          </div>
        )}

        {!busy && (
          <div className="mt-7 flex justify-between gap-2 border-t pt-5">
            <Button
              variant="outline"
              className="bg-card"
              disabled={phase === "setup"}
              onClick={() => {
                if (phase === "interview") { if (current > 0) dispatch({ type: "move-current", amount: -1 }); else dispatch({ type: "set-phase", phase: "setup" }); }
                else if (phase === "evidence") { dispatch({ type: "set-phase", phase: "interview" }); dispatch({ type: "set-current", current: questions.length - 1 }); }
                else if (phase === "review") dispatch({ type: "set-phase", phase: "evidence" });
              }}
            >
              <ArrowLeftIcon /> Back
            </Button>
            {phase === "setup" && <Button onClick={start}><SparklesIcon /> Generate {lvl.label} interview</Button>}
            {phase === "interview" && (current < questions.length - 1
              ? <Button onClick={() => dispatch({ type: "move-current", amount: 1 })}>Next question <ArrowRightIcon /></Button>
              : <Button onClick={() => dispatch({ type: "set-phase", phase: "evidence" })}>Finish interview <ArrowRightIcon /></Button>)}
            {phase === "evidence" && <Button onClick={() => dispatch({ type: "set-phase", phase: "review" })}>Continue <ArrowRightIcon /></Button>}
            {phase === "review" && <Button onClick={submit}><CheckCircle2Icon /> Submit for AI grading</Button>}
          </div>
        )}
      </div>
    </div>
  );
}

function AssessmentResult({ roleId, fromOpp }: { roleId: string; fromOpp: string | null }) {
  const { candidate } = usePathway();
  const r = roleReadiness(candidate, roleId)!;
  const internships = recommendedFor(candidate, "internship").filter((x) => x.e.role?.id === roleId);
  const jobs = recommendedFor(candidate, "job").filter((x) => x.e.role?.id === roleId);
  const from = fromOpp ? getOpportunity(fromOpp) : undefined;
  const fromE = fromOpp ? eligibilityFor(candidate, fromOpp) : undefined;

  const outcome =
    r.status === "job"
      ? { Icon: BriefcaseIcon, tone: "bg-success-soft text-success", title: "Your current skills match job-level roles", body: `Readiness ${r.overall} meets the ${r.role.title} job threshold (${r.job.threshold}). You can apply to suitable jobs now — no internship required.`, cta: { label: `View ${jobs.length} matching jobs`, to: `/app/jobs?role=${roleId}&eligible=1` }, alt: { label: "Explore learning anyway", to: `/app/learn?role=${roleId}` } }
      : r.status === "internship"
        ? { Icon: GraduationCapIcon, tone: "bg-success-soft text-success", title: "You may qualify for internships", body: `Readiness ${r.overall} meets the internship threshold (${r.internship.threshold}) but not yet the job threshold (${r.job.threshold}). We've prepared a job-readiness plan.`, cta: { label: `View ${internships.length} suitable internships`, to: `/app/internships?role=${roleId}&eligible=1` }, alt: { label: "Job-readiness plan", to: `/app/learning?role=${roleId}` } }
        : { Icon: BookOpenIcon, tone: "bg-warning-soft text-warning", title: "A learning pathway is the right next step", body: `Readiness ${r.overall} is below the internship threshold (${r.internship.threshold}). This isn't permanent — complete the recommended learning, submit evidence and request reassessment.`, cta: { label: "Start recommended learning", to: `/app/learning?role=${roleId}` }, alt: { label: "Find a mentor (optional)", to: "/app/mentors" } };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", outcome.tone)}><outcome.Icon className="h-6 w-6" /></span>
        <p className="mt-4 text-sm text-muted-foreground">{r.assessment?.level ? `${getLevel(r.assessment.level).label} ` : ""}{r.role.title} · AI-graded result {r.overall}/100 · {r.assessment?.assessedOn}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{outcome.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{outcome.body}</p>
        <GoalVsEvidence goal={candidate.statedGoal} readiness={r} className="mt-5 bg-background" />
        <div className="mt-5 flex flex-wrap gap-2">
          {from && fromE && (
            <Button asChild variant={fromE.state === "eligible" ? "default" : "outline"} className={fromE.state === "eligible" ? "" : "bg-card"}>
              <Link to={`/app/${fromE.requirement?.level === "internship" ? "internships" : "jobs"}?selected=${from.id}`}>{fromE.state === "eligible" ? `Continue to apply: ${from.title}` : `Back to ${from.title}`}</Link>
            </Button>
          )}
          <Button asChild><Link to={outcome.cta.to}>{outcome.cta.label}</Link></Button>
          <Button asChild variant="outline" className="bg-card"><Link to={outcome.alt.to}>{outcome.alt.label}</Link></Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {(["internship", "job"] as const).map((lvl) => (
          <div key={lvl} className="rounded-xl border bg-card p-5">
            <p className="font-semibold capitalize">{lvl} eligibility · {r[lvl].ok ? "met" : "not met yet"}</p>
            <GapExplanation met={r[lvl].met} unmet={r[lvl].unmet} className="mt-3" />
          </div>
        ))}
      </div>

      {r.assessment?.report && <div className="mt-6"><AiReportPanel report={r.assessment.report} role={r.role} /></div>}
      <div className="mt-6">{r.assessment && <CompetencyTable role={r.role} assessment={r.assessment} />}</div>

      <h2 className="mt-8 text-lg font-semibold">Recommended next actions</h2>
      <NextActionsList actions={nextActions({ ...candidate, targetRoleId: roleId })} className="mt-3" />
    </div>
  );
}
