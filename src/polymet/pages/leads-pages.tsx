import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircleIcon, CalendarIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, ExternalLinkIcon, HandshakeIcon, MessageCircleIcon, SearchIcon, SendIcon, SparklesIcon, TrophyIcon, UndoIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { AddProspectDialog, LeadStageBadge, LeadsHeader, UserRecordedNote } from "@/polymet/components/leads/leads-shared";
import { StateBlock } from "@/polymet/components/page-states";
import { AiLabel } from "@/polymet/components/status-badges";
import { activeLeadStages, dailyActions, formatShortDate, leadStages, prospects as seed, TODAY, type DailyAction, type LeadStage, type Prospect } from "@/polymet/data/leads-data";

const isOverdue = (p: Prospect) => !!p.followUp && p.followUp < TODAY && !["Won", "Lost", "Not Interested"].includes(p.stage);
const isDue = (p: Prospect) => p.followUp === TODAY;

function useProspects() {
  const [list, setList] = useState<Prospect[]>(seed);
  return { list, setList, add: (p: Prospect) => setList((l) => [p, ...l]) };
}

/* ---------------- Daily plan ---------------- */
export function LeadsPlanPage() {
  const [actions, setActions] = useState<DailyAction[]>(dailyActions);
  const { list } = useProspects();
  const setStatus = (id: string, status: DailyAction["status"]) => setActions((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
  const doneCount = actions.filter((a) => a.status === "done").length;

  const kpis = [
    { label: "Due today", value: list.filter(isDue).length, Icon: ClockIcon },
    { label: "Overdue", value: list.filter(isOverdue).length, Icon: AlertCircleIcon },
    { label: "Awaiting reply", value: list.filter((p) => p.awaitingReply).length, Icon: MessageCircleIcon },
    { label: "Pitches sent", value: list.filter((p) => ["Pitch Sent", "Negotiation"].includes(p.stage)).length, Icon: SendIcon },
    { label: "Meetings booked", value: list.filter((p) => p.meetingBooked).length, Icon: CalendarIcon },
    { label: "Clients won", value: list.filter((p) => p.stage === "Won").length, Icon: TrophyIcon },
  ];

  return (
    <div>
      <Toaster />
      <LeadsHeader
        title="Today's action plan"
        description="Thursday 15 May · target 5 actions. Mark each action complete, postponed or incomplete when you've done it yourself."
        actions={<Button asChild variant="outline" className="bg-card"><Link to="/app/leads/setup">Re-run setup</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
            <UserRecordedNote />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <p className="font-semibold">Actions</p>
            <span className="text-sm text-muted-foreground">{doneCount}/{actions.length} done</span>
          </div>
          <ul className="divide-y">
            {actions.map((a) => {
              const p = list.find((x) => x.id === a.prospectId);
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", a.status === "done" && "border-success bg-success text-white dark:text-background", a.status === "postponed" && "border-warning text-warning", a.status === "incomplete" && "border-destructive text-destructive")}>
                    {a.status === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : a.status === "postponed" ? <ClockIcon className="h-3.5 w-3.5" /> : a.status === "incomplete" ? <XIcon className="h-3.5 w-3.5" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", a.status === "done" && "text-muted-foreground line-through")}>{a.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{a.kind}{p && <> · <Link to={`/app/leads/prospects/${p.id}`} className="hover:text-foreground hover:underline">{p.business}</Link></>}</p>
                  </div>
                  {a.status === "pending" ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-8 bg-card" onClick={() => setStatus(a.id, "done")}><CheckIcon /> Done</Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => setStatus(a.id, "postponed")}>Postpone</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-muted-foreground" onClick={() => setStatus(a.id, "incomplete")}>Couldn't do</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-8 text-muted-foreground" onClick={() => setStatus(a.id, "pending")}><UndoIcon /> Undo</Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        <aside className="space-y-4">
          <div className="rounded-xl border border-ai/30 bg-ai-soft/60 p-5">
            <AiLabel>Suggested next steps</AiLabel>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• Sunrise Pharmacy has had your proposal for 3 days — a short follow-up referencing their WhatsApp booking issue fits.</li>
              <li>• Mobi Gym mentioned payments: lead your pitch with that.</li>
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">Based only on notes you've recorded.</p>
            <Button asChild size="sm" className="mt-3"><Link to="/app/leads/outreach">Draft a follow-up</Link></Button>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="font-semibold">Overdue follow-ups</p>
            <ul className="mt-2 space-y-2">
              {list.filter(isOverdue).map((p) => (
                <li key={p.id}><Link to={`/app/leads/prospects/${p.id}`} className="flex justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"><span>{p.business}</span><span className="text-xs font-medium text-destructive">{formatShortDate(p.followUp)}</span></Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Pipeline ---------------- */
export function LeadsPipelinePage() {
  const { list, setList, add } = useProspects();
  const move = (id: string, stage: LeadStage) => {
    setList((l) => l.map((p) => (p.id === id ? { ...p, stage, lastAction: `Moved to ${stage}`, lastActionDate: TODAY } : p)));
    if (stage === "Won") toast("Marked as won", { description: "Set up an engagement to manage tasks and payments.", action: { label: "Start engagement", onClick: () => toast("Engagement setup opened (demo)") } });
  };
  const closed = list.filter((p) => ["Lost", "Not Interested"].includes(p.stage));

  return (
    <div>
      <Toaster />
      <LeadsHeader title="Lead pipeline" description="Move prospects through stages as you record activity." actions={<AddProspectDialog onAdd={add} />} />
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex min-w-max gap-3">
          {activeLeadStages.map((s) => {
            const items = list.filter((p) => p.stage === s);
            return (
              <section key={s} className="w-64 shrink-0 rounded-xl border bg-muted/40 p-2.5" aria-label={s}>
                <div className="flex items-center justify-between px-1.5 pb-2"><LeadStageBadge stage={s} /><span className="text-xs tabular-nums text-muted-foreground">{items.length}</span></div>
                <ul className="space-y-2">
                  {items.map((p) => (
                    <li key={p.id} className="rounded-lg border bg-card p-3 shadow-xs">
                      <Link to={`/app/leads/prospects/${p.id}`} className="text-sm font-semibold hover:text-primary">{p.business}</Link>
                      <p className="text-xs text-muted-foreground">{p.service}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className={cn(isOverdue(p) ? "font-semibold text-destructive" : isDue(p) ? "font-semibold text-primary" : "text-muted-foreground")}>
                          {p.followUp ? (isOverdue(p) ? `Overdue · ${formatShortDate(p.followUp)}` : `Follow up ${formatShortDate(p.followUp)}`) : "No follow-up"}
                        </span>
                        {p.value > 0 && <span className="font-medium">₦{(p.value / 1000).toFixed(0)}k</span>}
                      </div>
                      <Select value={p.stage} onValueChange={(v) => move(p.id, v as LeadStage)}>
                        <SelectTrigger className="mt-2 h-7 text-xs" aria-label={`Move ${p.business}`}><SelectValue /></SelectTrigger>
                        <SelectContent>{leadStages.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </li>
                  ))}
                  {items.length === 0 && <li className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">No prospects</li>}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      {closed.length > 0 && (
        <div className="mt-6 rounded-xl border bg-card p-4">
          <p className="text-sm font-semibold">Closed ({closed.length})</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {closed.map((p) => <li key={p.id} className="flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm">{p.business} <LeadStageBadge stage={p.stage} /></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------------- Prospects ---------------- */
export function LeadsProspectsPage() {
  const { list, add } = useProspects();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const rows = useMemo(() => list.filter((p) => (stage === "all" || p.stage === stage) && `${p.business} ${p.name} ${p.service}`.toLowerCase().includes(q.toLowerCase())), [list, q, stage]);

  return (
    <div>
      <Toaster />
      <LeadsHeader title="Prospects" description="Manually entered prospect records with public business links." actions={<AddProspectDialog onAdd={add} />} />
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prospects" className="h-9 bg-card pl-9" aria-label="Search prospects" />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="h-9 w-44 bg-card" aria-label="Filter by stage"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All stages</SelectItem>{leadStages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {rows.length === 0 ? (
        <StateBlock kind="no-results" title="No prospects found" description="Add a prospect or clear filters." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Service</TableHead><TableHead>Stage</TableHead><TableHead>Last action</TableHead><TableHead>Next action</TableHead><TableHead>Follow-up</TableHead><TableHead>Outcome</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link to={`/app/leads/prospects/${p.id}`} className="font-medium hover:text-primary">{p.business}</Link>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">{p.name} · {p.channel}{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.business} website`}><ExternalLinkIcon className="h-3 w-3" /></a>}</p>
                    </TableCell>
                    <TableCell className="text-sm">{p.service}</TableCell>
                    <TableCell><LeadStageBadge stage={p.stage} /></TableCell>
                    <TableCell className="text-sm"><span>{p.lastAction}</span><p className="text-xs text-muted-foreground">{formatShortDate(p.lastActionDate)}</p></TableCell>
                    <TableCell className="text-sm">{p.nextAction}</TableCell>
                    <TableCell className={cn("whitespace-nowrap text-sm", isOverdue(p) && "font-semibold text-destructive", isDue(p) && "font-semibold text-primary")}>{formatShortDate(p.followUp)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.outcome ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Follow-up calendar ---------------- */
export function LeadsCalendarPage() {
  const { list } = useProspects();
  const [month] = useState(new Date(2025, 4, 1));
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const cells = [...Array.from({ length: offset }, () => null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const iso = (d: number) => `2025-05-${String(d).padStart(2, "0")}`;
  const upcoming = list.filter((p) => p.followUp && !["Lost", "Not Interested"].includes(p.stage)).sort((a, b) => a.followUp.localeCompare(b.followUp));

  return (
    <div>
      <LeadsHeader title="Follow-up calendar" description="Due and overdue follow-ups from your prospect records." />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" aria-label="Previous month" disabled><ChevronLeftIcon /></Button>
            <p className="font-semibold">May 2025</p>
            <Button variant="ghost" size="icon" aria-label="Next month" disabled><ChevronRightIcon /></Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="py-1"><span className="sm:hidden">{d.charAt(0)}</span><span className="hidden sm:inline">{d}</span></div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={`e-${i}`} />;
              const items = list.filter((p) => p.followUp === iso(d) && !["Lost", "Not Interested"].includes(p.stage));
              const today = iso(d) === TODAY;
              return (
                <div key={d} className={cn("min-h-[52px] rounded-lg border p-1 text-left sm:min-h-[84px] sm:p-1.5", today && "border-primary ring-1 ring-primary")}>
                  <p className={cn("text-xs", today ? "font-bold text-primary" : "text-muted-foreground")}>{d}</p>
                  {items.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-0.5 sm:hidden" aria-label={`${items.length} follow-ups`}>
                      {items.map((p) => <span key={p.id} className={cn("h-1.5 w-1.5 rounded-full", iso(d) < TODAY ? "bg-destructive" : "bg-primary")} />)}
                    </span>
                  )}
                  <ul className="mt-1 hidden space-y-0.5 sm:block">
                    {items.map((p) => (
                      <li key={p.id}><Link to={`/app/leads/prospects/${p.id}`} className={cn("block truncate rounded px-1 py-0.5 text-[11px] font-medium", iso(d) < TODAY ? "bg-destructive/10 text-destructive" : "bg-accent text-brown")}>{p.business}</Link></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <aside className="rounded-xl border bg-card p-5">
          <p className="font-semibold">Upcoming & overdue</p>
          <ul className="mt-3 space-y-2">
            {upcoming.map((p) => (
              <li key={p.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between"><Link to={`/app/leads/prospects/${p.id}`} className="text-sm font-medium hover:text-primary">{p.business}</Link><span className={cn("text-xs", isOverdue(p) ? "font-semibold text-destructive" : isDue(p) ? "font-semibold text-primary" : "text-muted-foreground")}>{isOverdue(p) ? "Overdue" : isDue(p) ? "Today" : formatShortDate(p.followUp)}</span></div>
                <p className="text-xs text-muted-foreground">{p.nextAction}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-accent" /> Upcoming</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-destructive/20" /> Overdue</span><span className="flex items-center gap-1.5"><HandshakeIcon className="h-3 w-3" /> Won clients are excluded</span><span className="flex items-center gap-1.5"><SparklesIcon className="h-3 w-3" />Demo month</span></div>
    </div>
  );
}
