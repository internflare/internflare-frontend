import { useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, BriefcaseIcon, CheckCircle2Icon, ChevronLeftIcon, CopyIcon, ExternalLinkIcon, Loader2Icon, MessageSquareQuoteIcon, PlusIcon, SparklesIcon, StickyNoteIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
import { LeadStageBadge, LeadsHeader, UserRecordedNote } from "@/polymet/components/leads/leads-shared";
import { StateBlock } from "@/polymet/components/page-states";
import { AiLabel } from "@/polymet/components/status-badges";
import { WizardStepper } from "@/polymet/components/wizard-stepper";
import { acquisitionSettings, formatShortDate, leadStages, prospects, weeklyActivity, type LeadStage } from "@/polymet/data/leads-data";

/* ---------------- Prospect detail ---------------- */
export function ProspectDetailPage() {
  const { id = "pr1" } = useParams();
  const found = prospects.find((p) => p.id === id);
  const [p, setP] = useState(found);
  const [note, setNote] = useState("");
  const [kind, setKind] = useState<"note" | "response">("note");

  if (!p) return <StateBlock kind="no-results" title="Prospect not found" action={{ label: "All prospects", to: "/app/leads/prospects" }} />;

  const addNote = () => {
    if (!note.trim()) return;
    setP({ ...p, notes: [{ id: `n${Date.now()}`, date: "15 May", text: note, kind }, ...p.notes], lastAction: kind === "response" ? "Recorded response" : "Added note", lastActionDate: "2025-05-15", awaitingReply: kind === "response" ? false : p.awaitingReply });
    setNote("");
    toast(kind === "response" ? "Response recorded" : "Note added");
  };

  return (
    <div>
      <Toaster />
      <Link to="/app/leads/prospects" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Prospects</Link>
      <div className="mt-3 flex flex-wrap items-start gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{p.business}</h1>
          <p className="text-sm text-muted-foreground">{p.name} · {p.channel} · {p.service}</p>
          {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline">{p.url.replace(/^https?:\/\//, "")} <ExternalLinkIcon className="h-3.5 w-3.5" /></a>}
        </div>
        <LeadStageBadge stage={p.stage} />
      </div>

      {p.stage === "Won" && (
        <div className="mt-5 flex flex-wrap items-start gap-3 rounded-xl border border-success/25 bg-success-soft/70 p-4">
          <BriefcaseIcon className="mt-0.5 h-5 w-5 text-success" />
          <div className="flex-1">
            <p className="font-semibold">{p.business} is now a client</p>
            <p className="text-sm text-muted-foreground">Create an engagement to manage scope, tasks, deliverables and payments in SquadCot.</p>
          </div>
          <Button size="sm" onClick={() => toast("Engagement draft created (demo)", { description: "Payment terms and workspace are set up after the client confirms." })}>Set up engagement</Button>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Record activity</p>
            <RadioGroup value={kind} onValueChange={(v) => setKind(v as "note" | "response")} className="mt-3 flex gap-4">
              <Label htmlFor="k-note" className="flex items-center gap-2 font-normal"><RadioGroupItem id="k-note" value="note" /> Note</Label>
              <Label htmlFor="k-resp" className="flex items-center gap-2 font-normal"><RadioGroupItem id="k-resp" value="response" /> Their response (paste or summarise)</Label>
            </RadioGroup>
            <Textarea className="mt-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={kind === "note" ? "What did you do?" : "What did they say? Paste only what they sent you."} aria-label="Activity text" />
            <div className="mt-3 flex justify-end"><Button size="sm" onClick={addNote} disabled={!note.trim()}><PlusIcon /> Save</Button></div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Conversation notes</p>
            {p.notes.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {p.notes.map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", n.kind === "response" ? "bg-ai-soft text-ai-strong" : "bg-muted text-muted-foreground")}>
                      {n.kind === "response" ? <MessageSquareQuoteIcon className="h-4 w-4" /> : <StickyNoteIcon className="h-4 w-4" />}
                    </span>
                    <div><p className="text-xs text-muted-foreground">{n.date} · {n.kind === "response" ? "Their response (recorded by you)" : "Your note"}</p><p className="text-sm">{n.text}</p></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="space-y-3 rounded-xl border bg-card p-5">
            <div className="space-y-1.5"><Label htmlFor="pd-stage">Stage</Label>
              <Select value={p.stage} onValueChange={(v) => setP({ ...p, stage: v as LeadStage, lastAction: `Moved to ${v}`, lastActionDate: "2025-05-15" })}>
                <SelectTrigger id="pd-stage"><SelectValue /></SelectTrigger>
                <SelectContent>{leadStages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="pd-next">Next action</Label><Input id="pd-next" value={p.nextAction} onChange={(e) => setP({ ...p, nextAction: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pd-fu">Follow-up date</Label><Input id="pd-fu" type="date" value={p.followUp} onChange={(e) => setP({ ...p, followUp: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="pd-out">Outcome</Label><Input id="pd-out" value={p.outcome ?? ""} onChange={(e) => setP({ ...p, outcome: e.target.value })} placeholder="e.g. Won ₦350k project" /></div>
            <div className="flex items-center gap-2"><Checkbox id="pd-meet" checked={p.meetingBooked} onCheckedChange={(v) => setP({ ...p, meetingBooked: v === true })} /><Label htmlFor="pd-meet" className="font-normal">Meeting booked</Label></div>
            <div className="flex items-center gap-2"><Checkbox id="pd-await" checked={p.awaitingReply} onCheckedChange={(v) => setP({ ...p, awaitingReply: v === true })} /><Label htmlFor="pd-await" className="font-normal">Awaiting reply</Label></div>
            <dl className="border-t pt-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Last action</dt><dd>{p.lastAction} · {formatShortDate(p.lastActionDate)}</dd></div></dl>
            <Button className="w-full" onClick={() => toast("Prospect updated")}>Save changes</Button>
            <UserRecordedNote />
          </div>
          <div className="rounded-xl border border-ai/30 bg-ai-soft/60 p-5">
            <AiLabel>Next-step suggestion</AiLabel>
            <p className="mt-2 text-sm">{p.notes[0] ? `Based on your note “${p.notes[0].text.slice(0, 60)}…”, a short follow-up offering a 15-minute call is a reasonable next step.` : "Add a note to get a suggestion."}</p>
            <Button asChild size="sm" variant="outline" className="mt-3 bg-card"><Link to="/app/leads/outreach">Draft message</Link></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Outreach assistant ---------------- */
type OutreachState = {
  prospectId: string;
  messageType: string;
  context: string;
  draft: string;
  loading: boolean;
};

type OutreachAction =
  | { type: "prospect-selected"; prospectId: string }
  | { type: "message-type-selected"; messageType: string }
  | { type: "context-changed"; context: string }
  | { type: "draft-changed"; draft: string }
  | { type: "generation-started" }
  | { type: "draft-generated"; draft: string };

function outreachReducer(
  state: OutreachState,
  action: OutreachAction,
): OutreachState {
  switch (action.type) {
    case "prospect-selected":
      return { ...state, prospectId: action.prospectId };
    case "message-type-selected":
      return { ...state, messageType: action.messageType };
    case "context-changed":
      return { ...state, context: action.context };
    case "draft-changed":
      return { ...state, draft: action.draft };
    case "generation-started":
      return { ...state, loading: true };
    case "draft-generated":
      return { ...state, draft: action.draft, loading: false };
  }
}

export function LeadsOutreachPage() {
  const [state, dispatch] = useReducer(outreachReducer, {
    prospectId: prospects[0].id,
    messageType: "follow-up",
    context: "",
    draft: "",
    loading: false,
  });
  const { prospectId, messageType: type, context, draft, loading } = state;
  const p = prospects.find((x) => x.id === prospectId)!;

  const generate = () => {
    dispatch({ type: "generation-started" });
    setTimeout(() => {
      const lastNote = p.notes.find((n) => n.kind === "response")?.text;
      const body =
        type === "pitch"
          ? `Hi ${p.name.split(" ")[0]},\n\nThanks for your time${p.meetingBooked ? " on our call" : ""}. Based on what you shared${lastNote ? ` (${lastNote.replace(/[“”]/g, "")})` : ""}, here's what I'd propose for ${p.business}:\n\n• ${p.service} tailored to your customers\n• Launch in about 4 weeks\n• Clear fixed price, agreed upfront\n\n${context || "[Add your price and relevant example]"}\n\nWould a 15-minute call this week work to confirm scope?\n\nBest,\nAmara`
          : type === "intro"
            ? `Hi ${p.name.split(" ")[0]},\n\nI came across ${p.business} and noticed ${context || "[something specific you observed on their public page]"}. I help businesses like yours with ${p.service.toLowerCase()}.\n\nWould you be open to a short chat?\n\nAmara`
            : `Hi ${p.name.split(" ")[0]},\n\nJust following up on my last message about ${p.service.toLowerCase()} for ${p.business}. ${context || "[Add a helpful detail or answer to a question they asked]"}\n\nHappy to answer any questions.\n\nAmara`;
      dispatch({ type: "draft-generated", draft: body });
    }, 650);
  };

  return (
    <div>
      <Toaster />
      <LeadsHeader title="Outreach writing assistant" description="Draft pitches and messages from your own prospect notes. Copy and send them yourself." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <div className="space-y-1.5"><Label htmlFor="ow-p">Prospect</Label>
            <Select value={prospectId} onValueChange={(value) => dispatch({ type: "prospect-selected", prospectId: value })}><SelectTrigger id="ow-p"><SelectValue /></SelectTrigger>
              <SelectContent>{prospects.filter((x) => !["Lost", "Not Interested"].includes(x.stage)).map((x) => <SelectItem key={x.id} value={x.id}>{x.business}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="ow-t">Message type</Label>
            <Select value={type} onValueChange={(value) => dispatch({ type: "message-type-selected", messageType: value })}><SelectTrigger id="ow-t"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="intro">First outreach</SelectItem><SelectItem value="follow-up">Follow-up</SelectItem><SelectItem value="pitch">Pitch / proposal</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="ow-c">Extra context (your words)</Label><Textarea id="ow-c" rows={4} value={context} onChange={(e) => dispatch({ type: "context-changed", context: e.target.value })} placeholder="e.g. Price ₦350k, similar clinic project link" /></div>
          <Button className="w-full" onClick={generate} disabled={loading}>{loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />} {draft ? "Regenerate" : "Generate draft"}</Button>
          <p className="text-xs text-muted-foreground">Uses only the prospect record and notes you entered.</p>
        </div>
        <div className="flex min-h-[380px] flex-col rounded-xl border bg-card">
          <div className="flex items-center gap-2 border-b px-5 py-3">
            <p className="flex-1 text-sm font-semibold">Draft</p>
            <Button size="sm" variant="ghost" disabled={!draft} onClick={() => { navigator.clipboard?.writeText(draft); toast("Copied — paste it into your channel"); }}><CopyIcon /> Copy</Button>
            <Button size="sm" variant="outline" className="bg-card" disabled={!draft} onClick={() => toast(`Logged “${type}” for ${p.business}`, { description: "Recorded as user-reported activity." })}><CheckCircle2Icon /> I sent this</Button>
          </div>
          <div className="flex-1 p-5">
            {draft ? <Textarea value={draft} onChange={(e) => dispatch({ type: "draft-changed", draft: e.target.value })} className="min-h-[300px] border-0 p-0 text-[15px] shadow-none focus-visible:ring-0" aria-label="Draft message" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Choose a prospect and generate a draft.</div>}
          </div>
          {draft && <p className="flex items-center gap-2 border-t bg-warning-soft/60 px-5 py-3 text-sm"><TriangleAlertIcon className="h-4 w-4 text-warning" /> Review and personalise before sending. Replace any [placeholders].</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Analytics ---------------- */
export function LeadsAnalyticsPage() {
  const max = Math.max(...weeklyActivity.map((w) => w.outreach));
  const totals = weeklyActivity.reduce((a, w) => ({ outreach: a.outreach + w.outreach, replies: a.replies + w.replies, meetings: a.meetings + w.meetings, won: a.won + w.won }), { outreach: 0, replies: 0, meetings: 0, won: 0 });
  const funnel = [
    { label: "Outreach actions", v: totals.outreach },
    { label: "Replies", v: totals.replies },
    { label: "Meetings", v: totals.meetings },
    { label: "Clients won", v: totals.won },
  ];
  return (
    <div>
      <LeadsHeader title="Activity & outcomes" description="Last 5 weeks of activity you recorded. These are not verified external metrics." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {funnel.map((f) => (
          <div key={f.label} className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">{f.label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{f.v}</p><UserRecordedNote /></div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border bg-card p-5">
          <p className="font-semibold">Weekly activity</p>
          <div className="mt-6 flex h-56 items-end gap-4" role="img" aria-label="Weekly outreach and replies chart">
            {weeklyActivity.map((w) => (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-48 w-full items-end justify-center gap-1">
                  <div className="w-1/3 rounded-t bg-primary" style={{ height: `${(w.outreach / max) * 100}%` }} title={`${w.outreach} outreach`} />
                  <div className="w-1/3 rounded-t bg-ai" style={{ height: `${(w.replies / max) * 100}%` }} title={`${w.replies} replies`} />
                </div>
                <span className="text-xs text-muted-foreground">{w.week}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-primary" />Outreach</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-ai" />Replies</span></div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-semibold">Conversion</p>
          <ul className="mt-4 space-y-3">
            {funnel.map((f) => (
              <li key={f.label}>
                <div className="flex justify-between text-sm"><span>{f.label}</span><span className="tabular-nums">{f.v} · {Math.round((f.v / totals.outreach) * 100)}%</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-brown dark:bg-primary" style={{ width: `${(f.v / totals.outreach) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">Reply rate is {Math.round((totals.replies / totals.outreach) * 100)}%. Personalised follow-ups recorded in your notes had the most replies.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
export function LeadsSettingsPage() {
  const [s, setS] = useState(acquisitionSettings);
  return (
    <div>
      <Toaster />
      <LeadsHeader title="Target service & ideal client" description="Used to plan your daily actions and tailor drafted messages." />
      <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6">
        <div className="space-y-1.5"><Label htmlFor="ls-svc">Service you offer</Label><Input id="ls-svc" value={s.service} onChange={(e) => setS({ ...s, service: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="ls-icp">Ideal client</Label><Textarea id="ls-icp" rows={3} value={s.idealClient} onChange={(e) => setS({ ...s, idealClient: e.target.value })} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="ls-price">Typical price range</Label><Input id="ls-price" value={s.priceRange} onChange={(e) => setS({ ...s, priceRange: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="ls-target">Daily action target</Label><Input id="ls-target" type="number" min={1} max={20} value={s.dailyTarget} onChange={(e) => setS({ ...s, dailyTarget: Number(e.target.value) })} /></div>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Channels you use</legend>
          <div className="flex flex-wrap gap-3">
            {["LinkedIn", "Email", "Instagram", "WhatsApp", "In person"].map((c) => (
              <Label key={c} htmlFor={`ch-${c}`} className="flex items-center gap-2 font-normal"><Checkbox id={`ch-${c}`} checked={s.channels.includes(c)} onCheckedChange={(v) => setS({ ...s, channels: v ? [...s.channels, c] : s.channels.filter((x) => x !== c) })} />{c}</Label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end"><Button onClick={() => toast("Settings saved")}>Save</Button></div>
      </div>
    </div>
  );
}

/* ---------------- Setup wizard ---------------- */
const setupSteps = ["Your service", "Ideal client", "Channels & rhythm", "Review"];

type SetupForm = {
  service: string;
  proof: string;
  client: string;
  location: string;
  channels: string[];
  target: number;
  ack: boolean;
};

type SetupState = {
  step: number;
  done: number[];
  form: SetupForm;
  finished: boolean;
};

type SetupAction =
  | { type: "step-completed"; step: number }
  | { type: "step-selected"; step: number }
  | { type: "step-back" }
  | { type: "service-changed"; value: string }
  | { type: "proof-changed"; value: string }
  | { type: "client-changed"; value: string }
  | { type: "location-changed"; value: string }
  | { type: "channels-changed"; channels: string[] }
  | { type: "target-changed"; target: number }
  | { type: "acknowledgement-changed"; acknowledged: boolean }
  | { type: "plan-created" };

function setupReducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case "step-completed":
      return {
        ...state,
        done: state.done.includes(action.step)
          ? state.done
          : [...state.done, action.step],
        step: state.step + 1,
      };
    case "step-selected":
      return { ...state, step: action.step };
    case "step-back":
      return { ...state, step: state.step - 1 };
    case "service-changed":
      return { ...state, form: { ...state.form, service: action.value } };
    case "proof-changed":
      return { ...state, form: { ...state.form, proof: action.value } };
    case "client-changed":
      return { ...state, form: { ...state.form, client: action.value } };
    case "location-changed":
      return { ...state, form: { ...state.form, location: action.value } };
    case "channels-changed":
      return { ...state, form: { ...state.form, channels: action.channels } };
    case "target-changed":
      return { ...state, form: { ...state.form, target: action.target } };
    case "acknowledgement-changed":
      return {
        ...state,
        form: { ...state.form, ack: action.acknowledged },
      };
    case "plan-created":
      return { ...state, finished: true };
  }
}

export function LeadsSetupPage() {
  const [state, dispatch] = useReducer(setupReducer, {
    step: 0,
    done: [],
    form: {
      service: "",
      proof: "",
      client: "",
      location: "",
      channels: ["LinkedIn"],
      target: 5,
      ack: false,
    },
    finished: false,
  });
  const { step, done, form: s, finished } = state;
  const next = () => dispatch({ type: "step-completed", step });
  const valid = [s.service.trim().length > 0, s.client.trim().length > 0, s.channels.length > 0 && s.ack, true][step];

  if (finished) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <CheckCircle2Icon className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-2xl font-bold">Your acquisition plan is ready</h1>
        <p className="mt-2 text-muted-foreground">We've created {s.target} daily actions. Add your first prospects to get started.</p>
        <Button asChild className="mt-6"><Link to="/app/leads">Open today's plan <ArrowRightIcon /></Link></Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <WizardStepper steps={setupSteps} current={step} completed={done} onStepClick={(nextStep) => dispatch({ type: "step-selected", step: nextStep })} title="Acquisition setup" />
      <section className="rounded-2xl border bg-card">
        <div className="border-b p-6"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {step + 1} of {setupSteps.length}</p><h1 className="mt-1 text-xl font-bold">{setupSteps[step]}</h1></div>
        <div className="space-y-4 p-6">
          {step === 0 && (<>
            <div className="space-y-1.5"><Label htmlFor="su-svc">What service do you want to sell?</Label><Input id="su-svc" value={s.service} onChange={(e) => dispatch({ type: "service-changed", value: e.target.value })} placeholder="e.g. Booking websites for clinics" /></div>
            <div className="space-y-1.5"><Label htmlFor="su-proof">Proof you can point to</Label><Textarea id="su-proof" rows={3} value={s.proof} onChange={(e) => dispatch({ type: "proof-changed", value: e.target.value })} placeholder="Portfolio projects or past client work" /></div>
          </>)}
          {step === 1 && (<>
            <div className="space-y-1.5"><Label htmlFor="su-client">Who is your ideal client?</Label><Textarea id="su-client" rows={3} value={s.client} onChange={(e) => dispatch({ type: "client-changed", value: e.target.value })} placeholder="Industry, size, the problem they have" /></div>
            <div className="space-y-1.5"><Label htmlFor="su-loc">Where are they?</Label><Input id="su-loc" value={s.location} onChange={(e) => dispatch({ type: "location-changed", value: e.target.value })} placeholder="e.g. Lagos, or remote" /></div>
          </>)}
          {step === 2 && (<>
            <fieldset><legend className="mb-2 text-sm font-medium">Channels you'll use</legend>
              <div className="flex flex-wrap gap-3">{["LinkedIn", "Email", "Instagram", "WhatsApp", "In person"].map((c) => (
                <Label key={c} htmlFor={`sc-${c}`} className="flex items-center gap-2 font-normal"><Checkbox id={`sc-${c}`} checked={s.channels.includes(c)} onCheckedChange={(v) => dispatch({ type: "channels-changed", channels: v ? [...s.channels, c] : s.channels.filter((x) => x !== c) })} />{c}</Label>
              ))}</div>
            </fieldset>
            <div className="space-y-1.5"><Label htmlFor="su-t">Actions per day</Label><Input id="su-t" type="number" min={1} max={20} value={s.target} onChange={(e) => dispatch({ type: "target-changed", target: Number(e.target.value) })} className="w-28" /></div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3">
              <Checkbox id="su-ack" checked={s.ack} onCheckedChange={(v) => dispatch({ type: "acknowledgement-changed", acknowledged: v === true })} className="mt-0.5" />
              <Label htmlFor="su-ack" className="text-sm font-normal leading-snug">I understand I'll send messages myself. Internflare doesn't automate outreach, send connection requests or access my private conversations.</Label>
            </div>
          </>)}
          {step === 3 && (
            <dl className="grid gap-3 sm:grid-cols-2">
              {[["Service", s.service], ["Ideal client", s.client], ["Location", s.location || "—"], ["Channels", s.channels.join(", ")], ["Daily target", `${s.target} actions`]].map(([k, v]) => (
                <div key={k} className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 text-sm font-medium">{v}</dd></div>
              ))}
            </dl>
          )}
        </div>
        <div className="flex items-center gap-2 border-t p-4 sm:px-6">
          <Button variant="ghost" disabled={step === 0} onClick={() => dispatch({ type: "step-back" })}><ArrowLeftIcon /> Back</Button>
          <div className="ml-auto" />
          {step < setupSteps.length - 1 ? <Button onClick={next} disabled={!valid}>Continue <ArrowRightIcon /></Button> : <Button onClick={() => dispatch({ type: "plan-created" })}>Create plan</Button>}
        </div>
      </section>
    </div>
  );
}
