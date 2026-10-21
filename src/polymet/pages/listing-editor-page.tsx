import { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircleIcon, CheckCircle2Icon, ChevronLeftIcon, Loader2Icon, PlusIcon, SparklesIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiLabel } from "@/polymet/components/status-badges";
import { planUsage } from "@/polymet/data/employer-data";
import profileService from "@/service/user.service";
import { ApiRequestError } from "@/service/api";
import jobService, { type OpportunityDetail } from "@/service/job.service";

type Form = {
  title: string; type: string; level: string; arrangement: string; country: string; location: string; duration: string; startDate: string; deadline: string; openings: string;
  description: string; responsibilities: string[]; requirements: string[]; skills: string[];
  paid: "paid" | "unpaid" | ""; currency: string; min: string; max: string; frequency: string;
  applyMethod: "internflare" | "external"; externalUrl: string; instructions: string;
};

const blank: Form = {
  title: "", type: "internship", level: "Entry", arrangement: "hybrid", country: "Nigeria", location: "", duration: "", startDate: "", deadline: "", openings: "1",
  description: "", responsibilities: [""], requirements: [""], skills: [],
  paid: "", currency: "NGN", min: "", max: "", frequency: "month", applyMethod: "internflare", externalUrl: "", instructions: "",
};

const isPaidChoice = (value: string): value is Form["paid"] => value === "" || value === "paid" || value === "unpaid";
const isApplyMethod = (value: string): value is Form["applyMethod"] => value === "internflare" || value === "external";

type ListingEditorState = {
  form: Form;
  skill: string;
  errors: string[];
  ai: { state: "idle" | "loading" | "ready"; text: string };
  aiApproved: boolean;
  submissionStatus: "draft" | "published" | null;
  companies: Array<{ id: string; name: string }>;
  companyId: string;
  submitting: boolean;
  loadedTitle: string;
  loadingExisting: boolean;
  loadError: string;
}

type ListingEditorAction =
  | { type: "existing-loaded"; form: Form; title: string }
  | { type: "existing-failed"; error: string }
  | { type: "set-form"; form: Form }
  | { type: "set-skill"; skill: string }
  | { type: "set-errors"; errors: string[] }
  | { type: "set-ai"; ai: ListingEditorState["ai"] }
  | { type: "set-ai-approved"; approved: boolean }
  | { type: "set-submission-status"; status: ListingEditorState["submissionStatus"] }
  | { type: "set-companies"; companies: ListingEditorState["companies"] }
  | { type: "set-company-id"; companyId: string }
  | { type: "set-submitting"; submitting: boolean };

function listingEditorReducer(state: ListingEditorState, action: ListingEditorAction): ListingEditorState {
  switch (action.type) {
    case "existing-loaded":
      return { ...state, form: action.form, loadedTitle: action.title, loadingExisting: false, loadError: "" };
    case "existing-failed":
      return { ...state, loadingExisting: false, loadError: action.error };
    case "set-form":
      return { ...state, form: action.form };
    case "set-skill":
      return { ...state, skill: action.skill };
    case "set-errors":
      return { ...state, errors: action.errors };
    case "set-ai":
      return { ...state, ai: action.ai };
    case "set-ai-approved":
      return { ...state, aiApproved: action.approved };
    case "set-submission-status":
      return { ...state, submissionStatus: action.status };
    case "set-companies":
      return { ...state, companies: action.companies };
    case "set-company-id":
      return { ...state, companyId: action.companyId };
    case "set-submitting":
      return { ...state, submitting: action.submitting };
  }
}

function Section({ title, children, desc }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="font-semibold">{title}</h2>
      {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ListInput({ label, items, onChange, id }: { label: string; items: string[]; onChange: (v: string[]) => void; id: string }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label} *</legend>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={`${id}-${i}`} className="flex gap-2">
            <Input value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`${label} ${i + 1}`} />
            {items.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${label} ${i + 1}`}><XIcon /></Button>}
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-1" onClick={() => onChange([...items, ""])}><PlusIcon /> Add</Button>
    </fieldset>
  );
}

const countryNames: Record<string, string> = { NG: "Nigeria", GH: "Ghana", KE: "Kenya", ZA: "South Africa" };

// Extract the bullet lines under a heading written by the create form ("Responsibilities:\n- a\n- b").
function parseSection(text: string, heading: string): string[] {
  const match = text.match(new RegExp(`${heading}:\\n((?:- .*(?:\\n|$))+)`));
  return match ? match[1].split("\n").filter((line) => line.startsWith("- ")).map((line) => line.slice(2)) : [];
}

// Convert a stored opportunity back into the editor's form fields.
function opportunityToForm(o: OpportunityDetail): Form {
  const text = o.responsibilities ?? "";
  const instructions = text.match(/Application instructions:\n([\s\S]*)$/)?.[1]?.trim() ?? "";
  const responsibilities = parseSection(text, "Responsibilities");
  const requirements = parseSection(text, "Requirements");
  return {
    ...blank,
    title: o.title,
    type: o.opportunity_type,
    level: o.experience_level ?? blank.level,
    arrangement: o.work_arrangement,
    country: (o.country && countryNames[o.country]) || blank.country,
    location: o.location ?? "",
    duration: o.duration_weeks ? `${o.duration_weeks} weeks` : "",
    startDate: o.start_date ? o.start_date.slice(0, 10) : "",
    deadline: o.application_deadline ? o.application_deadline.slice(0, 10) : "",
    openings: o.openings ? String(o.openings) : "",
    description: o.description,
    // Fall back to the raw text when it was not written by this form's template.
    responsibilities: responsibilities.length ? responsibilities : [responsibilities.length || requirements.length ? "" : text],
    requirements: requirements.length ? requirements : [""],
    skills: o.skills_required ?? [],
    paid: o.is_paid ? "paid" : "unpaid",
    currency: o.currency ?? blank.currency,
    min: o.compensation_min ? String(Number(o.compensation_min)) : "",
    max: o.compensation_max ? String(Number(o.compensation_max)) : "",
    frequency: o.payment_frequency ?? blank.frequency,
    applyMethod: o.external_apply_url ? "external" : "internflare",
    externalUrl: o.external_apply_url ?? "",
    instructions,
  };
}

export function ListingEditorPage() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(listingEditorReducer, {
    form: blank,
    skill: "",
    errors: [],
    ai: { state: "idle", text: "" },
    aiApproved: true,
    submissionStatus: null,
    companies: [],
    companyId: "",
    submitting: false,
    loadedTitle: "",
    loadingExisting: Boolean(id),
    loadError: "",
  });
  const { form: f, skill, errors, ai, aiApproved, submissionStatus, companies, companyId, submitting, loadedTitle, loadingExisting, loadError } = state;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => dispatch({ type: "set-form", form: { ...f, [k]: v } });
  const isInternship = f.type === "internship";
  const showComp = !isInternship || f.paid === "paid";
  const atLimit = !id && planUsage[0].used >= planUsage[0].limit;
  const checklist: [string, boolean][] = [
    ["Basics", !!f.title],
    ["Description", f.description.length >= 40],
    ["Skills", f.skills.length > 0],
    ["Compensation", !isInternship || !!f.paid],
    ["Deadline", !!f.deadline],
  ];

  // In edit mode, prefill the form from the stored listing (backend enforces admin access for non-published ones).
  useEffect(() => {
    if (!id) return;
    let active = true;
    jobService
      .getOpportunity(id)
      .then((response) => {
        if (!active) return;
        if (!response) throw new Error("The listing service returned an empty response.");
        dispatch({ type: "existing-loaded", form: opportunityToForm(response.opportunity), title: response.opportunity.title });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const status = error instanceof ApiRequestError ? error.status : 0;
        dispatch({
          type: "existing-failed",
          error:
            status === 404 ? "This listing no longer exists."
            : status === 401 || status === 403 ? "You don't have permission to edit this listing."
            : "Could not load this listing. Please try again.",
        });
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    profileService
      .getMyAdminCompanies()
      .then((result) => {
        if (!active) return;
        const adminCompanies = result?.companies ?? [];
        dispatch({ type: "set-companies", companies: adminCompanies });
        if (adminCompanies.length === 1) {
          dispatch({ type: "set-company-id", companyId: adminCompanies[0].id });
        } else if (adminCompanies.length === 0) {
          dispatch({
            type: "set-errors",
            errors: ["Complete employer onboarding before creating a listing"],
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          dispatch({
            type: "set-errors",
            errors: [
              error instanceof Error
                ? error.message
                : "Unable to load your employer company",
            ],
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const validate = (status: "draft" | "published") => {
    const e: string[] = [];
    if (!id && !companyId) e.push("Your active company could not be found");
    if (!f.title.trim()) e.push("Title is required");
    if (!f.description.trim()) e.push("Description is required");
    if (f.openings && (!Number.isInteger(Number(f.openings)) || Number(f.openings) < 1)) {
      e.push("Openings must be a positive whole number");
    }
    for (const amount of [f.min, f.max]) {
      if (
        amount &&
        (!Number.isFinite(Number(amount)) ||
          Number(amount) < 0 ||
          Number(amount) > 9_999_999_999.99)
      ) {
        e.push("Compensation amounts must be valid non-negative numbers");
        break;
      }
    }
    if (
      f.min &&
      f.max &&
      Number.isFinite(Number(f.min)) &&
      Number.isFinite(Number(f.max)) &&
      Number(f.min) > Number(f.max)
    ) {
      e.push("Minimum compensation can't exceed maximum");
    }
    if (status === "published") {
      if (f.description.trim().length < 40) e.push("Description must be at least 40 characters");
      if (!f.responsibilities.some((x) => x.trim())) e.push("Add at least one responsibility");
      if (!f.requirements.some((x) => x.trim())) e.push("Add at least one requirement");
      if (f.skills.length === 0) e.push("Add at least one skill");
      if (!f.location.trim() && f.arrangement !== "remote") e.push("Location is required for hybrid/onsite roles");
      if (!f.deadline) e.push("Application deadline is required");
      if (isInternship && !f.paid) e.push("State whether the internship is paid or unpaid");
      if (showComp && (!f.min || !f.max)) e.push("Enter a compensation range");
      if (showComp && (!Number.isFinite(Number(f.min)) || !Number.isFinite(Number(f.max)))) {
        e.push("Enter valid compensation amounts");
      }
      if (f.applyMethod === "external" && !/^https:\/\//.test(f.externalUrl)) e.push("External application URL must start with https://");
      if (!aiApproved) e.push("Review and approve the AI-generated description before publishing");
      if (atLimit) e.push(`Listing limit reached (${planUsage[0].limit}). Pause a listing or upgrade your plan`);
    }
    return e;
  };

  const submitListing = async (status: "draft" | "published") => {
    const e = validate(status);
    dispatch({ type: "set-errors", errors: e });
    if (e.length) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    dispatch({ type: "set-submitting", submitting: true });
    try {
      const countryCodes: Record<string, string> = {
        Nigeria: "NG",
        Ghana: "GH",
        Kenya: "KE",
        "South Africa": "ZA",
      };
      const durationMatch = f.duration.match(/(\d+)\s*(week|month|year)/i);
      const durationWeeks = durationMatch
        ? Number(durationMatch[1]) *
          (durationMatch[2].toLowerCase() === "year"
            ? 52
            : durationMatch[2].toLowerCase() === "month"
              ? 4
              : 1)
        : null;
      const responsibilities = [
        f.responsibilities.some((item) => item.trim())
          ? `Responsibilities:\n${f.responsibilities.filter((item) => item.trim()).map((item) => `- ${item.trim()}`).join("\n")}`
          : "",
        f.requirements.some((item) => item.trim())
          ? `Requirements:\n${f.requirements.filter((item) => item.trim()).map((item) => `- ${item.trim()}`).join("\n")}`
          : "",
        f.instructions.trim() ? `Application instructions:\n${f.instructions.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const fields = {
        title: f.title.trim(),
        description: f.description.trim(),
        responsibilities,
        opportunity_type: f.type,
        employment_type: f.type,
        experience_level: f.level,
        is_paid: f.paid === "paid" || (!isInternship && f.paid !== "unpaid"),
        compensation_min: showComp && f.min ? Number(f.min) : null,
        compensation_max: showComp && f.max ? Number(f.max) : null,
        currency: showComp ? f.currency : null,
        payment_frequency: showComp ? f.frequency : null,
        country: countryCodes[f.country] ?? null,
        location: f.location.trim() || null,
        work_arrangement: f.arrangement,
        skills_required: f.skills,
        duration_weeks: durationWeeks,
        start_date: f.startDate || null,
        application_deadline: f.deadline
          ? new Date(`${f.deadline}T23:59:59.000Z`).toISOString()
          : null,
        openings: f.openings ? Number(f.openings) : null,
        status,
        external_apply_url:
          f.applyMethod === "external" && f.externalUrl.trim()
            ? f.externalUrl.trim()
            : null,
      };
      if (id) {
        await jobService.updateOpportunity(id, fields);
      } else {
        await jobService.createOpportunity({
          company_id: companyId,
          source_type: "employer",
          ...fields,
        });
      }
      dispatch({ type: "set-submission-status", status });
    } catch (error: unknown) {
      dispatch({
        type: "set-errors",
        errors: [
          error instanceof Error
            ? error.message
            : "Unable to publish this listing",
        ],
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      dispatch({ type: "set-submitting", submitting: false });
    }
  };

  const generate = () => {
    dispatch({ type: "set-ai", ai: { state: "loading", text: "" } });
    setTimeout(() => dispatch({ type: "set-ai", ai: { state: "ready", text: `As a ${f.title || "[role title]"} at Kora Ledger, you'll work with our team on ${f.responsibilities.filter(Boolean)[0]?.toLowerCase() || "[core responsibility]"}. This is a ${f.arrangement} ${isInternship ? "internship" : "role"}${f.duration ? ` lasting ${f.duration}` : ""}. You'll use ${f.skills.join(", ") || "[skills]"} day to day and receive structured mentorship from senior teammates.` } }), 800);
  };

  if (id && (loadingExisting || loadError)) {
    return loadError ? (
      <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <p className="flex items-center gap-2 font-medium text-destructive"><AlertCircleIcon className="h-4 w-4" />{loadError}</p>
        <Button asChild className="mt-3" variant="outline"><Link to="/employer/listings">Back to listings</Link></Button>
      </div>
    ) : (
      <div role="status" className="flex items-center justify-center gap-2 rounded-xl border bg-card p-10 text-sm text-muted-foreground">
        <Loader2Icon className="h-4 w-4 animate-spin" /> Loading listing…
      </div>
    );
  }

  if (submissionStatus) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <CheckCircle2Icon className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold">{submissionStatus === "published" ? "Listing published" : "Draft saved"}</h1>
        <p className="mt-2 text-muted-foreground">
          {submissionStatus === "published"
            ? `${f.title} is live and visible to talent.`
            : `${f.title} has been saved as a draft.`}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline" className="bg-card"><Link to="/employer/listings">All listings</Link></Button>
          <Button asChild><Link to="/employer/candidates">Go to candidates</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/employer/listings" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Listings</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-bold tracking-tight">{id ? `Edit: ${loadedTitle || "listing"}` : "Create opportunity"}</h1><p className="mt-1 text-sm text-muted-foreground">Fields marked * are required to publish. Drafts need a title and description.</p></div>
      </div>

      {errors.length > 0 && (
        <div role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="flex items-center gap-2 font-semibold text-destructive"><AlertCircleIcon className="h-4 w-4" /> Fix {errors.length} issue{errors.length > 1 ? "s" : ""} before publishing</p>
          <ul className="mt-2 list-inside list-disc text-sm">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
      {atLimit && <p className="mt-4 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">You've used all {planUsage[0].limit} active listings on your plan. You can save a draft, or <Link to="/employer/billing" className="font-medium underline">upgrade</Link> to publish.</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Section title="Basics">
            <div className="space-y-1.5"><Label htmlFor="le-title">Title *</Label><Input id="le-title" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Frontend Engineering Intern" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5"><Label htmlFor="le-type">Opportunity type *</Label>
                <Select value={f.type} onValueChange={(v) => set("type", v)}><SelectTrigger id="le-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="internship">Internship</SelectItem><SelectItem value="job">Job</SelectItem><SelectItem value="graduate">Graduate role</SelectItem><SelectItem value="freelance">Freelance / contract</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="le-level">Experience *</Label>
                <Select value={f.level} onValueChange={(v) => set("level", v)}><SelectTrigger id="le-level"><SelectValue /></SelectTrigger><SelectContent>{["Entry", "Junior", "Graduate", "Mid"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="le-open">Openings *</Label><Input id="le-open" type="number" min={1} value={f.openings} onChange={(e) => set("openings", e.target.value)} /></div>
            </div>
          </Section>

          {companies.length > 1 && (
            <Section title="Company">
              <div className="space-y-1.5">
                <Label htmlFor="le-company">Publish for *</Label>
                <Select value={companyId} onValueChange={(value) => dispatch({ type: "set-company-id", companyId: value })}>
                  <SelectTrigger id="le-company"><SelectValue placeholder="Choose a company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Section>
          )}

          <Section title="Location & schedule">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Work arrangement *</legend>
              <RadioGroup value={f.arrangement} onValueChange={(v) => set("arrangement", v)} className="flex flex-wrap gap-4">
                {["remote", "hybrid", "onsite"].map((a) => <Label key={a} htmlFor={`arr-${a}`} className="flex items-center gap-2 font-normal capitalize"><RadioGroupItem id={`arr-${a}`} value={a} />{a}</Label>)}
              </RadioGroup>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="le-country">Country *</Label>
                <Select value={f.country} onValueChange={(v) => set("country", v)}><SelectTrigger id="le-country"><SelectValue /></SelectTrigger><SelectContent>{["Nigeria", "Ghana", "Kenya", "South Africa"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="le-loc">City / area {f.arrangement !== "remote" && "*"}</Label><Input id="le-loc" value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Lagos (Yaba)" /></div>
              <div className="space-y-1.5"><Label htmlFor="le-dur">Duration</Label><Input id="le-dur" value={f.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 6 months" /></div>
              <div className="space-y-1.5"><Label htmlFor="le-start">Start date</Label><Input id="le-start" type="date" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="le-dl">Application deadline *</Label><Input id="le-dl" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
            </div>
          </Section>

          <Section title="Description">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between"><Label htmlFor="le-desc">Role description *</Label><Button type="button" size="sm" variant="ghost" className="text-ai-strong" onClick={generate} disabled={ai.state === "loading"}>{ai.state === "loading" ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />} Draft with AI</Button></div>
              <Textarea id="le-desc" rows={5} value={f.description} onChange={(e) => set("description", e.target.value)} />
              <p className="text-right text-xs text-muted-foreground">{f.description.length} characters</p>
            </div>
            {ai.state === "ready" && (
              <div className="rounded-lg border border-ai/30 bg-ai-soft/60 p-4">
                <AiLabel>AI draft — review required</AiLabel>
                <p className="mt-2 text-sm">{ai.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">Generated only from the fields you've filled in. Check accuracy before using.</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => { set("description", ai.text); dispatch({ type: "set-ai-approved", approved: false }); dispatch({ type: "set-ai", ai: { state: "idle", text: "" } }); }}>Insert into description</Button>
                  <Button size="sm" variant="ghost" onClick={() => dispatch({ type: "set-ai", ai: { state: "idle", text: "" } })}>Discard</Button>
                </div>
              </div>
            )}
            {!aiApproved && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3">
                <Checkbox id="le-ai-ok" checked={aiApproved} onCheckedChange={(v) => dispatch({ type: "set-ai-approved", approved: v === true })} className="mt-0.5" />
                <Label htmlFor="le-ai-ok" className="text-sm font-normal">I've reviewed and approve the AI-assisted description for publication.</Label>
              </div>
            )}
            <ListInput id="resp" label="Responsibilities" items={f.responsibilities} onChange={(v) => set("responsibilities", v)} />
            <ListInput id="req" label="Requirements" items={f.requirements} onChange={(v) => set("requirements", v)} />
            <div>
              <Label htmlFor="le-skill">Skills *</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {f.skills.map((s) => <span key={s} className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-sm">{s}<button type="button" onClick={() => set("skills", f.skills.filter((x) => x !== s))} aria-label={`Remove ${s}`}><XIcon className="h-3 w-3" /></button></span>)}
              </div>
              <div className="mt-2 flex gap-2">
                <Input id="le-skill" value={skill} onChange={(e) => dispatch({ type: "set-skill", skill: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (skill.trim() && !f.skills.includes(skill.trim())) { set("skills", [...f.skills, skill.trim()]); dispatch({ type: "set-skill", skill: "" }); } } }} placeholder="Type a skill and press Enter" />
              </div>
            </div>
          </Section>

          <Section title="Compensation" desc="Shown clearly to candidates. Internships must state paid or unpaid.">
            {isInternship && (
              <RadioGroup value={f.paid} onValueChange={(v) => { if (isPaidChoice(v)) set("paid", v); }} className="grid gap-2 sm:grid-cols-2">
                {[["paid", "Paid internship", "Stipend or salary"], ["unpaid", "Unpaid internship", "Shown with an 'Unpaid' label"]].map(([v, l, d]) => (
                  <Label key={v} htmlFor={`pay-${v}`} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal", f.paid === v && "border-primary bg-accent/50")}>
                    <RadioGroupItem id={`pay-${v}`} value={v} className="mt-0.5" /><span><span className="block font-medium">{l}</span><span className="text-xs text-muted-foreground">{d}</span></span>
                  </Label>
                ))}
              </RadioGroup>
            )}
            {showComp && (
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-1.5"><Label htmlFor="le-cur">Currency *</Label><Select value={f.currency} onValueChange={(v) => set("currency", v)}><SelectTrigger id="le-cur"><SelectValue /></SelectTrigger><SelectContent>{["NGN", "USD", "GHS", "KES"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label htmlFor="le-min">Minimum *</Label><Input id="le-min" type="number" min={0} value={f.min} onChange={(e) => set("min", e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="le-max">Maximum *</Label><Input id="le-max" type="number" min={0} value={f.max} onChange={(e) => set("max", e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="le-freq">Frequency *</Label><Select value={f.frequency} onValueChange={(v) => set("frequency", v)}><SelectTrigger id="le-freq"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hour">Per hour</SelectItem><SelectItem value="month">Per month</SelectItem><SelectItem value="year">Per year</SelectItem><SelectItem value="project">Per project</SelectItem></SelectContent></Select></div>
              </div>
            )}
          </Section>

          <Section title="Application details">
            <RadioGroup value={f.applyMethod} onValueChange={(v) => { if (isApplyMethod(v)) set("applyMethod", v); }} className="flex flex-wrap gap-4">
              <Label htmlFor="am-in" className="flex items-center gap-2 font-normal"><RadioGroupItem id="am-in" value="internflare" /> Apply on Internflare (tracked pipeline)</Label>
              <Label htmlFor="am-ex" className="flex items-center gap-2 font-normal"><RadioGroupItem id="am-ex" value="external" /> External application site</Label>
            </RadioGroup>
            {f.applyMethod === "external" && <div className="space-y-1.5"><Label htmlFor="le-url">Application URL *</Label><Input id="le-url" value={f.externalUrl} onChange={(e) => set("externalUrl", e.target.value)} placeholder="https://" /><p className="text-xs text-muted-foreground">Candidates will be told they're leaving Internflare. External applications aren't tracked in your pipeline.</p></div>}
            <div className="space-y-1.5"><Label htmlFor="le-ins">Instructions for applicants</Label><Textarea id="le-ins" rows={2} value={f.instructions} onChange={(e) => set("instructions", e.target.value)} /></div>
          </Section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Publish</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {checklist.map(([label, ok]) => (
                <li key={label} className="flex items-center gap-2">{ok ? <CheckCircle2Icon className="h-4 w-4 text-success" /> : <span className="h-4 w-4 rounded-full border" />}{label}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">Uses 1 of {planUsage[0].limit} active listings ({planUsage[0].used} used).</p>
            <div className="mt-4 grid gap-2">
              <Button onClick={() => void submitListing("published")} disabled={submitting}>
                {submitting ? <Loader2Icon className="animate-spin" /> : null}
                {submitting ? "Saving…" : id ? "Save & publish" : "Publish listing"}
              </Button>
              <Button
                variant="outline"
                className="bg-card"
                onClick={() => void submitListing("draft")}
                disabled={submitting}
              >
                {id ? "Save as draft" : "Save draft"}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
