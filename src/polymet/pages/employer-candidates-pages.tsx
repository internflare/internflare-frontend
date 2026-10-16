import { useMemo, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheckIcon, CalendarPlusIcon, ChevronLeftIcon, ClipboardListIcon, ColumnsIcon, FileTextIcon, GiftIcon, InfoIcon, MapPinIcon, SearchIcon, ShieldQuestionIcon, StarIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { AiLabel, EvidenceBadge, MatchBadge, MetaChip, StageBadge } from "@/polymet/components/status-badges";
import { SimplePagination } from "@/polymet/components/simple-pagination";
import { CandidateCompetencies } from "@/polymet/components/employer/candidate-competencies";
import { employerCandidateCompetencies, getRole, opportunityRequirements } from "@/polymet/data/pathway-data";
import { checkRequirement } from "@/polymet/lib/pathway-engine";
import { OfferDialog, RejectDialog, ScheduleInterviewDialog, TestTaskDialog } from "@/polymet/components/employer/candidate-actions";
import { candidates as seed, employerListings, type Candidate } from "@/polymet/data/employer-data";
import type { ApplicationStage } from "@/polymet/data/talent-data";

const stages: ApplicationStage[] = ["New", "Reviewed", "Shortlisted", "Interview", "Test Task", "Offer", "Hired", "Rejected", "Withdrawn"];
const allowed: Record<ApplicationStage, ApplicationStage[]> = {
  New: ["Reviewed", "Shortlisted", "Rejected"],
  Reviewed: ["Shortlisted", "Interview", "Rejected"],
  Shortlisted: ["Interview", "Test Task", "Offer", "Rejected"],
  Interview: ["Test Task", "Offer", "Rejected"],
  "Test Task": ["Interview", "Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: ["Reviewed"],
  Withdrawn: [],
};
const listingTitle = (id: string) => employerListings.find((l) => l.id === id)?.title ?? "—";
const PAGE = 5;

type CandidatesInboxState = {
  list: Candidate[];
  q: string;
  role: string;
  stage: string;
  verified: string;
  selected: string[];
  compareOpen: boolean;
  page: number;
};

type CandidatesInboxAction =
  | { type: "set-query"; query: string }
  | { type: "set-role"; role: string }
  | { type: "set-stage"; stage: string }
  | { type: "set-verified"; verified: string }
  | { type: "toggle-selected"; id: string; selected: boolean }
  | { type: "clear-selected" }
  | { type: "set-compare-open"; open: boolean }
  | { type: "set-page"; page: number }
  | { type: "bulk-stage"; stage: ApplicationStage };

function candidatesInboxReducer(state: CandidatesInboxState, action: CandidatesInboxAction): CandidatesInboxState {
  switch (action.type) {
    case "set-query":
      return { ...state, q: action.query, page: 1 };
    case "set-role":
      return { ...state, role: action.role, page: 1 };
    case "set-stage":
      return { ...state, stage: action.stage, page: 1 };
    case "set-verified":
      return { ...state, verified: action.verified, page: 1 };
    case "toggle-selected":
      return { ...state, selected: action.selected ? [...state.selected, action.id] : state.selected.filter((id) => id !== action.id) };
    case "clear-selected":
      return { ...state, selected: [] };
    case "set-compare-open":
      return { ...state, compareOpen: action.open };
    case "set-page":
      return { ...state, page: action.page };
    case "bulk-stage":
      return {
        ...state,
        list: state.list.map((candidate) => (state.selected.includes(candidate.id) ? { ...candidate, stage: action.stage } : candidate)),
        selected: [],
      };
  }
}

export function CandidatesInboxPage() {
  const [state, dispatch] = useReducer(candidatesInboxReducer, {
    list: seed,
    q: "",
    role: "all",
    stage: "active",
    verified: "all",
    selected: [],
    compareOpen: false,
    page: 1,
  });
  const { list, q, role, stage, verified, selected, compareOpen, page } = state;

  const rows = useMemo(() => list.filter((c) =>
    (role === "all" || c.listingId === role) &&
    (stage === "all" || (stage === "active" ? !["Rejected", "Withdrawn", "Hired"].includes(c.stage) : c.stage === stage)) &&
    (verified === "all" || (verified === "yes" ? c.identityVerified : !c.identityVerified)) &&
    `${c.name} ${c.skills.join(" ")} ${c.location} ${c.education}`.toLowerCase().includes(q.toLowerCase())), [list, q, role, stage, verified]);
  const pageRows = rows.slice((page - 1) * PAGE, page * PAGE);
  const compare = list.filter((c) => selected.includes(c.id));

  const bulk = (s: ApplicationStage) => {
    dispatch({ type: "bulk-stage", stage: s });
    toast(`${selected.length} moved to ${s}`);
  };

  return (
    <div>
      <PageHeader title="Candidates" description="Applications across your listings. Job applicants come only from the internflareJobs pool — candidates whose assessed evidence met job-readiness. AI match factors are guidance; your team makes every decision." />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="relative"><SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => dispatch({ type: "set-query", query: e.target.value })} placeholder="Name, skill, location, education" className="h-9 bg-card pl-9" aria-label="Search candidates" /></div>
        <Select value={role} onValueChange={(v) => dispatch({ type: "set-role", role: v })}><SelectTrigger className="h-9 bg-card" aria-label="Role"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem>{employerListings.filter((l) => l.applicants > 0).map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}</SelectContent></Select>
        <Select value={stage} onValueChange={(v) => dispatch({ type: "set-stage", stage: v })}><SelectTrigger className="h-9 bg-card" aria-label="Stage"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active stages</SelectItem><SelectItem value="all">All stages</SelectItem>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={verified} onValueChange={(v) => dispatch({ type: "set-verified", verified: v })}><SelectTrigger className="h-9 bg-card" aria-label="Verification"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Any verification</SelectItem><SelectItem value="yes">Identity verified</SelectItem><SelectItem value="no">Not verified</SelectItem></SelectContent></Select>
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border bg-accent/50 px-3 py-2 text-sm">
          <span className="font-medium">{selected.length} selected</span>
          <Button size="sm" variant="outline" className="h-8 bg-card" disabled={selected.length < 2 || selected.length > 3} onClick={() => dispatch({ type: "set-compare-open", open: true })}><ColumnsIcon /> Compare {selected.length > 3 && "(max 3)"}</Button>
          <Button size="sm" variant="outline" className="h-8 bg-card" onClick={() => bulk("Shortlisted")}><StarIcon /> Shortlist</Button>
          <Button size="sm" variant="ghost" className="h-8" onClick={() => dispatch({ type: "clear-selected" })}><XIcon /> Clear</Button>
        </div>
      )}

      <div className="mt-4">
        {rows.length === 0 ? <StateBlock kind="no-results" title="No candidates match these filters" /> : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-10"><span className="sr-only">Select</span></TableHead><TableHead>Candidate</TableHead><TableHead>Role</TableHead><TableHead>Match</TableHead><TableHead>Evidence</TableHead><TableHead>Expectation</TableHead><TableHead>Stage</TableHead></TableRow></TableHeader>
                <TableBody>
                  {pageRows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell><Checkbox checked={selected.includes(c.id)} onCheckedChange={(v) => dispatch({ type: "toggle-selected", id: c.id, selected: !!v })} aria-label={`Select ${c.name}`} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9"><AvatarImage src={c.avatar} alt="" /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
                          <div>
                            <Link to={`/employer/candidates/${c.id}`} className="flex items-center gap-1 font-medium hover:text-primary">{c.name}{c.identityVerified ? <BadgeCheckIcon className="h-3.5 w-3.5 text-success" aria-label="Identity verified" /> : <ShieldQuestionIcon className="h-3.5 w-3.5 text-muted-foreground" aria-label="Identity not verified" />}</Link>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPinIcon className="h-3 w-3" />{c.location} · applied {c.applied}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{listingTitle(c.listingId)}</TableCell>
                      <TableCell>{c.match ? <MatchBadge score={c.match.score} /> : <span className="text-xs text-muted-foreground">No structured data</span>}</TableCell>
                      <TableCell>{c.evidence[0] ? <EvidenceBadge level={c.evidence[0].level} /> : <span className="text-xs text-muted-foreground">None</span>}</TableCell>
                      <TableCell className="text-sm tabular-nums">{c.expectation}</TableCell>
                      <TableCell><StageBadge stage={c.stage} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="border-t px-4"><SimplePagination page={page} pageCount={Math.max(1, Math.ceil(rows.length / PAGE))} total={rows.length} pageSize={PAGE} onPage={(nextPage) => dispatch({ type: "set-page", page: nextPage })} /></div>
          </div>
        )}
      </div>

      <Dialog open={compareOpen} onOpenChange={(open) => dispatch({ type: "set-compare-open", open })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Compare candidates</DialogTitle><DialogDescription>Side-by-side view of profile evidence. Match factors explain fit; they don't rank people for you.</DialogDescription></DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead><tr><th className="w-36" />{compare.map((c) => <th key={c.id} className="p-2 text-left"><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarImage src={c.avatar} alt="" /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>{c.name}</div></th>)}</tr></thead>
              <tbody className="divide-y">
                {([
                  ["Stage", (c: Candidate) => <StageBadge stage={c.stage} />],
                  ["Match", (c: Candidate) => (c.match ? `${c.match.score}%` : "—")],
                  ["Role competency", (c: Candidate) => { const a = employerCandidateCompetencies[c.id]; const req = opportunityRequirements[c.listingId]; const role = a && getRole(a.roleId); if (!a || !role) return "Not assessed"; const r = checkRequirement(a, role, req?.threshold ?? role.thresholds.job, req?.competencyMins ?? []); return <span className={r.ok ? "font-medium text-success" : "font-medium text-warning"}>{r.overall}/{req?.threshold ?? role.thresholds.job} · {r.ok ? "meets" : `${r.unmet.length} gap(s)`}</span>; }],
                  ["Readiness", (c: Candidate) => (c.readiness ? `${c.readiness}/100` : "Not shared")],
                  ["Education", (c: Candidate) => c.education],
                  ["Experience", (c: Candidate) => c.experience],
                  ["Skills", (c: Candidate) => c.skills.join(", ")],
                  ["Top evidence", (c: Candidate) => (c.evidence[0] ? <span className="flex flex-col gap-1">{c.evidence[0].title}<EvidenceBadge level={c.evidence[0].level} /></span> : "—")],
                  ["Identity", (c: Candidate) => (c.identityVerified ? "Verified" : "Not verified")],
                  ["Expectation", (c: Candidate) => c.expectation],
                ] as const).map(([label, fn]) => (
                  <tr key={label}><td className="p-2 font-medium text-muted-foreground">{label}</td>{compare.map((c) => <td key={c.id} className="p-2 align-top">{fn(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CandidateDetailPage() {
  const { id = "c1" } = useParams();
  const found = seed.find((c) => c.id === id);
  const [c, setC] = useState(found);
  const [history, setHistory] = useState<string[]>(["Applied · " + (found?.applied ?? "")]);
  const [note, setNote] = useState("");
  if (!c) return <StateBlock kind="no-results" title="Candidate not found" action={{ label: "All candidates", to: "/employer/candidates" }} />;

  const log = (s: string) => setHistory((h) => [`${s} · today`, ...h]);
  const move = (s: ApplicationStage) => { setC({ ...c, stage: s }); log(`Moved to ${s}`); toast(`Moved to ${s}`, { description: "Candidate will be notified of the status change." }); };
  const closed = ["Hired", "Rejected", "Withdrawn"].includes(c.stage);

  return (
    <div>
      <Link to="/employer/candidates" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Candidates</Link>
      <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-6">
        <Avatar className="h-16 w-16"><AvatarImage src={c.avatar} alt={c.name} /><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold">{c.name}</h1>{c.identityVerified ? <EvidenceBadge level="verified" /> : <MetaChip>Identity not verified</MetaChip>}</div>
          <p className="text-muted-foreground">{c.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{listingTitle(c.listingId)} · applied {c.applied} · {c.location}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StageBadge stage={c.stage} />
          {!closed && allowed[c.stage].length > 0 && (
            <Select onValueChange={(v) => move(v as ApplicationStage)}>
              <SelectTrigger className="h-8 w-44" aria-label="Move to stage"><SelectValue placeholder="Move to stage…" /></SelectTrigger>
              <SelectContent>{allowed[c.stage].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          )}
        </div>
      </div>

      {!closed && (
        <div className="mt-4 flex flex-wrap gap-2">
          <ScheduleInterviewDialog candidate={c.name} onDone={(s) => { setC({ ...c, stage: "Interview" }); log(s); }} trigger={<Button><CalendarPlusIcon /> Request interview</Button>} />
          <TestTaskDialog candidate={c.name} onDone={(s) => { setC({ ...c, stage: "Test Task" }); log(s); }} trigger={<Button variant="outline" className="bg-card"><ClipboardListIcon /> Paid test task</Button>} />
          <OfferDialog candidate={c.name} onDone={(s) => { setC({ ...c, stage: "Offer" }); log(s); }} trigger={<Button variant="outline" className="bg-card"><GiftIcon /> Make offer</Button>} />
          <RejectDialog candidate={c.name} onDone={(s) => { setC({ ...c, stage: "Rejected" }); log(s); }} trigger={<Button variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive">Reject</Button>} />
        </div>
      )}
      {c.stage === "Hired" && (
        <div className="mt-4 rounded-xl border border-success/25 bg-success-soft/70 p-4 text-sm">
          <p className="font-semibold">{c.name} accepted — set up their SquadCot workspace</p>
          <p className="text-muted-foreground">Workspace access is provisioned after onboarding requirements are complete. Recruitment records stay here.</p>
          <Button size="sm" className="mt-3" onClick={() => toast("Provisioning requested (demo)", { description: "Status: pending" })}>Provision SquadCot access</Button>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
         <CandidateCompetencies candidateId={c.id} listingId={c.listingId} />
          {c.match ? (
            <section className="rounded-xl border border-ai/30 bg-ai-soft/50 p-5">
              <div className="flex items-center justify-between"><p className="font-semibold">Match factors · {c.match.score}%</p><AiLabel>Explainable AI</AiLabel></div>
              <ul className="mt-4 space-y-3">
                {c.match.factors.map((f) => (
                  <li key={f.label}>
                    <div className="flex justify-between text-sm"><span className="font-medium">{f.label}</span><span className="text-ai-strong">{f.score}%</span></div>
                    <Progress value={f.score} className="mt-1.5 h-1.5 bg-ai/20 [&>div]:bg-ai" aria-label={`${f.label} ${f.score}%`} />
                    <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Calculated from the listing's structured requirements and the candidate's profile evidence. It does not make or recommend hiring decisions.</p>
            </section>
          ) : (
            <p className="rounded-xl border border-dashed bg-card p-5 text-sm text-muted-foreground">No match score — this listing doesn't have enough structured requirements.</p>
          )}
          <section className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Work evidence</p>
            {c.evidence.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No portfolio evidence shared.</p> : (
              <ul className="mt-3 space-y-2">{c.evidence.map((e) => <li key={e.title} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"><div><p className="text-sm font-medium">{e.title}</p><p className="text-xs text-muted-foreground">{e.outcome}</p></div><EvidenceBadge level={e.level} /></li>)}</ul>
            )}
            <Button asChild variant="link" className="mt-2 px-0"><Link to="/talent/amara-okafor">Open public portfolio →</Link></Button>
          </section>
          <section className="rounded-xl border bg-card p-5">
            <p className="font-semibold">CV</p>
            <div className="mt-3 flex items-center gap-3 rounded-lg border p-3"><FileTextIcon className="h-5 w-5 text-muted-foreground" /><span className="flex-1 text-sm font-medium">{c.name.replace(" ", "_")}_CV.pdf</span><Button size="sm" variant="outline" className="bg-card" onClick={() => toast("CV preview opened (uses 1 applicant view)")}>Preview</Button></div>
          </section>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5 text-sm">
            <p className="font-semibold">Profile</p>
            <dl className="mt-3 space-y-2">
              {[["Education", c.education], ["Experience", c.experience], ["Readiness", c.readiness ? `${c.readiness}/100 (shared by candidate)` : "Not shared"], ["Salary expectation", c.expectation]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="mt-3 flex flex-wrap gap-1.5">{c.skills.map((s) => <MetaChip key={s}>{s}</MetaChip>)}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Team notes</p>
            <Textarea className="mt-2" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Private to your hiring team" aria-label="Team note" />
            <Button size="sm" className="mt-2" disabled={!note.trim()} onClick={() => { setC({ ...c, notes: [note, ...c.notes] }); setNote(""); }}>Add note</Button>
            <ul className="mt-3 space-y-2">{c.notes.map((n) => <li key={n} className="rounded-md bg-muted/50 p-2 text-sm">{n}</li>)}</ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Recruitment history</p>
            <ol className="mt-3 space-y-2 border-l pl-4 text-sm">{history.map((h) => <li key={h} className="relative before:absolute before:-left-[21px] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-primary">{h}</li>)}</ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
