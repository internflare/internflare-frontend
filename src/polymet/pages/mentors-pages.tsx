import { useMemo, useReducer, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { CalendarCheckIcon, CheckCircle2Icon, ChevronLeftIcon, ClockIcon, GaugeIcon, Loader2Icon, MessageSquareIcon, SearchIcon, StarIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { MetaChip } from "@/polymet/components/status-badges";
import { formatNgn, mentorDirectory, mentorSessions, type Mentor } from "@/polymet/data/mentors-data";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";
import { roleReadiness } from "@/polymet/lib/pathway-engine";

function useGapLabels() {
  const { candidate } = usePathway();
  const r = candidate.targetRoleId ? roleReadiness(candidate, candidate.targetRoleId) : null;
  if (!r || !r.assessment) return { labels: [] as string[], top: null as null | { label: string; detail: string } };
  const lvl = r.internship.ok ? r.job : r.internship;
  const weak = r.role.competencies.filter((c) => (r.assessment!.scores[c.id]?.score ?? 0) < 65);
  return { labels: weak.map((c) => c.label.toLowerCase()), top: lvl.unmet[0] ?? null };
}

function MentorsNav() {
  return (
    <nav aria-label="Mentorship" className="mb-6 flex gap-1 border-b">
      {[{ to: "/app/mentors", l: "Find mentors", end: true }, { to: "/app/mentors/sessions", l: "My sessions" }].map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => cn("-mb-px border-b-2 px-3 py-2 text-sm font-medium", isActive ? "border-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t.l}</NavLink>
      ))}
    </nav>
  );
}

function MentorCard({ m }: { m: Mentor }) {
  const { labels } = useGapLabels();
  const matchesGap = [...m.readinessGaps, ...m.expertise].some((g) => labels.some((l) => l.includes(g.split(" ")[0].toLowerCase())));
  return (
    <Link to={`/app/mentors/${m.id}`} className="flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12"><AvatarImage src={m.avatar} alt="" /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{m.name}</p>
          <p className="truncate text-sm text-muted-foreground">{m.title} · {m.company}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><StarIcon className="h-3 w-3 fill-warning text-warning" /> {m.rating} · {m.sessions} sessions</p>
        </div>
        <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", m.price === 0 ? "bg-success-soft text-success" : "bg-muted")}>{formatNgn(m.price)}</span>
      </div>
      {matchesGap && <p className="mt-3 flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-xs font-medium text-brown"><GaugeIcon className="h-3.5 w-3.5" /> Helps with your readiness gaps</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">{m.expertise.map((e) => <MetaChip key={e}>{e}</MetaChip>)}</div>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span>{m.formats.join(" · ")} · {m.duration} min</span>
        <span className={m.availability === "Waitlist" ? "text-warning" : "text-success"}>{m.availability}</span>
      </div>
    </Link>
  );
}

type MentorFilters = {
  query: string;
  expertise: string;
  format: string;
  price: string;
  availability: string;
};

type MentorFilterAction =
  | { type: "search-changed"; query: string }
  | { type: "expertise-selected"; expertise: string }
  | { type: "format-selected"; format: string }
  | { type: "price-selected"; price: string }
  | { type: "availability-selected"; availability: string };

function mentorFiltersReducer(
  state: MentorFilters,
  action: MentorFilterAction,
): MentorFilters {
  switch (action.type) {
    case "search-changed":
      return { ...state, query: action.query };
    case "expertise-selected":
      return { ...state, expertise: action.expertise };
    case "format-selected":
      return { ...state, format: action.format };
    case "price-selected":
      return { ...state, price: action.price };
    case "availability-selected":
      return { ...state, availability: action.availability };
  }
}

export function MentorDirectoryPage() {
  const [filters, dispatch] = useReducer(mentorFiltersReducer, {
    query: "",
    expertise: "all",
    format: "all",
    price: "all",
    availability: "all",
  });
  const { query: q, expertise, format, price, availability: avail } = filters;
  const all = Array.from(new Set(mentorDirectory.flatMap((m) => m.expertise)));
  const list = useMemo(() => mentorDirectory.filter((m) =>
    (!q || `${m.name} ${m.title} ${m.roles.join(" ")}`.toLowerCase().includes(q.toLowerCase())) &&
    (expertise === "all" || m.expertise.includes(expertise)) &&
    (format === "all" || m.formats.includes(format as Mentor["formats"][number])) &&
    (price === "all" || (price === "free" ? m.price === 0 : m.price > 0)) &&
    (avail === "all" || m.availability === avail)), [q, expertise, format, price, avail]);

  return (
    <div>
      <PageHeader title="Mentorship" description="Book sessions with practitioners. Recommendations are linked to your readiness gaps." />
      <MentorsNav />
      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="relative"><SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => dispatch({ type: "search-changed", query: e.target.value })} placeholder="Search name or role" className="h-9 bg-card pl-9" aria-label="Search mentors" /></div>
        <Select value={expertise} onValueChange={(value) => dispatch({ type: "expertise-selected", expertise: value })}><SelectTrigger className="h-9 bg-card" aria-label="Expertise"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All expertise</SelectItem>{all.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select>
        <Select value={format} onValueChange={(value) => dispatch({ type: "format-selected", format: value })}><SelectTrigger className="h-9 bg-card" aria-label="Format"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Any format</SelectItem>{["Video", "Chat", "Portfolio review"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
        <Select value={price} onValueChange={(value) => dispatch({ type: "price-selected", price: value })}><SelectTrigger className="h-9 bg-card" aria-label="Price"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Free & paid</SelectItem><SelectItem value="free">Free only</SelectItem><SelectItem value="paid">Paid only</SelectItem></SelectContent></Select>
        <Select value={avail} onValueChange={(value) => dispatch({ type: "availability-selected", availability: value })}><SelectTrigger className="h-9 bg-card" aria-label="Availability"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Any availability</SelectItem>{["This week", "Next week", "Waitlist"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
      </div>
      {list.length === 0 ? <StateBlock kind="no-results" title="No mentors match" description="Try a different expertise or format." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((m) => <MentorCard key={m.id} m={m} />)}</div>}
    </div>
  );
}

type MentorBookingState = {
  slot: string;
  goal: string;
  format: Mentor["formats"][number];
  status: "form" | "sending" | "requested";
};

type MentorBookingAction =
  | { type: "slot-selected"; slot: string }
  | { type: "goal-changed"; goal: string }
  | { type: "format-selected"; format: Mentor["formats"][number] }
  | { type: "booking-request-started" }
  | { type: "booking-request-sent" };

function mentorBookingReducer(
  state: MentorBookingState,
  action: MentorBookingAction,
): MentorBookingState {
  switch (action.type) {
    case "slot-selected":
      return { ...state, slot: action.slot };
    case "goal-changed":
      return { ...state, goal: action.goal };
    case "format-selected":
      return { ...state, format: action.format };
    case "booking-request-started":
      return { ...state, status: "sending" };
    case "booking-request-sent":
      return { ...state, status: "requested" };
  }
}

export function MentorProfilePage() {
  const { id = "chidi-eze" } = useParams();
  const m = mentorDirectory.find((x) => x.id === id);
  const [state, dispatch] = useReducer(mentorBookingReducer, {
    slot: "",
    goal: "",
    format: m?.formats[0] ?? "Video",
    status: "form",
  });
  const { slot, goal, format: fmt, status } = state;
  const { top: topGap } = useGapLabels();

  if (!m) return <StateBlock kind="no-results" title="Mentor not found" action={{ label: "All mentors", to: "/app/mentors" }} />;
  const chosen = m.slots.find((s) => s.id === slot);

  const request = () => {
    dispatch({ type: "booking-request-started" });
    setTimeout(() => dispatch({ type: "booking-request-sent" }), 700);
  };

  return (
    <div>
      <Toaster />
      <Link to="/app/mentors" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ChevronLeftIcon className="h-4 w-4" /> Mentors</Link>
      <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-5 rounded-2xl border bg-card p-6">
            <Avatar className="h-20 w-20"><AvatarImage src={m.avatar} alt={m.name} /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{m.name}</h1>
              <p className="text-muted-foreground">{m.title} · {m.company}</p>
              <p className="mt-1 flex items-center gap-1 text-sm"><StarIcon className="h-4 w-4 fill-warning text-warning" /> {m.rating} · {m.sessions} sessions</p>
            </div>
          </div>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">About</h2>
            <p className="mt-2 max-w-prose text-muted-foreground">{m.bio}</p>
            <h3 className="mt-5 text-sm font-semibold">Expertise</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">{m.expertise.map((e) => <MetaChip key={e}>{e}</MetaChip>)}</div>
            <h3 className="mt-5 text-sm font-semibold">Best for roles</h3>
            <p className="text-sm text-muted-foreground">{m.roles.join(", ")}</p>
          </section>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Fee</p><p className="mt-1 font-semibold">{formatNgn(m.price)} <span className="text-sm font-normal text-muted-foreground">/ session</span></p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Session length</p><p className="mt-1 font-semibold">{m.duration} minutes</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">Formats</p><p className="mt-1 font-semibold">{m.formats.join(", ")}</p></div>
          </section>
          <section className="rounded-xl border bg-card p-6"><h2 className="font-semibold">Cancellation terms</h2><p className="mt-1 text-sm text-muted-foreground">{m.cancellation}</p></section>
        </div>

        <aside className="h-fit rounded-xl border bg-card p-5 xl:sticky xl:top-24">
          {status === "requested" ? (
            <div className="py-4 text-center">
              <CheckCircle2Icon className="mx-auto h-12 w-12 text-success" />
              <p className="mt-3 text-lg font-semibold">Booking requested</p>
              <p className="mt-1 text-sm text-muted-foreground">{chosen?.day} · {chosen?.time}. {m.name.split(" ")[0]} will confirm within 24 hours.{m.price > 0 && " You'll pay only after confirmation — no payment has been taken."}</p>
              <Button asChild className="mt-5 w-full"><Link to="/app/mentors/sessions">View my sessions</Link></Button>
            </div>
          ) : (
            <>
              <p className="font-semibold">Request a session</p>
              {m.slots.length === 0 ? (
                <div className="mt-3 rounded-lg bg-warning-soft p-3 text-sm">No open slots. <button className="font-medium underline" onClick={() => toast("Added to waitlist")}>Join waitlist</button></div>
              ) : (
                <div className="mt-3 space-y-4">
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">Available times</legend>
                    <div className="grid gap-2">
                      {m.slots.map((s) => (
                        <button key={s.id} type="button" onClick={() => dispatch({ type: "slot-selected", slot: s.id })} aria-pressed={slot === s.id} className={cn("flex items-center justify-between rounded-lg border p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", slot === s.id ? "border-primary bg-accent/60 ring-1 ring-primary" : "hover:bg-muted")}>
                          <span className="flex items-center gap-2"><CalendarCheckIcon className="h-4 w-4 text-muted-foreground" />{s.day}</span><span className="font-medium">{s.time}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="space-y-1.5"><Label htmlFor="bk-fmt">Format</Label>
                    <Select value={fmt} onValueChange={(value) => dispatch({ type: "format-selected", format: value as Mentor["formats"][number] })}><SelectTrigger id="bk-fmt"><SelectValue /></SelectTrigger><SelectContent>{m.formats.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="bk-goal">Learning goal</Label><Textarea id="bk-goal" rows={3} value={goal} onChange={(e) => dispatch({ type: "goal-changed", goal: e.target.value })} placeholder="What do you want to get out of this session?" /></div>
                  {topGap && <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => dispatch({ type: "goal-changed", goal: `Close my readiness gap: ${topGap.label}. ${topGap.detail}` })}>Use my top readiness gap</button>}
                  <div className="flex justify-between border-t pt-3 text-sm"><span className="text-muted-foreground">Total</span><span className="font-semibold">{formatNgn(m.price)}</span></div>
                  <Button className="w-full" disabled={!slot || !goal.trim() || status === "sending"} onClick={request}>{status === "sending" && <Loader2Icon className="animate-spin" />} Request booking</Button>
                  <p className="text-xs text-muted-foreground">Times shown in the mentor's time zone.</p>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

const statusCls = { requested: "bg-warning-soft text-warning border-warning/25", confirmed: "bg-success-soft text-success border-success/25", completed: "bg-muted text-muted-foreground border-border", cancelled: "bg-destructive/10 text-destructive border-destructive/20" };

export function MentorSessionsPage() {
  const [sessions, setSessions] = useState(mentorSessions);
  const upcoming = sessions.filter((s) => s.status === "requested" || s.status === "confirmed");
  const past = sessions.filter((s) => s.status === "completed" || s.status === "cancelled");
  const mentor = (id: string) => mentorDirectory.find((m) => m.id === id)!;

  return (
    <div>
      <Toaster />
      <PageHeader title="Mentorship" description="Upcoming and past sessions, notes and payments." />
      <MentorsNav />
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Upcoming</h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {upcoming.map((s) => {
          const m = mentor(s.mentorId);
          return (
            <article key={s.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarImage src={m.avatar} alt="" /><AvatarFallback>{m.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1"><p className="font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.title}</p></div>
                <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium capitalize", statusCls[s.status])}>{s.status === "requested" ? "Awaiting confirmation" : s.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-muted-foreground" />{s.date} · {s.time}</span>
                <span className="flex items-center gap-1.5"><VideoIcon className="h-4 w-4 text-muted-foreground" />{s.format}</span>
              </div>
              <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm"><span className="font-medium">Goal:</span> {s.goal}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.status === "confirmed" && <Button size="sm" onClick={() => toast("Join link opens 10 minutes before start")}>Join session</Button>}
                <Button size="sm" variant="outline" className="bg-card" onClick={() => toast("Message sent to mentor")}><MessageSquareIcon /> Message</Button>
                <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { setSessions((x) => x.map((y) => (y.id === s.id ? { ...y, status: "cancelled", payment: y.payment === "paid" ? "refunded" : y.payment } : y))); toast("Session cancelled", { description: m.cancellation }); }}>Cancel</Button>
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Past sessions & notes</h2>
      <div className="mt-3 space-y-3">
        {past.map((s) => (
          <article key={s.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{mentor(s.mentorId).name} · {s.format}</p><span className="text-sm text-muted-foreground">{s.date}</span></div>
            <p className="mt-1 text-sm text-muted-foreground">Goal: {s.goal}</p>
            {s.notes ? <p className="mt-3 rounded-lg border-l-2 border-primary bg-muted/40 p-3 text-sm"><span className="font-medium">Mentor notes (shared with you):</span> {s.notes}</p> : <p className="mt-2 text-sm text-muted-foreground">No notes shared.</p>}
          </article>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment history</h2>
      <div className="mt-3 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Session</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id}><TableCell>{mentor(s.mentorId).name}</TableCell><TableCell>{s.date}</TableCell><TableCell className="tabular-nums">{formatNgn(s.amount)}</TableCell><TableCell className="capitalize">{s.payment === "pending" ? "Pending provider confirmation" : s.payment}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
