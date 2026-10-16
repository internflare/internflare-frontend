import { useReducer } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WizardStepper, FormGrid } from "@/polymet/components/wizard-stepper";
import { FileUpload } from "@/polymet/components/file-upload";
import { MetaChip } from "@/polymet/components/status-badges";
import { currentTalent } from "@/polymet/data/talent-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { careerRoles, getRole, statedGoalLabel, type StatedGoal } from "@/polymet/data/pathway-data";

const steps = [
  "Basic information",
  "Location & work preferences",
  "Education",
  "Experience & projects",
  "Skills",
  "Career goal",
  "Availability",
  "CV & portfolio links",
  "Credentials (optional)",
  "Review & finish",
];

const levels = ["Beginner", "Intermediate", "Advanced"];
const statedGoals: StatedGoal[] = ["internship", "job", "exploring"];
const isStatedGoal = (value: string): value is StatedGoal => statedGoals.some((goal) => goal === value);

type TalentProfileData = {
  first: string;
  last: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  arrangements: string[];
  school: string;
  degree: string;
  gradYear: string;
  expTitle: string;
  expOrg: string;
  expDesc: string;
  roles: string[];
  interests: string;
  availability: string;
  hours: string;
  portfolio: string;
  github: string;
  linkedin: string;
  credential: string;
};

type TalentOnboardingState = {
  step: number;
  completed: number[];
  data: TalentProfileData;
  skills: { name: string; level: string }[];
  newSkill: string;
  newRole: string;
  goal: string;
  levelGoal: StatedGoal;
  error: string;
};

type TalentOnboardingAction =
  | { type: "set-step"; step: number }
  | { type: "advance-step"; lastStep: number }
  | { type: "complete-step"; step: number }
  | { type: "complete-all-steps"; steps: number[] }
  | { type: "set-data"; data: TalentProfileData }
  | { type: "set-skills"; skills: { name: string; level: string }[] }
  | { type: "set-skill-level"; index: number; level: string }
  | { type: "remove-skill"; index: number }
  | { type: "set-new-skill"; value: string }
  | { type: "set-new-role"; value: string }
  | { type: "set-goal"; goal: string }
  | { type: "set-level-goal"; levelGoal: StatedGoal }
  | { type: "set-error"; error: string };

function talentOnboardingReducer(state: TalentOnboardingState, action: TalentOnboardingAction): TalentOnboardingState {
  switch (action.type) {
    case "set-step":
      return { ...state, step: action.step };
    case "advance-step":
      return { ...state, step: Math.min(state.step + 1, action.lastStep) };
    case "complete-step":
      return { ...state, completed: state.completed.includes(action.step) ? state.completed : [...state.completed, action.step] };
    case "complete-all-steps":
      return { ...state, completed: action.steps };
    case "set-data":
      return { ...state, data: action.data };
    case "set-skills":
      return { ...state, skills: action.skills };
    case "set-skill-level":
      return { ...state, skills: state.skills.map((skill, index) => index === action.index ? { ...skill, level: action.level } : skill) };
    case "remove-skill":
      return { ...state, skills: state.skills.filter((_, index) => index !== action.index) };
    case "set-new-skill":
      return { ...state, newSkill: action.value };
    case "set-new-role":
      return { ...state, newRole: action.value };
    case "set-goal":
      return { ...state, goal: action.goal };
    case "set-level-goal":
      return { ...state, levelGoal: action.levelGoal };
    case "set-error":
      return { ...state, error: action.error };
  }
}

function F({ id, label, children, optional }: { id: string; label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}</Label>
      {children}
    </div>
  );
}

export function TalentOnboardingPage() {
 const { candidate: who } = usePathway();
  const isNew = who.id === "new";
  const { candidate, setTargetRole, setStatedGoal } = usePathway();
  const [state, dispatch] = useReducer(talentOnboardingReducer, {
    step: 0,
    completed: [],
    data: {
      first: isNew ? "" : "Amara", last: isNew ? "" : "Okafor", phone: isNew ? "" : "+234 801 234 5678", email: isNew ? "" : currentTalent.email,
      country: "Nigeria", city: "Lagos", arrangements: ["remote", "hybrid"],
      school: "University of Lagos", degree: "B.Sc. Computer Science", gradYear: "2024",
      expTitle: isNew ? "" : "Freelance Frontend Developer", expOrg: isNew ? "" : "Brightwave Studio", expDesc: isNew ? "" : "Accessibility audit and fixes for a client dashboard.",
      roles: ["Frontend Developer"], interests: "Fintech, Healthtech",
      availability: "June 2025", hours: "full-time",
      portfolio: isNew ? "" : "https://amara.dev", github: isNew ? "" : "https://github.com/amara", linkedin: "",
      credential: "",
    },
    skills: isNew ? [] : [{ name: "React", level: "Advanced" }, { name: "TypeScript", level: "Intermediate" }, { name: "Accessibility", level: "Intermediate" }],
    newSkill: "",
    newRole: "",
    goal: candidate.targetRoleId ?? "frontend-developer",
    levelGoal: candidate.statedGoal,
    error: "",
  });
  const { step, completed, data, skills, newSkill, newRole, goal, levelGoal, error } = state;
  const goalRole = getRole(goal);

  const up = (k: Exclude<keyof TalentProfileData, "arrangements" | "roles">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => dispatch({ type: "set-data", data: { ...data, [k]: e.target.value } });

  const validate = () => {
    if (step === 0 && (!data.first.trim() || !data.last.trim() || !data.email.includes("@"))) return "Enter your name and a valid email.";
    if (step === 1 && data.arrangements.length === 0) return "Choose at least one work arrangement.";
    if (step === 4 && skills.length === 0) return "Add at least one skill.";
    if (step === 5 && data.roles.length === 0) return "Add at least one target role.";
    return "";
  };

  const next = () => {
    const err = validate();
    dispatch({ type: "set-error", error: err });
    if (err) return;
    dispatch({ type: "complete-step", step });
    dispatch({ type: "advance-step", lastStep: steps.length - 1 });
  };

  const finished = completed.length >= steps.length;

  if (finished) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <CheckCircle2Icon className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Your account is ready</h1>
        <p className="mt-2 text-muted-foreground">
          Your career goal is <span className="font-semibold text-foreground">{goalRole?.title}</span>. Applications open once you complete the {goalRole?.title} assessment and meet each listing's threshold — your profile alone doesn't unlock them. You can explore learning any time.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild><Link to={`/app/assessments/${goal}/take`}>Take {goalRole?.title} assessment</Link></Button>
          <Button asChild variant="outline" className="bg-card"><Link to={`/app/learn?role=${goal}`}>Explore Learn</Link></Button>
          <Button asChild variant="ghost"><Link to="/app">Go to dashboard</Link></Button>
        </div>
      </div>
    );
  }

  const toggleArr = (v: string) => dispatch({ type: "set-data", data: { ...data, arrangements: data.arrangements.includes(v) ? data.arrangements.filter((x) => x !== v) : [...data.arrangements, v] } });

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <WizardStepper steps={steps} current={step} completed={completed} onStepClick={(nextStep) => dispatch({ type: "set-step", step: nextStep })} title="Profile setup" />
      </aside>
      <section className="rounded-2xl border bg-card">
        <div className="border-b p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {step + 1} of {steps.length}</p>
          <h1 className="mt-1 text-xl font-bold">{steps[step]}</h1>
        </div>
        <div className="space-y-5 p-6">
          {step === 0 && (
            <FormGrid>
              <F id="ob-first" label="First name"><Input id="ob-first" value={data.first} onChange={up("first")} /></F>
              <F id="ob-last" label="Last name"><Input id="ob-last" value={data.last} onChange={up("last")} /></F>
              <F id="ob-email" label="Email"><Input id="ob-email" type="email" value={data.email} onChange={up("email")} /></F>
              <F id="ob-phone" label="Phone" optional><Input id="ob-phone" value={data.phone} onChange={up("phone")} /></F>
            </FormGrid>
          )}
          {step === 1 && (
            <>
              <FormGrid>
                <F id="ob-country" label="Country">
                  <Select value={data.country} onValueChange={(v) => dispatch({ type: "set-data", data: { ...data, country: v } })}>
                    <SelectTrigger id="ob-country"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Nigeria", "Ghana", "Kenya", "South Africa", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </F>
                <F id="ob-city" label="City"><Input id="ob-city" value={data.city} onChange={up("city")} /></F>
              </FormGrid>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Preferred work arrangements</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {["remote", "hybrid", "onsite"].map((a) => (
                    <Label key={a} htmlFor={`arr-${a}`} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border p-3 font-normal capitalize", data.arrangements.includes(a) && "border-primary bg-accent/50")}>
                      <Checkbox id={`arr-${a}`} checked={data.arrangements.includes(a)} onCheckedChange={() => toggleArr(a)} /> {a}
                    </Label>
                  ))}
                </div>
              </fieldset>
            </>
          )}
          {step === 2 && (
            <FormGrid>
              <F id="ob-school" label="Institution"><Input id="ob-school" value={data.school} onChange={up("school")} /></F>
              <F id="ob-degree" label="Qualification"><Input id="ob-degree" value={data.degree} onChange={up("degree")} /></F>
              <F id="ob-grad" label="Graduation year"><Input id="ob-grad" value={data.gradYear} onChange={up("gradYear")} /></F>
              <p className="self-end text-xs text-muted-foreground">Qualification verification is requested separately from your profile settings.</p>
            </FormGrid>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <FormGrid>
                <F id="ob-exp-title" label="Role or project title"><Input id="ob-exp-title" value={data.expTitle} onChange={up("expTitle")} /></F>
                <F id="ob-exp-org" label="Organisation or context"><Input id="ob-exp-org" value={data.expOrg} onChange={up("expOrg")} /></F>
              </FormGrid>
              <F id="ob-exp-desc" label="What you did and the outcome"><Textarea id="ob-exp-desc" rows={4} value={data.expDesc} onChange={up("expDesc")} /></F>
              <Button variant="outline" size="sm" className="bg-card" onClick={() => toast("Another experience entry can be added from your profile editor.")}><PlusIcon /> Add another</Button>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              {skills.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 rounded-lg border p-2.5 pl-3.5">
                  <span className="flex-1 text-sm font-medium">{s.name}</span>
                  <Select value={s.level} onValueChange={(v) => dispatch({ type: "set-skill-level", index: i, level: v })}>
                    <SelectTrigger className="h-8 w-36" aria-label={`${s.name} level`}><SelectValue /></SelectTrigger>
                    <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Remove ${s.name}`} onClick={() => dispatch({ type: "remove-skill", index: i })}><XIcon /></Button>
                </div>
              ))}
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newSkill.trim() && !skills.some((s) => s.name === newSkill.trim())) { dispatch({ type: "set-skills", skills: [...skills, { name: newSkill.trim(), level: "Beginner" }] }); dispatch({ type: "set-new-skill", value: "" }); } }}>
                <Input value={newSkill} onChange={(e) => dispatch({ type: "set-new-skill", value: e.target.value })} placeholder="Add a skill, e.g. Git" aria-label="New skill" />
                <Button type="submit" variant="outline" className="bg-card"><PlusIcon /> Add</Button>
              </form>
              <p className="text-xs text-muted-foreground">Skill levels are self-reported until confirmed by an assessment or employer.</p>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Primary career goal</Label>
                <p className="text-xs text-muted-foreground">We'll assess you against this role's competencies. You can assess other roles later.</p>
                <RadioGroup value={goal} onValueChange={(value) => dispatch({ type: "set-goal", goal: value })} className="mt-3 grid gap-2 sm:grid-cols-2">
                  {careerRoles.map((r) => (
                    <Label key={r.id} htmlFor={`goal-${r.id}`} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                      <RadioGroupItem value={r.id} id={`goal-${r.id}`} className="mt-0.5" />
                      <span><span className="block text-sm font-medium">{r.title}</span><span className="text-xs text-muted-foreground">{r.family} · internship {r.thresholds.internship} / job {r.thresholds.job}</span></span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-medium">What are you aiming for?</Label>
                <RadioGroup value={levelGoal} onValueChange={(v) => { if (isStatedGoal(v)) dispatch({ type: "set-level-goal", levelGoal: v }); }} className="mt-3 grid gap-2 sm:grid-cols-3">
                  {statedGoals.map((g) => (
                    <Label key={g} htmlFor={`lvl-${g}`} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                      <RadioGroupItem value={g} id={`lvl-${g}`} />
                      {statedGoalLabel[g]}
                    </Label>
                  ))}
                </RadioGroup>
                <p className="mt-2 rounded-lg bg-ai-soft px-3 py-2 text-xs text-ai-strong">Your goal guides recommendations. Your first assessment measures what you can currently demonstrate — that evidence decides whether you're routed to learning, internships or the internflareJobs pool.</p>
              </div>
              <p className="text-sm font-medium">Other roles you're open to</p>
              <div className="flex flex-wrap gap-2">
                {data.roles.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1 rounded-md border bg-accent px-2.5 py-1 text-sm font-medium text-brown">
                    {r}
                    <button onClick={() => dispatch({ type: "set-data", data: { ...data, roles: data.roles.filter((x) => x !== r) } })} aria-label={`Remove ${r}`}><XIcon className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (newRole.trim()) { dispatch({ type: "set-data", data: { ...data, roles: [...data.roles, newRole.trim()] } }); dispatch({ type: "set-new-role", value: "" }); } }}>
                <Input value={newRole} onChange={(e) => dispatch({ type: "set-new-role", value: e.target.value })} placeholder="e.g. Product Designer" aria-label="New target role" />
                <Button type="submit" variant="outline" className="bg-card"><PlusIcon /> Add</Button>
              </form>
              <F id="ob-interests" label="Industries you're interested in"><Input id="ob-interests" value={data.interests} onChange={up("interests")} /></F>
            </div>
          )}
          {step === 6 && (
            <FormGrid>
              <F id="ob-avail" label="Available from"><Input id="ob-avail" value={data.availability} onChange={up("availability")} /></F>
              <F id="ob-hours" label="Commitment">
                <Select value={data.hours} onValueChange={(v) => dispatch({ type: "set-data", data: { ...data, hours: v } })}>
                  <SelectTrigger id="ob-hours"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="project">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </F>
            </FormGrid>
          )}
          {step === 7 && (
            <div className="space-y-4">
              <FileUpload label="Upload CV" initial={[{ name: "Amara_Okafor_Frontend.pdf", size: "0.4 MB" }]} />
              <FormGrid>
                <F id="ob-portfolio" label="Portfolio website" optional><Input id="ob-portfolio" value={data.portfolio} onChange={up("portfolio")} /></F>
                <F id="ob-github" label="GitHub" optional><Input id="ob-github" value={data.github} onChange={up("github")} /></F>
                <F id="ob-linkedin" label="LinkedIn" optional><Input id="ob-linkedin" value={data.linkedin} onChange={up("linkedin")} placeholder="https://linkedin.com/in/…" /></F>
              </FormGrid>
            </div>
          )}
          {step === 8 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Add certificates or work evidence. Identity, qualification, employment and work-evidence verification are reviewed separately — uploading does not mark anything as verified.</p>
              <F id="ob-cred" label="Credential or evidence description" optional><Input id="ob-cred" value={data.credential} onChange={up("credential")} placeholder="e.g. Google UX Design Certificate" /></F>
              <FileUpload label="Supporting documents" accept=".pdf,.png,.jpg" hint="PDF, PNG or JPG · max 5 MB" />
            </div>
          )}
          {step === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                <Avatar className="h-14 w-14"><AvatarImage src={currentTalent.avatar} alt="" /><AvatarFallback>AO</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold">{data.first} {data.last}</p>
                  <p className="text-sm text-muted-foreground">Goal: {goalRole?.title} · {data.roles.join(", ")} · {data.city}, {data.country}</p>
                </div>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Work arrangements", data.arrangements.join(", ")],
                  ["Education", `${data.degree}, ${data.school} (${data.gradYear})`],
                  ["Experience", `${data.expTitle} · ${data.expOrg}`],
                  ["Availability", `${data.availability} · ${data.hours}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium capitalize">{v}</dd></div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-1.5">{skills.map((s) => <MetaChip key={s.name}>{s.name} · {s.level}</MetaChip>)}</div>
              <div className="rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">
                <p className="font-medium">To reach 100% later</p>
                <ul className="mt-1 list-inside list-disc text-muted-foreground">
                  {!data.linkedin && <li>Add your LinkedIn profile</li>}
                  <li>Add a second experience or project</li>
                  <li>Request qualification verification</li>
                </ul>
              </div>
            </div>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t p-4 sm:px-6">
          <Button variant="ghost" disabled={step === 0} onClick={() => dispatch({ type: "set-step", step: step - 1 })}><ArrowLeftIcon /> Back</Button>
          <Button variant="outline" className="ml-auto bg-card" onClick={() => toast("Progress saved", { description: "You can resume from this step any time." })}><SaveIcon /> Save</Button>
          {step === steps.length - 1 ? (
            <Button onClick={() => { setTargetRole(goal); setStatedGoal(levelGoal); dispatch({ type: "complete-all-steps", steps: steps.map((_, i) => i) }); }}>Create account & continue</Button>
          ) : (
            <Button onClick={next}>{step === 8 ? "Skip or continue" : "Continue"} <ArrowRightIcon /></Button>
          )}
        </div>
      </section>
    </div>
  );
}
